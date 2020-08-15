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
  forceUpdate,
} from '@stencil/core';
import { Universe } from 'stencil-wormhole';
import { HTMLStencilElement } from '@stencil/core/internal';
import { MediaType } from './MediaType';
import { MediaProvider, MediaProviderAdapter } from '../../providers/MediaProvider';
import { isUndefined, isString, isNull } from '../../../utils/unit';
import { MediaPlayer } from './MediaPlayer';
import {
  isExternalReadonlyPlayerProp,
  isInternalReadonlyPlayerProp,
  PlayerProp,
  PlayerProps,
  resetablePlayerProps,
} from './PlayerProp';
import { ViewType } from './ViewType';
import {
  canAutoplay, IS_MOBILE, onTouchInputChange, IS_IOS,
} from '../../../utils/support';
import { Fullscreen } from './fullscreen/Fullscreen';
import { en } from './lang/en';
import { PlayerStateChange } from './PlayerState';
import { Autopause } from './Autopause';
import { getEventName } from './PlayerEvent';
import { Disposal } from './Disposal';
import { listen } from '../../../utils/dom';
import { lazyLoader } from './lazyLoader';

let idCount = 0;

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

  private disposal = new Disposal();

  // Keeps track of the active caption as we toggle mode/visibility.
  private toggledCaption?: TextTrack;

  /**
   * Cache of all property values to determine what events to fire when the component updates. This
   * is updated in the `componentDidUpdate` lifecycle method.
   */
  private cache = new Map<PlayerProp, any>();

  /**
   * Tracks changes that come from providers/plugins/components and not from the user. This is used
   * to check if the user changes any external readonly properties.
   */
  private internalStateChanges = new Set<PlayerProp>();

  /**
   * Tracks changes that come specifically from the current provider. This is used to avoid
   * providers triggering adapter calls to make the same change back to the provider, leading
   * to an infinite loop.
   */
  private providerStateChanges: Record<PlayerProp, number> = {} as any;

  /**
   * Internal state management to sync changes across user, provider, plugin and component updates.
   * This is flushed every Stencil.js render cycle in the `componentWillRender` lifecycle method.
   */
  // eslint-disable-next-line no-spaced-func
  private pendingStateChanges = new Map<symbol, () => Promise<void>>();

  /**
   * Tracks any adapter calls that are made before the media is ready for playback. This is flushed
   * once the media is ready.
   */
  // eslint-disable-next-line no-spaced-func
  private playbackReadyCalls?: Map<PlayerProp, () => Promise<void>> = new Map();

  // State changes that require a little special treatment such as calling a method when changed.
  private specialStateChange = new Set([
    PlayerProp.IsFullscreenActive,
    PlayerProp.IsPiPActive,
    PlayerProp.IsCaptionsActive,
  ]);

  @Element() el!: HTMLVimePlayerElement;

  /**
   * ------------------------------------------------------
   * Props
   * ------------------------------------------------------
   */

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) paused = true;

  @Watch('paused')
  async onPausedChange() {
    await this.queueAdapterCall(PlayerProp.Paused, this.paused ? 'pause' : 'play');
    if (this.paused) await this.queuePropChange(PlayerProp.Playing, false);
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) playing = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) duration = -1;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) mediaTitle?: string;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) currentSrc?: string;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) currentPoster?: string;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) currentTime = 0;

  @Watch('currentTime')
  async onCurrentTimeChange() {
    await this.queueAdapterCall(
      PlayerProp.CurrentTime,
      'setCurrentTime',
      Math.max(0, Math.min(this.currentTime, this.playbackReady ? this.duration : Infinity)),
    );
  }

  /**
   * @inheritDoc
   */
  @Prop() autoplay = false;

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
  @Prop({ mutable: true }) muted = false;

  @Watch('muted')
  async onMutedChange() {
    await this.queueAdapterCall(PlayerProp.Muted, 'setMuted', this.muted);
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) buffered = 0;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) playbackRate = 1;

  private prevPlaybackRate = 1;

  @Watch('playbackRate')
  async onPlaybackRateChange() {
    this.queueAdapterCall(
      PlayerProp.PlaybackRate,
      'setPlaybackRate',
      this.playbackRate,
      async () => {
        if (!(await this.canSetPlaybackRate())) {
          console.warn('Cannot change `playbackRate`.');
          await this.queuePropChange(PlayerProp.PlaybackRate, this.prevPlaybackRate);
          return false;
        }

        if (!this.playbackRates.includes(this.playbackRate)) {
          console.warn(
            `Invalid \`playbackRate\` of ${this.playbackRate}. `
        + `Valid values are [${this.playbackRates.join(', ')}]`,
          );
          await this.queuePropChange(PlayerProp.PlaybackRate, this.prevPlaybackRate);
          return false;
        }

        this.prevPlaybackRate = this.playbackRate;
        return true;
      },
    );
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) playbackRates = [1];

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) playbackQuality?: string;

  private prevPlaybackQuality?: string;

  @Watch('playbackQuality')
  async onPlaybackQualityChange() {
    this.queueAdapterCall(
      PlayerProp.PlaybackQuality,
      'setPlaybackQuality',
      this.playbackQuality,
      async () => {
        if (!(await this.canSetPlaybackQuality())) {
          console.warn('Cannot change `playbackQuality`.');
          await this.queuePropChange(PlayerProp.PlaybackQuality, this.prevPlaybackQuality);
          return false;
        }

        if (!this.playbackQualities.includes(this.playbackQuality!)) {
          console.warn(
            `Invalid \`playbackQuality\` of ${this.playbackQuality}. `
        + `Valid values are [${this.playbackQualities.join(', ')}]`,
          );
          await this.queuePropChange(PlayerProp.PlaybackQuality, this.prevPlaybackQuality);
          return false;
        }

        this.prevPlaybackQuality = this.playbackQuality;
        return true;
      },
    );
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) playbackQualities: string[] = [];

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) seeking = false;

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
  @Prop({ mutable: true }) buffering = false;

  /**
   * @inheritDoc
   */
  @Prop() controls = false;

  /**
   * @inheritDoc
   */
  @Prop() isControlsActive = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) errors: any[] = [];

  @Watch('errors')
  onErrorsChange() {
    if (this.debug) console.error(this.errors[this.errors.length - 1]);
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) textTracks?: TextTrackList;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) currentCaption?: TextTrack;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) isCaptionsActive = false;

  private textTracksChangeListener?: (() => void);

  @Watch('textTracks')
  onTextTracksChange() {
    if (isUndefined(this.textTracks)) {
      this.textTracksChangeListener?.();
      this.queuePropChange(PlayerProp.CurrentCaption, undefined);
      this.queuePropChange(PlayerProp.IsCaptionsActive, false);
      return;
    }

    this.onActiveCaptionChange();
    this.textTracksChangeListener = listen(
      this.textTracks!,
      'change',
      this.onActiveCaptionChange.bind(this),
    );
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) isSettingsActive = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) volume = 50;

  @Watch('volume')
  async onVolumeChange() {
    await this.queueAdapterCall(
      PlayerProp.Volume,
      'setVolume',
      Math.max(0, Math.min(this.volume, 100)),
    );
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) isFullscreenActive = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) aspectRatio = '16:9';

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) viewType?: ViewType;

  @Watch('viewType')
  async onViewTypeChange() {
    await this.queuePropChange(PlayerProp.IsAudioView, (this.viewType === ViewType.Audio));
    await this.queuePropChange(PlayerProp.IsVideoView, (this.viewType === ViewType.Video));
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
  @Prop({ mutable: true }) mediaType?: MediaType;

  @Watch('mediaType')
  async onMediaTypeChange() {
    await this.queuePropChange(PlayerProp.IsAudio, (this.mediaType === MediaType.Audio));
    await this.queuePropChange(PlayerProp.IsVideo, (this.mediaType === MediaType.Video));
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

  @Watch('duration')
  onLiveChange() {
    this.queuePropChange(PlayerProp.IsLive, (this.duration === Infinity));
  }

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
  @Prop({ mutable: true }) language = 'en';

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
  async onLanguagesUpdate() {
    await this.queuePropChange(PlayerProp.Languages, Object.keys(this.translations));
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) i18n: Record<string, string> = en;

  @Watch('language')
  @Watch('translations')
  async onI18NUpdate() {
    await this.queuePropChange(PlayerProp.I18N, { ...(this.translations[this.language] ?? en) });
  }

  /**
   * Whether the skeleton loading animation should be shown while media is loading.
   */
  @Prop() noSkeleton = false;

  /**
   * ------------------------------------------------------
   * Events
   * ------------------------------------------------------
   */

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vPausedChange!: EventEmitter<PlayerProps[PlayerProp.Paused]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vPlay!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vPlayingChange!: EventEmitter<PlayerProps[PlayerProp.Playing]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vSeekingChange!: EventEmitter<PlayerProps[PlayerProp.Seeking]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vSeeked!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vBufferingChange!: EventEmitter<PlayerProps[PlayerProp.Buffering]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vDurationChange!: EventEmitter<PlayerProps[PlayerProp.Duration]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vCurrentTimeChange!: EventEmitter<PlayerProps[PlayerProp.CurrentTime]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vPlaybackReady!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vPlaybackStarted!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vPlaybackEnded!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vBufferedChange!: EventEmitter<PlayerProps[PlayerProp.Buffered]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vTextTracksChange!: EventEmitter<PlayerProps[PlayerProp.TextTracks]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vErrorsChange!: EventEmitter<PlayerProps[PlayerProp.Errors]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vLoadStart!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vCurrentSrcChange!: EventEmitter<PlayerProps[PlayerProp.CurrentSrc]>;

  /**
   * @inheritDoc
   */
  @Event({
    bubbles: false,
  }) vCurrentPosterChange!: EventEmitter<PlayerProps[PlayerProp.CurrentPoster]>;

  /**
   * @inheritDoc
   */
  @Event({
    bubbles: false,
  }) vMediaTitleChange!: EventEmitter<PlayerProps[PlayerProp.MediaTitle]>;

  /**
   * @inheritDoc
   */
  @Event({
    bubbles: false,
  }) vControlsChange!: EventEmitter<PlayerProps[PlayerProp.IsControlsActive]>;

  /**
   * @inheritDoc
   */
  @Event({
    bubbles: false,
  }) vPlaybackRateChange!: EventEmitter<PlayerProps[PlayerProp.PlaybackRate]>;

  /**
   * @inheritDoc
   */
  @Event({
    bubbles: false,
  }) vPlaybackRatesChange!: EventEmitter<PlayerProps[PlayerProp.PlaybackRates]>;

  /**
   * @inheritDoc
   */
  @Event({
    bubbles: false,
  }) vPlaybackQualityChange!: EventEmitter<PlayerProps[PlayerProp.PlaybackQuality]>;

  /**
   * @inheritDoc
   */
  @Event({
    bubbles: false,
  }) vPlaybackQualitiesChange!: EventEmitter<PlayerProps[PlayerProp.PlaybackQualities]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vMutedChange!: EventEmitter<PlayerProps[PlayerProp.Muted]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vVolumeChange!: EventEmitter<PlayerProps[PlayerProp.Volume]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vViewTypeChange!: EventEmitter<PlayerProps[PlayerProp.ViewType]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vMediaTypeChange!: EventEmitter<PlayerProps[PlayerProp.MediaType]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vLiveChange!: EventEmitter<PlayerProps[PlayerProp.IsLive]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vTouchChange!: EventEmitter<PlayerProps[PlayerProp.IsTouch]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vLanguageChange!: EventEmitter<PlayerProps[PlayerProp.Language]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vLanguagesChange!: EventEmitter<PlayerProps[PlayerProp.Languages]>;

  /**
   * @inheritDoc
   */
  @Event({
    bubbles: false,
  }) vFullscreenChange!: EventEmitter<PlayerProps[PlayerProp.IsFullscreenActive]>;

  /**
   * @inheritDoc
   */
  @Event({ bubbles: false }) vPiPChange!: EventEmitter<PlayerProps[PlayerProp.IsPiPActive]>;

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
   * @internal
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
  async canSetPlaybackQuality() {
    const adapter = await this.getAdapter();
    return adapter.canSetPlaybackQuality?.() ?? false;
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
    if (!this.isVideoView) throw Error('Cannot enter fullscreen on an audio player view.');
    if (this.fullscreen!.isSupported) return this.fullscreen!.enterFullscreen(options);
    const adapter = await this.getAdapter();
    if (await adapter.canSetFullscreen?.()) return adapter.enterFullscreen?.(options);
    throw Error('Fullscreen API is not available.');
  }

  /**
   * @inheritDoc
   */
  @Method()
  async exitFullscreen() {
    if (this.fullscreen!.isSupported) return this.fullscreen!.exitFullscreen();
    const adapter = await this.getAdapter();
    return adapter.exitFullscreen?.();
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
    if (!this.isVideoView) throw Error('Cannot enter PiP mode on an audio player view.');
    if (!(await this.canSetPiP())) throw Error('Picture-in-Picture API is not available.');
    const adapter = await this.getAdapter();
    return adapter.enterPiP?.();
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
    await this.queuePropChange(PlayerProp.Translations, {
      ...this.translations,
      [language]: {
        ...(this.translations[language] ?? {}),
        ...translations,
      },
    });
  }

  private isFirstMediaChange = true;

  @Listen('vLoadStart')
  async onMediaChange(event: Event) {
    event.stopPropagation();

    Object.values(PlayerProp).forEach((prop) => { this.providerStateChanges[prop] = 0; });

    /**
     * We don't want to clear any queues/changes on first load, because that would lose the initial
     * state of the player via the props the user passed in.
     */
    if (this.isFirstMediaChange) {
      this.isFirstMediaChange = false;
      return;
    }

    this.playbackReadyCalls?.clear();

    // Should only clear necessary state changes.
    const canResetProp = new Set(Object.keys(resetablePlayerProps));
    Array.from(this.pendingStateChanges.keys()).forEach((key) => {
      const prop = key.toString().match(/: ([a-zA-z]+) -/)?.[1];
      if (canResetProp.has(prop ?? '')) this.pendingStateChanges.delete(key);
    });

    await this.queueStateChange('[VIME-PLAYER]: media change', async () => {
      Object.keys(resetablePlayerProps).forEach((prop) => {
        this.internalStateChanges.add(prop as PlayerProp);
        (this as any)[prop] = (resetablePlayerProps as any)[prop];
      });
    });

    forceUpdate(this);
  }

  @Listen('vStateChange')
  async onStateChange(event: CustomEvent<PlayerStateChange>) {
    event.stopImmediatePropagation();

    const { by, prop, value } = event.detail;

    if (isInternalReadonlyPlayerProp(prop)) {
      throw Error(
        `INTERNAL STATECHANGE [${by.nodeName}]: attempted to change readonly prop \`${prop}\`.`,
      );
    }

    if (prop === PlayerProp.Errors) {
      this.queuePropChange(prop, [...this.errors, ...value], by.nodeName);
      return;
    }

    const isProvider = ((this.provider as any) === by) || (this.provider as any)?.contains(by);
    if ((isProvider)) {
      if (prop === PlayerProp.PlaybackRate) this.prevPlaybackRate = value;
      if (prop === PlayerProp.PlaybackQuality) this.prevPlaybackQuality = value;
    }

    if (!isProvider && this.specialStateChange.has(prop)) {
      this.onSpecialStateChange(by, prop, value);
      return;
    }

    await this.queuePropChange(prop, value, by.nodeName, isProvider);
  }

  connectedCallback() {
    Object.values(PlayerProp).forEach((prop) => {
      this.providerStateChanges[prop] = 0;
      this.cache.set(prop, this[prop]);
    });

    this.autopauseMgr = new Autopause(this);

    this.fullscreen = new Fullscreen(
      this.el,
      (isActive) => { this.queuePropChange(PlayerProp.IsFullscreenActive, isActive); },
    );

    this.disposal.add(
      onTouchInputChange((isTouch) => {
        this.internalStateChanges.add(PlayerProp.IsTouch);
        this.isTouch = isTouch;
      }),
    );

    /**
     * We call these watchers because they're not called on first load, and we want to queue the
     * adapter calls to run when media is ready for playback.
     */
    this.onMutedChange();
    this.onVolumeChange();
    if (!this.paused) this.onPausedChange();
    if (this.currentTime > 0) this.onCurrentTimeChange();
  }

  componentWillLoad() {
    Universe.create(this, this.getPlayerState());
    return this.getProvider() as Promise<any>;
  }

  componentDidLoad() {
    this.disposal.add(lazyLoader(this.el));
  }

  componentWillRender() {
    if (this.debug) {
      console.log(`======> RENDER [${this.pendingStateChanges.size}] <=====`);
      console.log(this.getPlayerState());
      console.log(Array.from(this.pendingStateChanges.keys()));
    }

    return Promise
      .all(Array.from(this.pendingStateChanges.values()).map((fn) => fn()))
      .then(() => this.flushPlaybackReadyCalls());
  }

  componentDidRender() {
    // Queue another render if any state changes occurred while rendering.
    if (this.pendingStateChanges.size > 0) forceUpdate(this);
  }

  componentDidUpdate() {
    this.cache.forEach((oldVal, prop) => {
      const newVal = (this as any)[prop];

      if (newVal !== oldVal) {
        if (isExternalReadonlyPlayerProp(prop) && !this.internalStateChanges.has(prop)) {
          throw Error(`Player.${prop} is readonly. Do not attempt to change it.`);
        }

        if ((prop === PlayerProp.Paused) && !(newVal as boolean)) { this.autopauseMgr!.willPlay(); }

        this.fireEvent(prop, newVal);
        this.cache.set(prop, newVal);
      }

      this.internalStateChanges.delete(prop);
    });
  }

  disconnectedCallback() {
    this.textTracksChangeListener?.();
    this.autopauseMgr!.destroy();
    this.fullscreen!.destroy();
    this.disposal.empty();
    this.pendingStateChanges.clear();
    this.playbackReadyCalls = undefined;
    this.toggledCaption = undefined;
    this.provider = undefined;
    this.fullscreen = undefined;
    this.autopauseMgr = undefined;
    this.adapter = undefined;
  }

  private getPlayerState() {
    return Object.values(PlayerProp)
      .reduce((state, prop) => ({ ...state, [prop]: this[prop] }), {});
  }

  private fireEvent(prop: PlayerProp, value: any) {
    (this as any)[getEventName(prop)]?.emit(value);
    if ((prop === PlayerProp.Paused) && !value) this.vPlay.emit();
    if ((prop === PlayerProp.Seeking) && this.cache.get(PlayerProp.Seeking) && !value) {
      this.vSeeked.emit();
    }
  }

  private calcAspectRatio() {
    const [width, height] = this.aspectRatio.split(':');
    return (100 / Number(width)) * Number(height);
  }

  private async onSpecialStateChange(by: HTMLStencilElement, prop: string, value: any) {
    if (prop === PlayerProp.IsPiPActive) this.queuePiPChange(by, value);
    if (prop === PlayerProp.IsFullscreenActive) this.queueFullscreenChange(by, value);
    if (prop === PlayerProp.IsCaptionsActive) this.toggleCaptionsVisiblity(value);
  }

  private async executeStateChange(change: () => Promise<void>) {
    try {
      await change();
    } catch (e) {
      this.internalStateChanges.add(PlayerProp.Errors);
      this.errors = [...this.errors, e];
    }
  }

  private async flushPlaybackReadyCalls() {
    if (isUndefined(this.playbackReadyCalls) || !this.playbackReady) return;
    await Promise.all(Array.from(this.playbackReadyCalls!.values())
      .map((adapterCall) => this.executeStateChange(adapterCall)));
    this.playbackReadyCalls = undefined;
  }

  /**
   * @internal Exposed for E2E testing.
   */
  @Method()
  async callAdapter(method: keyof MediaProviderAdapter, value?: any) {
    const adapter = await this.getAdapter();
    return (adapter as any)[method](value);
  }

  /**
   * @internal Exposed for E2E testing.
   */
  @Method()
  async queuePropChange(prop: PlayerProp, value: any, by?: string, byProvider = false) {
    this.queueStateChange(`[${by ?? 'VIME-PLAYER'}]: ${prop} -> ${value}`, async () => {
      if (this[prop] === value) return;
      if (byProvider) this.providerStateChanges[prop] += 1;
      this.internalStateChanges.add(prop);
      (this as any)[prop] = value;
    });
  }

  /**
   * @internal Exposed for E2E testing.
   */
  @Method()
  async queueStateChange(description: string, change: () => Promise<void>) {
    const stateChangeId = Symbol(description) as any;

    this.pendingStateChanges.set(stateChangeId, async () => {
      await this.executeStateChange(change);
      this.pendingStateChanges.delete(stateChangeId);
    });

    forceUpdate(this);
  }

  private async queuePiPChange(by: HTMLStencilElement, toggle: boolean) {
    await this.queueStateChange(
      `[${by.nodeName}]: ${toggle ? 'enter' : 'exit'}PiP()`,
      async () => {
        await (toggle ? this.enterPiP() : this.exitPiP());
      },
    );
  }

  private async queueFullscreenChange(by: HTMLStencilElement, toggle: boolean) {
    await this.queueStateChange(
      `[${by.nodeName}]: ${toggle ? 'enter' : 'exit'}Fullscreen()`,
      async () => {
        await (toggle ? this.enterFullscreen() : this.exitFullscreen());
      },
    );
  }

  private hasCustomControls() {
    return !isNull(this.el.querySelector('vime-ui vime-controls'));
  }

  private hasCustomCaptions() {
    return !isNull(this.el.querySelector('vime-ui > vime-captions'));
  }

  private getActiveCaption() {
    return Array.from(this.textTracks ?? [])
      .filter((track) => (track.kind === 'subtitles') || (track.kind === 'captions'))
      .find((track) => track.mode === (this.hasCustomCaptions() ? 'hidden' : 'showing'));
  }

  private onActiveCaptionChange() {
    const activeCaption = this.getActiveCaption();
    this.queuePropChange(PlayerProp.CurrentCaption, activeCaption || this.toggledCaption);
    this.queuePropChange(PlayerProp.IsCaptionsActive, !isUndefined(activeCaption));
  }

  private async toggleCaptionsVisiblity(toggle: boolean) {
    if (
      isUndefined(this.textTracks)
      || (toggle && isUndefined(this.toggledCaption))
      || (!toggle && isUndefined(this.getActiveCaption()))
    ) return;

    if (toggle) {
      this.toggledCaption!.mode = 'showing';
      this.toggledCaption = undefined;
      return;
    }

    const activeCaption = this.getActiveCaption();
    this.toggledCaption = activeCaption;
    activeCaption!.mode = this.hasCustomCaptions() ? 'disabled' : 'hidden';
  }

  private queueAdapterCall(
    changedProp: PlayerProp,
    method: keyof MediaProviderAdapter,
    value?: any,
    validator?: () => Promise<boolean>,
  ) {
    /**
     * If the provider triggered this change then don't make an adapter call because we can end
     * up in an infinite loop.
     */
    if (this.providerStateChanges[changedProp] > 0) {
      this.providerStateChanges[changedProp] -= 1;
      return;
    }

    const callAdapter = async () => {
      const isValid = await validator?.();
      if (!isUndefined(validator) && !isValid) return;
      await this.callAdapter(method, value);
    };

    if (!isUndefined(this.playbackReadyCalls) && !this.playbackReady) {
      this.playbackReadyCalls!.set(changedProp, callAdapter);
      return;
    }

    this.queueStateChange(`[VIME-PLAYER]: ${method}(${value})`, callAdapter);
  }

  private genId() {
    const id = this.el?.id;
    if (isString(id) && id.length > 0) return id;
    idCount += 1;
    return `vime-player-${idCount}`;
  }

  render() {
    const label = `${this.isAudioView ? 'Audio Player' : 'Video Player'}`
      + `${!isUndefined(this.mediaTitle) ? ` - ${this.mediaTitle}` : ''}`;

    const canShowCustomUI = !IS_IOS
      || !this.isVideoView
      || (this.playsinline && !this.isFullscreenActive);

    return (
      <Host
        id={this.genId()}
        tabindex="0"
        aria-label={label}
        aria-hidden={!this.playbackReady ? 'true' : 'false'}
        style={{
          paddingBottom: this.isVideoView ? `${this.calcAspectRatio()}%` : undefined,
        }}
        class={{
          idle: canShowCustomUI
            && this.hasCustomControls()
            && this.isVideoView
            && !this.paused
            && !this.isControlsActive,
          mobile: this.isMobile,
          touch: this.isTouch,
          audio: this.isAudioView,
          video: this.isVideoView,
          fullscreen: this.isFullscreenActive,
        }}
      >
        {
          !this.noSkeleton && (
            <div
              class={{
                skeleton: true,
                active: !this.playbackReady,
              }}
            />
          )
        }

        {
          !this.controls
          && canShowCustomUI
          && this.isVideoView
          && <div class="blocker" />
        }

        <Universe.Provider state={this.getPlayerState()}>
          <slot />
        </Universe.Provider>
      </Host>
    );
  }
}
