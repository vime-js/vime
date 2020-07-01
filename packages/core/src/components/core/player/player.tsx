/* eslint-disable @stencil/strict-mutable */

import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  Watch,
} from '@stencil/core';
import { MediaType } from './MediaType';
import { MediaProvider, MediaProviderAdapter } from '../../providers/MediaProvider';
import { isUndefined } from '../../../utils/unit';
import { MediaPlayer } from './MediaPlayer';
import {
  isExternalReadonlyPlayerProp,
  isInternalReadonlyPlayerProp,
  PlayerProp,
  PlayerProps,
  shouldResetPropOnMediaChange,
} from './PlayerProps';
import { ViewType } from './ViewType';
import { canAutoplay, IS_MOBILE, onTouchInputChange } from '../../../utils/support';
import { Fullscreen } from './fullscreen/Fullscreen';
import { en } from './lang/en';
import { PlayerStateChange } from './PlayerState';
import { PlayerTunnel } from './PlayerTunnel';
import { firePlayerEvent } from './firePlayerEvent';
import { TextTrack } from './TextTrack';
import { Autopause } from './Autopause';

/**
 * @slot - Used to pass in providers, plugins and UI components.
 */
@Component({
  tag: 'vime-player',
  styleUrl: 'player.scss',
})
export class Player implements MediaPlayer {
  private provider?: MediaProvider;

  private adapter?: MediaProviderAdapter;

  private fullscreen?: Fullscreen;

  private autopauseMgr?: Autopause;

  private dispose: (() => void)[] = [];

  private playbackReadyQueue: (() => Promise<any>)[] = [];

  private flushingQueue?: Promise<any>;

  private cache = new Map<PlayerProp, any>();

  private cachedDefaults = new Map<PlayerProp, any>();

  private internalStateChanges = new Set<PlayerProp>();

  @Element() el!: HTMLVimePlayerElement;

  /**
   * ------------------------------------------------------
   * Props
   * ------------------------------------------------------
   */

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true }) paused = true;

  @Watch('paused')
  async onPausedChangeHandler() {
    this.callAdapterOrQueue(this.paused ? 'pause' : 'play');
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true }) playing = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true }) duration = -1;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) mediaTitle = '';

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) currentSrc?: string;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true }) currentTime = 0;

  private previousCurrentTime = 0;

  @Watch('currentTime')
  async onCurrentTimeChange() {
    if ((this.currentTime - this.previousCurrentTime) > 1) {
      this.callAdapterOrQueue('setCurrentTime', this.currentTime);
    }

    this.previousCurrentTime = this.currentTime;
  }

  /**
   * @inheritDoc
   */
  @Prop() autoplay = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) loadedMetadata = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) playbackReady = false;

  /**
   * @inheritDoc
   */
  @Prop() loop = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true }) muted = false;

  @Watch('muted')
  async onMutedChangeHandler() {
    this.callAdapterOrQueue('setMuted', this.muted);
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true }) buffered = 0;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true }) playbackRate = 1;

  private prevPlaybackRate = 1;

  @Watch('playbackRate')
  async onPlaybackRateChangeHandler() {
    if (this.prevPlaybackRate === this.playbackRate) return;

    if (!(await this.canSetPlaybackRate())) {
      console.warn('Cannot change `playbackRate`.');
      this.playbackRate = this.prevPlaybackRate;
      return;
    }

    if (!this.playbackRates.includes(this.playbackRate)) {
      console.warn(
        `Invalid \`playbackRate\` of ${this.playbackRate}. `
        + `Valid values are [${this.playbackRates.join(', ')}]`,
      );
      this.playbackRate = this.prevPlaybackRate;
      return;
    }

    this.callAdapterOrQueue('setPlaybackRate', this.playbackRate);
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) playbackRates = [1];

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true, attribute: 'media-quality' }) mediaQuality?: string;

  private prevMediaQuality?: string;

  @Watch('mediaQuality')
  async onMediaQualityChangeHandler() {
    if (this.prevMediaQuality === this.mediaQuality) return;

    if (!(await this.canSetMediaQuality())) {
      console.warn('Cannot change `mediaQuality`.');
      this.mediaQuality = this.prevMediaQuality;
      return;
    }

    if (!this.mediaQualities.includes(this.mediaQuality!)) {
      console.warn(
        `Invalid \`mediaQuality\` of ${this.mediaQuality}. `
        + `Valid values are [${this.mediaQualities.join(', ')}]`,
      );
      this.mediaQuality = this.prevMediaQuality;
      return;
    }

    this.callAdapterOrQueue('setMediaQuality', this.mediaQuality);
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) mediaQualities: string[] = [];

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true }) seeking = false;

  /**
   * @inheritDoc
   */
  @Prop() debug = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) playbackStarted = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) playbackEnded = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true }) buffering = false;

  /**
   * @inheritDoc
   */
  @Prop() controls = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) errors: Error[] = [];

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) textTracks: TextTrack[] = [];

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true }) volume = 50;

  @Watch('volume')
  async onVolumeChangeHandler() {
    this.callAdapterOrQueue('setVolume', this.volume);
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) isFullscreenActive = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true }) aspectRatio = '16:9';

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true }) viewType?: ViewType;

  @Watch('viewType')
  onViewTypeChangeHandler() {
    this.isAudioView = (this.viewType === ViewType.Audio);
    this.internalStateChanges.add(PlayerProp.IsAudioView);

    this.isVideoView = (this.viewType === ViewType.Video);
    this.internalStateChanges.add(PlayerProp.IsVideoView);
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) isAudioView = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) isVideoView = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true }) mediaType?: MediaType;

  @Watch('mediaType')
  onMediaTypeChangeHandler() {
    this.isAudio = (this.mediaType === MediaType.Audio);
    this.internalStateChanges.add(PlayerProp.IsAudio);

    this.isVideo = (this.mediaType === MediaType.Video);
    this.internalStateChanges.add(PlayerProp.IsVideo);
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) isAudio = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) isVideo = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) isLive = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) isMobile = IS_MOBILE;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) isTouch = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) isPiPActive = false;

  /**
   * @inheritDoc
   */
  @Prop() autopause = true;

  /**
   * @inheritDoc
   */
  @Prop() playsinline = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true }) language = 'en';

  /**
   * @inheritDoc
   */
  @Prop({
    mutable: true, attribute: null,
  }) translations: Record<string, Record<string, string>> = { en };

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) languages = ['en'];

  @Watch('translations')
  onLanguagesUpdateHandler() {
    this.languages = Object.keys(this.translations);
    this.internalStateChanges.add(PlayerProp.Languages);
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) i18n: Record<string, string> = en;

  @Watch('language')
  @Watch('translations')
  onI18NUpdateHandler() {
    this.i18n = { ...(this.translations[this.language] ?? en) };
    this.internalStateChanges.add(PlayerProp.I18N);
  }

  /**
   * ------------------------------------------------------
   * Events
   * ------------------------------------------------------
   */

  /**
   * @inheritDoc
   */
  @Event() vPausedChange!: EventEmitter<PlayerProps[PlayerProp.Paused]>;

  /**
   * @inheritDoc
   */
  @Event() vPlay!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event() vPlayingChange!: EventEmitter<PlayerProps[PlayerProp.Playing]>;

  /**
   * @inheritDoc
   */
  @Event() vSeekingChange!: EventEmitter<PlayerProps[PlayerProp.Seeking]>;

  /**
   * @inheritDoc
   */
  @Event() vSeeked!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event() vBufferingChange!: EventEmitter<PlayerProps[PlayerProp.Buffering]>;

  /**
   * @inheritDoc
   */
  @Event() vDurationChange!: EventEmitter<PlayerProps[PlayerProp.Duration]>;

  /**
   * @inheritDoc
   */
  @Event() vCurrentTimeChange!: EventEmitter<PlayerProps[PlayerProp.CurrentTime]>;

  /**
   * @inheritDoc
   */
  @Event() vPlaybackReady!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event() vPlaybackStarted!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event() vPlaybackEnded!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event() vBufferedChange!: EventEmitter<PlayerProps[PlayerProp.Buffered]>;

  /**
   * @inheritDoc
   */
  @Event() vTextTracksChange!: EventEmitter<PlayerProps[PlayerProp.TextTracks]>;

  /**
   * @inheritDoc
   */
  @Event() vErrorsChange!: EventEmitter<PlayerProps[PlayerProp.Errors]>;

  /**
   * @inheritDoc
   */
  @Event() vLoadStart!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event() vLoadedMetadata!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event() vCurrentSrcChange!: EventEmitter<PlayerProps[PlayerProp.CurrentSrc]>;

  /**
   * @inheritDoc
   */
  @Event() vMediaTitleChange!: EventEmitter<PlayerProps[PlayerProp.MediaTitle]>;

  /**
   * @inheritDoc
   */
  @Event() vPlaybackRateChange!: EventEmitter<PlayerProps[PlayerProp.PlaybackRate]>;

  /**
   * @inheritDoc
   */
  @Event() vPlaybackRatesChange!: EventEmitter<PlayerProps[PlayerProp.PlaybackRates]>;

  /**
   * @inheritDoc
   */
  @Event() vMediaQualityChange!: EventEmitter<PlayerProps[PlayerProp.MediaQuality]>;

  /**
   * @inheritDoc
   */
  @Event() vMediaQualitiesChange!: EventEmitter<PlayerProps[PlayerProp.MediaQualities]>;

  /**
   * @inheritDoc
   */
  @Event() vVolumeChange!: EventEmitter<PlayerProps[PlayerProp.Volume]>;

  /**
   * @inheritDoc
   */
  @Event() vViewTypeChange!: EventEmitter<PlayerProps[PlayerProp.ViewType]>;

  /**
   * @inheritDoc
   */
  @Event() vMediaTypeChange!: EventEmitter<PlayerProps[PlayerProp.MediaType]>;

  /**
   * @inheritDoc
   */
  @Event() vLiveChange!: EventEmitter<PlayerProps[PlayerProp.IsLive]>;

  /**
   * @inheritDoc
   */
  @Event() vTouchChange!: EventEmitter<PlayerProps[PlayerProp.IsTouch]>;

  /**
   * @inheritDoc
   */
  @Event() vLanguageChange!: EventEmitter<PlayerProps[PlayerProp.Language]>;

  /**
   * @inheritDoc
   */
  @Event() vLanguagesChange!: EventEmitter<PlayerProps[PlayerProp.Languages]>;

  /**
   * @inheritDoc
   */
  @Event() vFullscreenChange!: EventEmitter<PlayerProps[PlayerProp.IsFullscreenActive]>;

  /**
   * @inheritDoc
   */
  @Event() vPiPChange!: EventEmitter<PlayerProps[PlayerProp.isPiPActive]>;

  /**
   * ------------------------------------------------------
   * Methods
   * ------------------------------------------------------
   */

  /**
   * @inheritDoc
   */
  @Method()
  async getProvider<InternalPlayerType = any>(): Promise<MediaProvider<InternalPlayerType>> {
    if (!this.provider) {
      const { children } = this.el;

      let i = 0;
      while (!this.provider && i < children.length) {
        const child = children[i] as any;
        if (!isUndefined(child?.getAdapter)) this.provider = child;
        i += 1;
      }

      if (!this.provider) {
        throw Error('No media provider was found.');
      }
    }

    return this.provider!;
  }

  /**
   * @inheritDoc
   */
  @Method()
  async getAdapter<InternalPlayerType = any>(): Promise<MediaProviderAdapter<InternalPlayerType>> {
    if (!this.adapter) {
      const provider = await this.getProvider();
      this.adapter = await provider.getAdapter();
    }

    return this.adapter!;
  }

  /**
   * @inheritDoc
   */
  @Method()
  async play() {
    const adapter = await this.getAdapter();
    return adapter.play();
  }

  /**
   * @inheritDoc
   */
  @Method()
  async pause() {
    const adapter = await this.getAdapter();
    return adapter.pause();
  }

  /**
   * @inheritDoc
   */
  @Method()
  async canPlay(type: string) {
    const adapter = await this.getAdapter();
    return adapter.canPlay(type);
  }

  /**
   * @inheritDoc
   */
  @Method()
  async canAutoplay() {
    return canAutoplay();
  }

  /**
   * @inheritDoc
   */
  @Method()
  async canMutedAutoplay() {
    return canAutoplay(true);
  }

  /**
   * @inheritDoc
   */
  @Method()
  async canSetPlaybackRate() {
    const adapter = await this.getAdapter();
    return adapter.canSetPlaybackRate?.() ?? false;
  }

  /**
   * @inheritDoc
   */
  @Method()
  async canSetMediaQuality(): Promise<boolean> {
    const adapter = await this.getAdapter();
    return adapter.canSetMediaQuality?.() ?? false;
  }

  /**
   * @inheritDoc
   */
  @Method()
  async canSetFullscreen() {
    const adapter = await this.getAdapter();
    return this.fullscreen!.isSupported || (adapter.canSetFullscreen?.() ?? false);
  }

  /**
   * @inheritDoc
   */
  @Method()
  async enterFullscreen(options?: FullscreenOptions) {
    if (!this.isVideoView) throw Error('Cannot enter fullscreen when in an audio player view.');
    if (this.fullscreen!.isSupported) return this.fullscreen!.enterFullscreen(options);
    const adapter = await this.getAdapter();
    if (adapter.canSetFullscreen?.() ?? false) return adapter.enterFullscreen?.(options);
    throw Error('Fullscreen API is not available.');
  }

  /**
   * @inheritDoc
   */
  @Method()
  async exitFullscreen() {
    return this.fullscreen!.exitFullscreen();
  }

  /**
   * @inheritDoc
   */
  @Method()
  async canSetPiP() {
    const adapter = await this.getAdapter();
    return adapter.canSetPiP?.() ?? false;
  }

  /**
   * @inheritDoc
   */
  @Method()
  async enterPiP() {
    if (!this.isVideoView) throw Error('Cannot enter PiP mode when in an audio player view.');
    if (!(await this.canSetPiP())) throw Error('Picture-in-Picture API is not available.');
    const adapter = await this.getAdapter();
    return adapter.enterPiP!();
  }

  /**
   * @inheritDoc
   */
  @Method()
  async exitPiP() {
    const adapter = await this.getAdapter();
    return adapter.exitPiP?.();
  }

  /**
   * @inheritDoc
   */
  @Method()
  async extendLanguage(language: string, translations: Record<string, string>) {
    this.translations = {
      ...this.translations,
      [language]: {
        ...(this.translations[language] ?? {}),
        ...translations,
      },
    };

    this.internalStateChanges.add(PlayerProp.Translations);
  }

  /**
   * **TESTING:** Used to wait for the playback ready queue to be flushed.
   */
  @Method()
  async waitForQueueToFlush() {
    return this.flushingQueue;
  }

  @Listen('vStateChange')
  async onStateChangeHandler(event: CustomEvent<PlayerStateChange>) {
    const change = event.detail;

    if (this.debug) {
      console.log(`STATECHANGE [${change.by}]: ${change.prop} -> ${change.value}`);
    }

    if (isInternalReadonlyPlayerProp(change.prop)) {
      throw Error(`INTERNAL: ${change.by} attempted to change readonly prop \`${change.prop}\`.`);
    }

    if (change.prop === PlayerProp.CurrentSrc) this.onMediaChange();
    if (change.prop === PlayerProp.PlaybackRate) this.prevPlaybackRate = change.value;
    if (change.prop === PlayerProp.MediaQuality) this.prevMediaQuality = change.value;

    if (change.prop === PlayerProp.PlaybackReady && change.value) {
      this.flushPlaybackReadyQueue().then(() => {});
    }

    (this as any)[change.prop] = change.value;
    this.internalStateChanges.add(change.prop);
  }

  connectedCallback() {
    // Cache default states so we can reset them when media changes.
    Object.values(PlayerProp).forEach((prop) => {
      this.cachedDefaults.set(prop, this[prop]);
    });

    this.cache = new Map(this.cachedDefaults);

    this.autopauseMgr = new Autopause(this);

    this.fullscreen = new Fullscreen(
      this.el,
      (isActive) => {
        this.isFullscreenActive = isActive;
        this.internalStateChanges.add(PlayerProp.IsFullscreenActive);
      },
    );

    this.dispose.push(
      onTouchInputChange((isTouchInput) => {
        this.isTouch = isTouchInput;
        this.internalStateChanges.add(PlayerProp.IsTouch);
      }),
    );
  }

  componentDidUpdate() {
    this.cache.forEach((oldVal, prop) => {
      const newVal = this[prop];

      if (newVal !== oldVal) {
        if (isExternalReadonlyPlayerProp(prop) && !this.internalStateChanges.has(prop)) {
          throw Error(`Player.${prop} is readonly. Do not attempt to change it.`);
        }

        if ((prop === PlayerProp.Paused) && !(newVal as boolean)) { this.autopauseMgr!.willPlay(); }

        firePlayerEvent(this, prop, newVal);
        this.cache.set(prop, newVal);
      }

      this.internalStateChanges.delete(prop);
    });
  }

  disconnectedCallback() {
    this.autopauseMgr!.destroy();
    this.fullscreen!.destroy();
    this.dispose.forEach((fn) => fn);
    this.dispose = [];
    this.playbackReadyQueue = [];
    this.flushingQueue = undefined;
    this.cache = new Map();
    this.cachedDefaults = new Map();
    this.internalStateChanges = new Set();
    this.provider = undefined;
    this.fullscreen = undefined;
    this.autopauseMgr = undefined;
    this.adapter = undefined;
  }

  private calcAspectRatio() {
    const [width, height] = this.aspectRatio.split(':');
    return (100 / Number(width)) * Number(height);
  }

  private onMediaChange() {
    this.playbackReadyQueue = [];

    Object.values(PlayerProp).forEach((prop) => {
      if (shouldResetPropOnMediaChange(prop)) {
        (this as any)[prop] = this.cachedDefaults.get(prop);
        this.internalStateChanges.add(prop);
      }
    });
  }

  private async flushPlaybackReadyQueue() {
    try {
      this.flushingQueue = Promise.all(this.playbackReadyQueue.map((fn) => fn()));
      await this.flushingQueue;
    } catch (e) {
      this.errors = [...this.errors, e];
      this.internalStateChanges.add(PlayerProp.Errors);
    }

    this.playbackReadyQueue = [];
  }

  private callAdapterOrQueue(method: keyof MediaProviderAdapter, value?: any) {
    const action = async () => {
      const adapter = await this.getAdapter();
      return ((adapter as any)[method])(value);
    };

    this.playbackReadyQueue.push(() => action());
    if (this.playbackReady) this.flushPlaybackReadyQueue().then(() => {});
  }

  render() {
    const playerState: any = Object
      .values(PlayerProp)
      .reduce((state, prop) => ({ ...state, [prop]: this[prop] }), {});

    return (
      <Host
        tabindex="0"
        style={{
          paddingBottom: this.isVideoView && !this.isFullscreenActive
            ? `${this.calcAspectRatio()}%`
            : undefined,
        }}
        class={{
          video: this.isVideoView,
          fullscreen: this.isFullscreenActive,
        }}
      >
        <PlayerTunnel.Provider state={playerState}>
          { !this.controls && this.isVideoView && <div class="blocker" /> }

          <slot />
        </PlayerTunnel.Provider>
      </Host>
    );
  }
}
