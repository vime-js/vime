import {
  PlayerProp,
  isExternalReadonlyPlayerProp,
  resetablePlayerProps,
  isInternalReadonlyPlayerProp,
} from './PlayerProp';
import { getEventName } from './PlayerEvent';
import { isUndefined } from '../../../utils/unit';
import { MediaProviderAdapter } from '../../providers/MediaProvider';

/**
 * This class is reponsible for tracking changes from the user, provider, plugins and UI components
 * and:
 *
 * - Ensuring no internal readonly player properties are changed by providers, plugins and UI
 *   components.
 * - Ensuring no external readonly player properties are changed by the user.
 * - Firing events on the player as property values change.
 * - Making adapter calls to update the state of the provider when certain properties change value.
 * - Resetting player state when media changes.
 */
export class Scheduler {
  private hasMediaChangedBefore = false;

  /**
   * Caches the player state.
   */
  private cache = new Map<PlayerProp, any>();

  /**
   * Tracks the state of providers/plugins/components. This is used to check if the user changes
   * any external readonly properties.
   */
  private internalState = new Map<PlayerProp, any>();

  /**
   * Tracks the state of the current provider. This is used to avoid providers triggering adapter
   * calls to make the same change back to the provider, leading to an infinite loop.
   */
  private providerState = new Map<PlayerProp, any>();

  /**
   * Tracks any adapter calls to be made per prop. The calls are made at the end of every render
   * cycle if media is ready for playback.
   */
  // eslint-disable-next-line no-spaced-func
  private adapterCalls = new Map<PlayerProp, (adapter: MediaProviderAdapter) => Promise<void>>();

  constructor(private readonly player: HTMLVimePlayerElement) {
    Object.values(PlayerProp).forEach((prop) => {
      this.cache.set(prop, this.player[prop]);
      this.internalState.set(prop, this.player[prop]);
      this.providerState.set(prop, (resetablePlayerProps as any)[prop]);
    });
  }

  async onWillRender() {
    const props = Object.values(PlayerProp);

    await this.flushAdapterCalls();

    for (let i = 0; i < props.length; i += 1) {
      const prop = props[i];
      const oldVal = this.cache.get(prop);
      const newVal = this.player[prop];
      // eslint-disable-next-line no-continue
      if (oldVal === newVal) continue;

      // Check if the user changed a readonly player property.
      const didInternalStateChange = this.internalState.get(prop) === newVal;
      if (isExternalReadonlyPlayerProp(prop) && !didInternalStateChange) {
        (this.player as any)[prop] = this.internalState.get(prop);
        console.error(`Player.${prop} is readonly. Do not attempt to change it.`);
        // eslint-disable-next-line no-continue
        continue;
      }

      this.fireEvent(prop, newVal, oldVal);
      this.cache.set(prop, newVal);
    }
  }

  private async flushAdapterCalls() {
    if (!this.player.playbackReady || (this.adapterCalls.size === 0)) return;

    const adapter = await this.player.getAdapter();

    await Promise.all(Array.from(this.adapterCalls.values()).map(async (call) => {
      try {
        await call(adapter);
      } catch (e) {
        this.player.errors = [...this.player.errors, e];
        this.markAsInternallyChanged(PlayerProp.Errors);
      }
    }));

    this.adapterCalls.clear();
  }

  private queueAdapterCall(
    prop: PlayerProp,
    callback: (adapter: MediaProviderAdapter) => Promise<void>,
  ) {
    this.adapterCalls.set(prop, callback);
  }

  onMediaChange() {
    /**
     * We don't want to clear any queues/changes on first load, because that would lose the initial
     * state of the player via the props the user passed in.
     */
    if (!this.hasMediaChangedBefore) {
      this.hasMediaChangedBefore = true;
      return;
    }

    this.adapterCalls.clear();

    Object.keys(resetablePlayerProps).forEach((prop) => {
      const value = (resetablePlayerProps as any)[prop];
      this.internalState.set(prop as PlayerProp, value);
      this.providerState.set(prop as PlayerProp, value);
      (this.player as any)[prop] = value;
    });
  }

  markAsInternallyChanged(prop: PlayerProp) {
    this.internalState.set(prop, this.player[prop]);
  }

  async onInternalStateChange(by: HTMLElement, prop: PlayerProp, value: any) {
    if (isInternalReadonlyPlayerProp(prop)) {
      throw Error(
        `INTERNAL STATECHANGE [${by.nodeName}]: attempted to change readonly prop \`${prop}\`.`,
      );
    }

    if (this.player.debug && (prop !== PlayerProp.CurrentTime)) {
      console.log(`STATECHANGE [${by.nodeName}]: ${prop} -> ${value}`);
    }

    if (prop === PlayerProp.Errors) {
      this.player.errors = [...this.player.errors, ...value];
      this.markAsInternallyChanged(prop);
      return;
    }

    const provider = await this.player.getProvider();
    const isProviderChange = ((provider as any) === by) || (provider as any)?.contains(by);
    if (isProviderChange) this.providerState.set(prop, value);

    (this.player as any)[prop] = value;
    this.markAsInternallyChanged(prop);
  }

  onPausedChange(paused: boolean) {
    if (paused === this.providerState.get(PlayerProp.Paused)) return;
    this.queueAdapterCall(
      PlayerProp.Paused,
      (adapter) => {
        this.player.paused = paused;
        return !paused ? adapter.play() : adapter.pause();
      },
    );
  }

  onCurrentTimeChange(time: number) {
    // Not really safe but only way to let initial current time pass.
    const duration = this.player.playbackReady ? this.player.duration : Infinity;
    const currentTime = Math.max(0, Math.min(time, duration));
    const providerTime = this.providerState.get(PlayerProp.CurrentTime);
    if (Math.floor(currentTime) === Math.floor(providerTime)) return;
    this.queueAdapterCall(
      PlayerProp.CurrentTime,
      (adapter) => {
        this.player.currentTime = currentTime;
        return adapter.setCurrentTime(currentTime);
      },
    );
  }

  onVolumeChange(level: number) {
    const volume = Math.max(0, Math.min(level, 100));
    if (volume === this.providerState.get(PlayerProp.Volume)) return;
    this.queueAdapterCall(
      PlayerProp.Volume,
      (adapter) => {
        this.player.volume = volume;
        return adapter.setVolume(volume);
      },
    );
  }

  onMutedChange(muted: boolean) {
    if (muted === this.providerState.get(PlayerProp.Muted)) return;
    this.queueAdapterCall(PlayerProp.Muted, (adapter) => {
      this.player.muted = muted;
      return adapter.setMuted(muted);
    });
  }

  async onPlaybackRateChange(prevRate: number, newRate: number) {
    if (newRate === this.providerState.get(PlayerProp.PlaybackRate)) return;

    let isValid = true;

    if (!(await this.player.canSetPlaybackRate())) {
      console.warn('Cannot change `playbackRate`.');
      isValid = false;
    }

    if (!this.player.playbackRates.includes(newRate)) {
      console.warn(
        `Invalid \`playbackRate\` of ${newRate}. `
      + `Valid values are [${this.player.playbackRates.join(', ')}]`,
      );
      isValid = false;
    }

    if (!isValid) {
      this.player.playbackRate = prevRate;
      this.cache.set(PlayerProp.PlaybackRate, prevRate);
      return;
    }

    this.queueAdapterCall(
      PlayerProp.PlaybackRate,
      async (adapter) => adapter.setPlaybackRate?.(newRate),
    );
  }

  async onPlaybackQualityChange(prevQuality: string, newQuality: string) {
    if (
      isUndefined(newQuality)
      || (newQuality === this.providerState.get(PlayerProp.PlaybackQuality))
    ) return;

    let isValid = true;

    if (!(await this.player.canSetPlaybackQuality())) {
      console.warn('Cannot change `playbackQuality`.');
      isValid = false;
    }

    if (!this.player.playbackQualities.includes(newQuality)) {
      console.warn(
        `Invalid \`playbackQuality\` of ${newQuality}. `
          + `Valid values are [${this.player.playbackQualities.join(', ')}]`,
      );
      isValid = false;
    }

    if (!isValid) {
      this.player.playbackQuality = prevQuality;
      this.cache.set(PlayerProp.PlaybackQuality, prevQuality);
      return;
    }

    this.queueAdapterCall(
      PlayerProp.PlaybackQuality,
      async (adapter) => adapter.setPlaybackQuality?.(newQuality),
    );
  }

  private fireEvent(prop: PlayerProp, value: any, prevVal: any) {
    const events: CustomEvent[] = [];

    events.push(new CustomEvent(getEventName(prop), {
      bubbles: false,
      detail: value,
    }));

    if ((prop === PlayerProp.Paused) && !value) {
      events.push(new CustomEvent('vPlay', { bubbles: false }));
    }

    if ((prop === PlayerProp.Seeking) && prevVal && !value) {
      events.push(new CustomEvent('vSeeked', { bubbles: false }));
    }

    events.forEach((event) => { this.player.dispatchEvent(event); });
  }

  destroy() {
    this.cache.clear();
    this.internalState.clear();
    this.providerState.clear();
    this.adapterCalls.clear();
  }
}
