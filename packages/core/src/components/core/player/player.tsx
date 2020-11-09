import {
  Component, Element, Event, EventEmitter, getElement, h, Host,
  Listen, Method, Prop, State, Watch, writeTask,
} from '@stencil/core';
import { Universe } from 'stencil-wormhole';
import { MediaType } from './MediaType';
import { AdapterHost, MediaProviderAdapter } from '../../providers/MediaProvider';
import { Provider } from '../../providers/Provider';
import { isUndefined, isString, isNull } from '../../../utils/unit';
import { MediaPlayer } from './MediaPlayer';
import {
  initialState,
  isProviderWritableProp,
  isWritableProp,
  PlayerProp,
  PlayerProps,
  ProviderWritableProps,
  shouldPropResetOnMediaChange,
} from './PlayerProps';
import { ViewType } from './ViewType';
import {
  canAutoplay, IS_MOBILE, onTouchInputChange, IS_IOS, canRotateScreen,
} from '../../../utils/support';
import { Fullscreen } from './fullscreen/Fullscreen';
import { en } from './lang/en';
import { StateChange } from './PlayerDispatcher';
import { Disposal } from './Disposal';
import { listen } from '../../../utils/dom';
import { Autopause } from './Autopause';
import { Logger } from './PlayerLogger';
import { getEventName } from './PlayerEvents';
import { Translation } from './lang/Translation';

let idCount = 0;
const immediateAdapterCall = new Set<PlayerProp>(['currentTime', 'paused']);

/**
 * @slot - Used to pass in providers, plugins and UI components.
 */
@Component({
  tag: 'vime-player',
  styleUrl: 'player.scss',
})
export class Player implements MediaPlayer {
  private provider?: AdapterHost;

  private adapter?: MediaProviderAdapter;

  private fullscreen!: Fullscreen;

  private autopauseMgr!: Autopause;

  private disposal = new Disposal();

  // Keeps track of the active caption as we toggle mode/visibility.
  private toggledCaption?: TextTrack;

  // Keeps track of state between render cycles to fire events.
  private cache = new Map<PlayerProp, any>();

  // Keeps track of the state of the provider.
  private providerCache = new Map<keyof ProviderWritableProps, any>();

  // Queue of adapter calls to be run when the media is ready for playback.
  private adapterCalls: ((adapter: MediaProviderAdapter) => Promise<void>)[] = [];

  @Element() el!: HTMLVimePlayerElement;

  @State() shouldCheckForProviderChange = false;

  /**
   * ------------------------------------------------------
   * Props
   * ------------------------------------------------------
   */

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) attached = false;

  /**
   * @internal
   */
  @Prop() logger = new Logger();

  /**
   * @inheritDoc
   */
  @Prop() theme?: string;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) paused = true;

  @Watch('paused')
  onPausedChange() {
    if (this.paused) {
      this.playing = false;
    } else {
      this.autopauseMgr.willPlay();
    }

    this.safeAdapterCall('paused', !this.paused ? 'play' : 'pause');
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) playing = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) duration = -1;

  @Watch('duration')
  onDurationChange() {
    this.isLive = this.duration === Infinity;
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) mediaTitle?: string;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) currentProvider?: Provider;

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
  onCurrentTimeChange() {
    const duration = this.playbackReady ? this.duration : Infinity;
    this.currentTime = Math.max(0, Math.min(this.currentTime, duration));
    this.safeAdapterCall('currentTime', 'setCurrentTime');
  }

  /**
   * @inheritDoc
   */
  @Prop() autoplay = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, reflect: true }) ready = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) playbackReady = false;

  @Watch('playbackReady')
  onPlaybackReadyChange() {
    if (!this.ready) this.ready = true;
  }

  /**
   * @inheritDoc
   */
  @Prop() loop = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) muted = false;

  @Watch('muted')
  onMutedChange() {
    this.safeAdapterCall('muted', 'setMuted');
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) buffered = 0;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) playbackRate = 1;

  private lastRateCheck = 1;

  @Watch('playbackRate')
  async onPlaybackRateChange(newRate: number, prevRate: number) {
    if (newRate === this.lastRateCheck) return;

    if (!(await this.adapter?.canSetPlaybackRate?.())) {
      this.logger.log('provider cannot change `playbackRate`.');
      this.lastRateCheck = prevRate;
      this.playbackRate = prevRate;
      return;
    }

    if (!this.playbackRates.includes(newRate)) {
      this.logger.log(
        `invalid \`playbackRate\` of ${newRate}, `
        + `valid values are [${this.playbackRates.join(', ')}]`,
      );
      this.lastRateCheck = prevRate;
      this.playbackRate = prevRate;
      return;
    }

    this.lastRateCheck = newRate;
    this.safeAdapterCall('playbackRate', 'setPlaybackRate');
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) playbackRates = [1];

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) playbackQuality?: string;

  private lastQualityCheck?: string;

  @Watch('playbackQuality')
  async onPlaybackQualityChange(newQuality: string, prevQuality: string) {
    if (isUndefined(newQuality) || (newQuality === this.lastQualityCheck)) return;

    if (!(await this.adapter?.canSetPlaybackQuality?.())) {
      this.logger.log('provider cannot change `playbackQuality`.');
      this.lastQualityCheck = prevQuality;
      this.playbackQuality = prevQuality;
      return;
    }

    if (!this.playbackQualities.includes(newQuality)) {
      this.logger.log(
        `invalid \`playbackQuality\` of ${newQuality}, `
        + `valid values are [${this.playbackQualities.join(', ')}]`,
      );
      this.lastQualityCheck = prevQuality;
      this.playbackQuality = prevQuality;
      return;
    }

    this.lastQualityCheck = newQuality;
    this.safeAdapterCall('playbackQuality', 'setPlaybackQuality');
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

  @Watch('debug')
  onDebugChange() {
    this.logger.silent = !this.debug;
  }

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
  onErrorsChange(_: any[], prevErrors: any[]) {
    if (prevErrors.length > 0) this.errors.unshift(prevErrors);
    this.logger.warn(this.errors[this.errors.length - 1]);
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
      this.currentCaption = undefined;
      this.isCaptionsActive = false;
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
    this.volume = Math.max(0, Math.min(this.volume, 100));
    this.safeAdapterCall('volume', 'setVolume');
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
  @Watch('isAudioView')
  @Watch('isVideoView')
  onViewTypeChange() {
    this.isAudioView = this.viewType === ViewType.Audio;
    this.isVideoView = this.viewType === ViewType.Video;
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
  onMediaTypeChange() {
    this.isAudio = this.mediaType === MediaType.Audio;
    this.isVideo = this.mediaType === MediaType.Video;
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
  @Prop({ mutable: true }) language = 'en';

  @Watch('language')
  onLanguageChange(_: string, prevLanguage: string) {
    if (!this.languages.includes(this.language)) {
      this.logger.log(
        `invalid \`language\` of ${this.language}, `
        + `valid values are [${this.languages.join(', ')}]`,
      );
      this.language = prevLanguage;
      return;
    }

    this.i18n = this.translations[this.language];
  }

  /**
   * @inheritDoc
   */
  @Prop({
    mutable: true, attribute: null,
  }) translations: Record<string, Translation> = { en };

  @Watch('translations')
  onTranslationsChange() {
    Object.assign(this.translations, { en });
    this.languages = Object.keys(this.translations);
    this.i18n = this.translations[this.language];
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) languages = ['en'];

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) i18n: Translation = en;

  /**
   * ------------------------------------------------------
   * Events
   * ------------------------------------------------------
   */

  /**
   * @inheritDoc
   */
  @Event() vThemeChange!: EventEmitter<PlayerProps['theme']>;

  /**
   * @inheritDoc
   */
  @Event() vPausedChange!: EventEmitter<PlayerProps['paused']>;

  /**
   * @inheritDoc
   */
  @Event() vPlay!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event() vPlayingChange!: EventEmitter<PlayerProps['playing']>;

  /**
   * @inheritDoc
   */
  @Event() vSeekingChange!: EventEmitter<PlayerProps['seeking']>;

  /**
   * @inheritDoc
   */
  @Event() vSeeked!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event() vBufferingChange!: EventEmitter<PlayerProps['buffering']>;

  /**
   * @inheritDoc
   */
  @Event() vDurationChange!: EventEmitter<PlayerProps['duration']>;

  /**
   * @inheritDoc
   */
  @Event() vCurrentTimeChange!: EventEmitter<PlayerProps['currentTime']>;

  /**
   * @inheritDoc
   */
  @Event() vAttachedChange!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event() vReady!: EventEmitter<void>;

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
  @Event() vBufferedChange!: EventEmitter<PlayerProps['buffered']>;

  /**
   * @inheritdoc
   */
  @Event() vCurrentCaptionChange!: EventEmitter<PlayerProps['currentCaption']>;

  /**
   * @inheritDoc
   */
  @Event() vTextTracksChange!: EventEmitter<PlayerProps['textTracks']>;

  /**
   * @inheritDoc
   */
  @Event() vErrorsChange!: EventEmitter<PlayerProps['errors']>;

  /**
   * @inheritDoc
   */
  @Event() vLoadStart!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event() vCurrentProviderChange!: EventEmitter<PlayerProps['currentProvider']>;

  /**
   * @inheritDoc
   */
  @Event() vCurrentSrcChange!: EventEmitter<PlayerProps['currentSrc']>;

  /**
   * @inheritDoc
   */
  @Event() vCurrentPosterChange!: EventEmitter<PlayerProps['currentPoster']>;

  /**
   * @inheritDoc
   */
  @Event() vMediaTitleChange!: EventEmitter<PlayerProps['mediaTitle']>;

  /**
   * @inheritDoc
   */
  @Event() vControlsChange!: EventEmitter<PlayerProps['isControlsActive']>;

  /**
   * @inheritDoc
   */
  @Event() vPlaybackRateChange!: EventEmitter<PlayerProps['playbackRate']>;

  /**
   * @inheritDoc
   */
  @Event() vPlaybackRatesChange!: EventEmitter<PlayerProps['playbackRates']>;

  /**
   * @inheritDoc
   */
  @Event() vPlaybackQualityChange!: EventEmitter<PlayerProps['playbackQuality']>;

  /**
   * @inheritDoc
   */
  @Event() vPlaybackQualitiesChange!: EventEmitter<PlayerProps['playbackQualities']>;

  /**
   * @inheritDoc
   */
  @Event() vMutedChange!: EventEmitter<PlayerProps['muted']>;

  /**
   * @inheritDoc
   */
  @Event() vVolumeChange!: EventEmitter<PlayerProps['volume']>;

  /**
   * @inheritDoc
   */
  @Event() vViewTypeChange!: EventEmitter<PlayerProps['viewType']>;

  /**
   * @inheritDoc
   */
  @Event() vMediaTypeChange!: EventEmitter<PlayerProps['mediaType']>;

  /**
   * @inheritDoc
   */
  @Event() vLiveChange!: EventEmitter<PlayerProps['isLive']>;

  /**
   * @inheritDoc
   */
  @Event() vTouchChange!: EventEmitter<PlayerProps['isTouch']>;

  /**
   * @inheritDoc
   */
  @Event() vLanguageChange!: EventEmitter<PlayerProps['language']>;

  /**
   * @inheritdoc
   */
  @Event() vI18nChange!: EventEmitter<PlayerProps['i18n']>;

  /**
   * @inheritdoc
   */
  @Event() vTranslationsChange!: EventEmitter<PlayerProps['translations']>;

  /**
   * @inheritDoc
   */
  @Event() vLanguagesChange!: EventEmitter<PlayerProps['languages']>;

  /**
   * @inheritDoc
   */
  @Event() vFullscreenChange!: EventEmitter<PlayerProps['isFullscreenActive']>;

  /**
   * @inheritDoc
   */
  @Event() vPiPChange!: EventEmitter<PlayerProps['isPiPActive']>;

  /**
   * ------------------------------------------------------
   * Methods
   * ------------------------------------------------------
   */

  /**
   * @inheritDoc
   */
  @Method()
  async getProvider<InternalPlayerType = any>(): Promise<
  AdapterHost<InternalPlayerType> | undefined
  > {
    return this.provider;
  }

  /**
   * @internal testing only.
   */
  @Method()
  async setProvider(provider: AdapterHost) {
    this.provider = provider;
    this.adapter = await this.provider.getAdapter();
  }

  /**
   * @internal
   */
  @Method()
  async getAdapter<InternalPlayerType = any>(): Promise<
  MediaProviderAdapter<InternalPlayerType> | undefined
  > {
    return this.adapter;
  }

  /**
   * @inheritDoc
   */
  @Method()
  async play() {
    return this.adapter?.play();
  }

  /**
   * @inheritDoc
   */
  @Method()
  async pause() {
    return this.adapter?.pause();
  }

  /**
   * @inheritDoc
   */
  @Method()
  async canPlay(type: string) {
    return this.adapter?.canPlay(type) ?? false;
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
    return this.adapter?.canSetPlaybackRate?.() ?? false;
  }

  /**
   * @inheritDoc
   */
  @Method()
  async canSetPlaybackQuality() {
    return this.adapter?.canSetPlaybackQuality?.() ?? false;
  }

  /**
   * @inheritDoc
   */
  @Method()
  async canSetFullscreen() {
    return this.fullscreen!.isSupported || (this.adapter?.canSetFullscreen?.() ?? false);
  }

  /**
   * @inheritDoc
   */
  @Method()
  async enterFullscreen(options?: FullscreenOptions) {
    if (!this.isVideoView) throw Error('Cannot enter fullscreen on an audio player view.');
    if (this.fullscreen!.isSupported) return this.fullscreen!.enterFullscreen(options);
    if (await this.adapter?.canSetFullscreen?.()) return this.adapter?.enterFullscreen?.(options);
    throw Error('Fullscreen API is not available.');
  }

  /**
   * @inheritDoc
   */
  @Method()
  async exitFullscreen() {
    if (this.fullscreen!.isSupported) return this.fullscreen!.exitFullscreen();
    return this.adapter?.exitFullscreen?.();
  }

  /**
   * @inheritDoc
   */
  @Method()
  async canSetPiP() {
    return this.adapter?.canSetPiP?.() ?? false;
  }

  /**
   * @inheritDoc
   */
  @Method()
  async enterPiP() {
    if (!this.isVideoView) throw Error('Cannot enter PiP mode on an audio player view.');
    if (!(await this.canSetPiP())) throw Error('Picture-in-Picture API is not available.');
    return this.adapter?.enterPiP?.();
  }

  /**
   * @inheritDoc
   */
  @Method()
  async exitPiP() {
    return this.adapter?.exitPiP?.();
  }

  /**
   * @inheritDoc
   */
  @Method()
  async extendLanguage(language: string, translation: Partial<Translation>) {
    const translations = {
      ...this.translations,
      [language]: {
        ...(this.translations[language] ?? {}),
        ...translation,
      },
    };

    this.translations = translations as Record<string, Translation>;
  }

  @Listen('vMediaProviderConnect')
  onMediaProviderConnect(event: CustomEvent<AdapterHost>) {
    event.stopImmediatePropagation();

    const newProvider = getElement(event.detail) as any;
    if (this.provider === newProvider) return;

    const newProviderName = (newProvider as any)
      ?.nodeName
      .toLowerCase()
      .replace('vime-', '');

    writeTask(async () => {
      await this.onMediaProviderDisconnect();
      this.provider = newProvider;
      this.adapter = await this.provider?.getAdapter();
      this.currentProvider = Object.values(Provider)
        .find((provider) => newProviderName === provider);
    });
  }

  @Listen('vMediaProviderDisconnect')
  onMediaProviderDisconnect(event?: Event) {
    event?.stopImmediatePropagation();

    writeTask(async () => {
      this.ready = false;
      this.provider = undefined;
      this.adapter = undefined;
      await this.onMediaChange();
    });
  }

  private hasMediaChanged = false;

  @Listen('vLoadStart')
  async onMediaChange(event?: Event) {
    event?.stopPropagation();

    // Don't reset first time otherwise props intialized by the user will be reset.
    if (!this.hasMediaChanged) {
      this.hasMediaChanged = true;
      return;
    }

    this.adapterCalls = [];
    this.providerCache.clear();

    writeTask(() => {
      (Object.keys(initialState) as PlayerProp[])
        .filter(shouldPropResetOnMediaChange)
        .forEach((prop) => { (this as any)[prop] = initialState[prop]; });
    });
  }

  @Listen('vStateChange')
  async onStateChange(event: CustomEvent<StateChange>) {
    event.stopImmediatePropagation();
    const { by, prop, value } = event.detail;

    if (!isWritableProp(prop)) {
      this.logger.warn(`${by.nodeName} tried to change \`${prop}\` but it is readonly.`);
      return;
    }

    if (!this.playbackStarted && immediateAdapterCall.has(prop)) {
      if (prop === 'paused' && !value) {
        this.adapter?.play();
      }

      if (prop === 'currentTime') {
        this.adapter?.play();
        this.adapter?.setCurrentTime(value as number);
      }
    }

    writeTask(() => { (this as any)[prop] = value; });
  }

  @Listen('vProviderChange')
  onProviderChange(event: CustomEvent<StateChange<ProviderWritableProps>>) {
    event.stopImmediatePropagation();
    const { by, prop, value } = event.detail;

    if (!isProviderWritableProp(prop)) {
      this.logger.warn(`${by.nodeName} tried to change \`${prop}\` but it is readonly.`);
      return;
    }

    writeTask(() => {
      this.providerCache.set(prop, value);
      (this as any)[prop] = value;
    });
  }

  connectedCallback() {
    // Initialize caches.
    const currentState = this.getPlayerState();
    (Object.keys(currentState) as PlayerProp[])
      .forEach((prop) => {
        this.cache.set(prop, currentState[prop]);
        this.providerCache.set(prop as keyof ProviderWritableProps, initialState[prop]);
      });

    this.autopauseMgr = new Autopause(this.el);
    this.onPausedChange();
    this.onCurrentTimeChange();
    this.onVolumeChange();
    this.onMutedChange();
    this.onDebugChange();
    this.onTranslationsChange();
    this.onLanguageChange(this.language, initialState.language);

    this.fullscreen = new Fullscreen(
      this.el,
      (isActive) => {
        this.isFullscreenActive = isActive;
        this.rotateDevice();
      },
    );

    this.disposal.add(onTouchInputChange((isTouch) => { this.isTouch = isTouch; }));
    this.attached = true;
  }

  componentWillLoad() {
    Universe.create(this, this.getPlayerState());
  }

  componentWillRender() {
    return this.playbackReady ? this.flushAdapterCalls() : undefined;
  }

  async componentDidRender() {
    const props = Array.from(this.cache.keys());
    for (let i = 0; i < props.length; i += 1) {
      const prop = props[i];
      const oldValue = this.cache.get(prop);
      const newValue = this[prop];
      if (oldValue !== newValue) {
        this.fireEvent(prop, newValue, oldValue);
        this.cache.set(prop, newValue);
      }
    }
  }

  disconnectedCallback() {
    this.adapterCalls = [];
    this.hasMediaChanged = false;
    this.textTracksChangeListener?.();
    this.fullscreen.destroy();
    this.autopauseMgr.destroy();
    this.disposal.empty();
    this.attached = false;
    this.shouldCheckForProviderChange = true;
  }

  private async rotateDevice() {
    if (!IS_MOBILE || !canRotateScreen()) return;

    try {
      if (this.isFullscreenActive) {
        await window.screen.orientation.lock('landscape');
      } else {
        await window.screen.orientation.unlock();
      }
    } catch (err) { this.errors = [err]; }
  }

  private getPlayerState(): PlayerProps {
    return (Object.keys(initialState) as PlayerProp[])
      .reduce((state, prop) => ({ ...state, [prop]: this[prop] }), {}) as any;
  }

  private calcAspectRatio() {
    const [width, height] = /\d{1,2}:\d{1,2}/.test(this.aspectRatio)
      ? this.aspectRatio.split(':')
      : [16, 9];
    return (100 / Number(width)) * Number(height);
  }

  /**
   * @internal Exposed for E2E testing.
   */
  @Method()
  async callAdapter(method: keyof MediaProviderAdapter, value?: any) {
    return (this.adapter as any)[method](value);
  }

  /**
   * @inheritdoc
   */
  @Method()
  async toggleCaptionsVisibility(isVisible?: boolean) {
    const isActive = isVisible ?? !this.isCaptionsActive;

    if (
      isUndefined(this.textTracks)
      || (isActive && isUndefined(this.toggledCaption))
      || (!isActive && isUndefined(this.getActiveCaption()))
    ) return;

    if (isActive) {
      this.toggledCaption!.mode = 'showing';
      this.toggledCaption = undefined;
      return;
    }

    const activeCaption = this.getActiveCaption();
    this.toggledCaption = activeCaption;
    activeCaption!.mode = this.hasCustomCaptions() ? 'disabled' : 'hidden';
  }

  private hasCustomControls() {
    return !isNull(this.el.querySelector('vime-ui vime-controls'));
  }

  private hasCustomCaptions() {
    return !isNull(this.el.querySelector('vime-ui vime-captions'));
  }

  private getActiveCaption() {
    return Array.from(this.textTracks ?? [])
      .filter((track) => (track.kind === 'subtitles') || (track.kind === 'captions'))
      .find((track) => track.mode === (this.hasCustomCaptions() ? 'hidden' : 'showing'));
  }

  private onActiveCaptionChange() {
    const activeCaption = this.getActiveCaption();
    this.currentCaption = activeCaption || this.toggledCaption;
    this.isCaptionsActive = !isUndefined(activeCaption);
  }

  private isAdapterCallRequired<P extends keyof PlayerProps>(prop: P, value: PlayerProps[P]) {
    return value !== this.providerCache.get(prop as any);
  }

  private async safeAdapterCall<P extends keyof PlayerProps>(
    prop: P,
    method: keyof MediaProviderAdapter,
  ) {
    if (!this.isAdapterCallRequired(prop, this[prop])) return;

    const value = this[prop];
    const safeCall = async (adapter?: MediaProviderAdapter) => {
      // @ts-ignore
      try { await adapter?.[method]?.(value); } catch (e) { this.errors = [e]; }
    };

    if (this.playbackReady) {
      await safeCall(this.adapter);
    } else {
      this.adapterCalls.push(safeCall);
    }
  }

  private async flushAdapterCalls() {
    if (isUndefined(this.adapter)) return;
    for (let i = 0; i < this.adapterCalls.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await this.adapterCalls[i](this.adapter);
    }
    this.adapterCalls = [];
  }

  private fireEvent(prop: PlayerProp, newValue: any, oldValue: any) {
    const events: CustomEvent[] = [];

    events.push(new CustomEvent(getEventName(prop), {
      bubbles: false,
      detail: newValue,
    }));

    if ((prop === 'paused') && !newValue) {
      events.push(new CustomEvent('vPlay', { bubbles: false }));
    }

    if ((prop === 'seeking') && oldValue && !newValue) {
      events.push(new CustomEvent('vSeeked', { bubbles: false }));
    }

    events.forEach((event) => { this.el.dispatchEvent(event); });
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

    if (!canShowCustomUI) { this.controls = true; }

    return (
      <Host
        id={this.genId()}
        tabindex="0"
        aria-label={label}
        aria-hidden={!this.ready ? 'true' : 'false'}
        aria-busy={!this.playbackReady ? 'true' : 'false'}
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
