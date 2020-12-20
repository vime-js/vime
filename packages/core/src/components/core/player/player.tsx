import {
  Component, Element, Event, EventEmitter, h, Host,
  Listen, Method, Prop, State, Watch, writeTask,
} from '@stencil/core';
import { Universe } from 'stencil-wormhole';
import { MediaType } from './MediaType';
import { AdapterHost, MediaProviderAdapter } from '../../providers/MediaProvider';
import { Provider } from '../../providers/Provider';
import { isUndefined, isString } from '../../../utils/unit';
import { MediaPlayer } from './MediaPlayer';
import { initialState, PlayerProp, PlayerProps } from './PlayerProps';
import { ViewType } from './ViewType';
import {
  canAutoplay, onTouchInputChange, IS_IOS, canRotateScreen, onMobileChange,
} from '../../../utils/support';
import { Fullscreen } from './fullscreen/Fullscreen';
import { en } from './lang/en';
import { Disposal } from '../../../utils/Disposal';
import { Logger } from './PlayerLogger';
import { Translation } from './lang/Translation';
import { autopause, withAutopause } from './withAutopause';
import { withProviderHost } from '../../providers/ProviderConnect';
import { withPlayerEvents } from './withPlayerEvents';
import { SafeAdapterCall, withPlayerScheduler } from './withPlayerScheduler';
import { isComponentRegistered, withComponentRegistrar } from './withComponentRegistry';
import { withFindPlayer } from './findPlayer';

let idCount = 0;

/**
 * @slot - Used to pass in providers, plugins and UI components.
 */
@Component({
  tag: 'vm-player',
  styleUrl: 'player.css',
  shadow: true,
})
export class Player implements MediaPlayer {
  provider?: AdapterHost;

  get adapter() {
    return this.provider?.getAdapter();
  }

  private safeAdapterCall: SafeAdapterCall;

  private fullscreen!: Fullscreen;

  private disposal = new Disposal();

  @Element() host!: HTMLVmPlayerElement;

  @State() container?: HTMLDivElement;

  @Watch('container')
  onContainerChange() {
    this.fullscreen?.destroy();
    if (isUndefined(this.container)) return;
    this.fullscreen = new Fullscreen(this.container,
      (isActive) => {
        this.isFullscreenActive = isActive;
        this.rotateDevice();
      });
  }

  /**
   * ------------------------------------------------------
   * Props
   * ------------------------------------------------------
   */

  /** @internal @readonly */
  @Prop() logger = new Logger();

  /** @inheritDoc */
  @Prop({ reflect: true }) theme?: string;

  /** @inheritDoc */
  @Prop({ reflect: true }) icons = 'vime';

  /** @inheritDoc */
  @Prop({ mutable: true }) paused = true;

  @Watch('paused')
  onPausedChange() {
    if (this.paused) {
      this.playing = false;
    } else {
      autopause(this);
    }

    this.safeAdapterCall('paused', !this.paused ? 'play' : 'pause');
  }

  /** @inheritDoc @readonly */
  @Prop({ mutable: true }) playing = false;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true }) duration = -1;

  @Watch('duration')
  onDurationChange() {
    this.isLive = this.duration === Infinity;
  }

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) mediaTitle?: string;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) currentProvider?: Provider;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) currentSrc?: string;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) currentPoster?: string;

  /** @inheritDoc */
  @Prop({ mutable: true }) currentTime = 0;

  @Watch('currentTime')
  onCurrentTimeChange() {
    const duration = this.playbackReady ? this.duration : Infinity;
    this.currentTime = Math.max(0, Math.min(this.currentTime, duration));
    this.safeAdapterCall('currentTime', 'setCurrentTime');
  }

  /** @inheritDoc */
  @Prop() autoplay = false;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, reflect: true }) ready = false;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) playbackReady = false;

  @Watch('playbackReady')
  onPlaybackReadyChange() {
    if (!this.ready) this.ready = true;
  }

  /** @inheritDoc */
  @Prop() loop = false;

  /** @inheritDoc */
  @Prop({ mutable: true }) muted = false;

  @Watch('muted')
  onMutedChange() {
    this.safeAdapterCall('muted', 'setMuted');
  }

  /** @inheritDoc @readonly */
  @Prop({ mutable: true }) buffered = 0;

  /** @inheritDoc */
  @Prop({ mutable: true }) playbackRate = 1;

  private lastRateCheck = 1;

  @Watch('playbackRate')
  async onPlaybackRateChange(newRate: number, prevRate: number) {
    if (newRate === this.lastRateCheck) return;

    if (!(await (await this.adapter)?.canSetPlaybackRate?.())) {
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

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) playbackRates = [1];

  /** @inheritDoc */
  @Prop({ mutable: true }) playbackQuality?: string;

  private lastQualityCheck?: string;

  @Watch('playbackQuality')
  async onPlaybackQualityChange(newQuality: string, prevQuality: string) {
    if (isUndefined(newQuality) || (newQuality === this.lastQualityCheck)) return;

    if (!(await (await this.adapter)?.canSetPlaybackQuality?.())) {
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

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) playbackQualities: string[] = [];

  /** @inheritDoc @readonly */
  @Prop({ mutable: true }) seeking = false;

  /** @inheritDoc */
  @Prop() debug = false;

  @Watch('debug')
  onDebugChange() {
    this.logger.silent = !this.debug;
  }

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) playbackStarted = false;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) playbackEnded = false;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true }) buffering = false;

  /** @inheritDoc */
  @Prop() controls = false;

  /** @inheritDoc */
  @Prop() isControlsActive = false;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) isSettingsActive = false;

  /** @inheritDoc */
  @Prop({ mutable: true }) volume = 50;

  @Watch('volume')
  async onVolumeChange() {
    this.volume = Math.max(0, Math.min(this.volume, 100));
    this.safeAdapterCall('volume', 'setVolume');
  }

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) isFullscreenActive = false;

  /** @inheritDoc */
  @Prop({ mutable: true }) aspectRatio = '16:9';

  /** @inheritDoc @readonly */
  @Prop({ mutable: true }) viewType?: ViewType;

  @Watch('viewType')
  @Watch('isAudioView')
  @Watch('isVideoView')
  onViewTypeChange() {
    this.isAudioView = this.viewType === ViewType.Audio;
    this.isVideoView = this.viewType === ViewType.Video;
  }

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) isAudioView = false;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) isVideoView = false;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true }) mediaType?: MediaType;

  @Watch('mediaType')
  onMediaTypeChange() {
    this.isAudio = this.mediaType === MediaType.Audio;
    this.isVideo = this.mediaType === MediaType.Video;
  }

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) isAudio = false;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) isVideo = false;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) isLive = false;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) isMobile = false;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) isTouch = false;

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) isPiPActive = false;

  /** @inheritDoc @readonly */
  @Prop({ attribute: null }) textTracks = [];

  /** @inheritDoc @readonly */
  @Prop({ attribute: null }) currentTextTrack = -1;

  /** @inheritDoc @readonly */
  @Prop({ attribute: null }) isTextTrackVisible = true;

  /** @inheritDoc */
  @Prop({ attribute: null }) shouldRenderNativeTextTracks = true;

  /** @inheritDoc @readonly */
  @Prop({ attribute: null }) audioTracks = [];

  /** @inheritDoc @readonly */
  @Prop({ attribute: null }) currentAudioTrack = -1;

  /** @inheritDoc */
  @Prop() autopause = true;

  /** @inheritDoc */
  @Prop() playsinline = false;

  /** @inheritDoc */
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

  /** @inheritDoc */
  @Prop({
    mutable: true, attribute: null,
  }) translations: Record<string, Translation> = { en };

  @Watch('translations')
  onTranslationsChange() {
    Object.assign(this.translations, { en });
    this.languages = Object.keys(this.translations);
    this.i18n = this.translations[this.language];
  }

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) languages = ['en'];

  /** @inheritDoc @readonly */
  @Prop({ mutable: true, attribute: null }) i18n: Translation = en;

  /**
   * ------------------------------------------------------
   * Events
   * ------------------------------------------------------
   */

  /** @inheritDoc */
  @Event() vmThemeChange!: EventEmitter<PlayerProps['theme']>;

  /** @inheritDoc */
  @Event() vmPausedChange!: EventEmitter<PlayerProps['paused']>;

  /** @inheritDoc */
  @Event() vmPlay!: EventEmitter<void>;

  /** @inheritDoc */
  @Event() vmPlayingChange!: EventEmitter<PlayerProps['playing']>;

  /** @inheritDoc */
  @Event() vmSeekingChange!: EventEmitter<PlayerProps['seeking']>;

  /** @inheritDoc */
  @Event() vmSeeked!: EventEmitter<void>;

  /** @inheritDoc */
  @Event() vmBufferingChange!: EventEmitter<PlayerProps['buffering']>;

  /** @inheritDoc */
  @Event() vmDurationChange!: EventEmitter<PlayerProps['duration']>;

  /** @inheritDoc */
  @Event() vmCurrentTimeChange!: EventEmitter<PlayerProps['currentTime']>;

  /** @inheritDoc */
  @Event() vmReady!: EventEmitter<void>;

  /** @inheritDoc */
  @Event() vmPlaybackReady!: EventEmitter<void>;

  /** @inheritDoc */
  @Event() vmPlaybackStarted!: EventEmitter<void>;

  /** @inheritDoc */
  @Event() vmPlaybackEnded!: EventEmitter<void>;

  /** @inheritDoc */
  @Event() vmBufferedChange!: EventEmitter<PlayerProps['buffered']>;

  /** @inheritDoc */
  @Event() vmError!: EventEmitter<any>;

  @Listen('vmError')
  onError(event: CustomEvent<any>) {
    this.logger.warn(event.detail);
  }

  /** @inheritDoc */
  @Event() vmLoadStart!: EventEmitter<void>;

  /** @inheritDoc */
  @Event() vmCurrentProviderChange!: EventEmitter<PlayerProps['currentProvider']>;

  /** @inheritDoc */
  @Event() vmCurrentSrcChange!: EventEmitter<PlayerProps['currentSrc']>;

  /** @inheritDoc */
  @Event() vmCurrentPosterChange!: EventEmitter<PlayerProps['currentPoster']>;

  /** @inheritDoc */
  @Event() vmMediaTitleChange!: EventEmitter<PlayerProps['mediaTitle']>;

  /** @inheritDoc */
  @Event() vmControlsChange!: EventEmitter<PlayerProps['isControlsActive']>;

  /** @inheritDoc */
  @Event() vmPlaybackRateChange!: EventEmitter<PlayerProps['playbackRate']>;

  /** @inheritDoc */
  @Event() vmPlaybackRatesChange!: EventEmitter<PlayerProps['playbackRates']>;

  /** @inheritDoc */
  @Event() vmPlaybackQualityChange!: EventEmitter<PlayerProps['playbackQuality']>;

  /** @inheritDoc */
  @Event() vmPlaybackQualitiesChange!: EventEmitter<PlayerProps['playbackQualities']>;

  /** @inheritDoc */
  @Event() vmMutedChange!: EventEmitter<PlayerProps['muted']>;

  /** @inheritDoc */
  @Event() vmVolumeChange!: EventEmitter<PlayerProps['volume']>;

  /** @inheritDoc */
  @Event() vmViewTypeChange!: EventEmitter<PlayerProps['viewType']>;

  /** @inheritDoc */
  @Event() vmMediaTypeChange!: EventEmitter<PlayerProps['mediaType']>;

  /** @inheritDoc */
  @Event() vmLiveChange!: EventEmitter<PlayerProps['isLive']>;

  /** @inheritDoc */
  @Event() vmTouchChange!: EventEmitter<PlayerProps['isTouch']>;

  /** @inheritDoc */
  @Event() vmLanguageChange!: EventEmitter<PlayerProps['language']>;

  /**
   * @inheritDoc
   */
  @Event() vmI18nChange!: EventEmitter<PlayerProps['i18n']>;

  /**
   * @inheritDoc
   */
  @Event() vmTranslationsChange!: EventEmitter<PlayerProps['translations']>;

  /** @inheritDoc */
  @Event() vmLanguagesChange!: EventEmitter<PlayerProps['languages']>;

  /** @inheritDoc */
  @Event() vmFullscreenChange!: EventEmitter<PlayerProps['isFullscreenActive']>;

  /** @inheritDoc */
  @Event() vmPiPChange!: EventEmitter<PlayerProps['isPiPActive']>;

  /** @inheritDoc */
  @Event() vmTextTracksChange!: EventEmitter<PlayerProps['textTracks']>;

  /** @inheritDoc */
  @Event() vmCurrentTextTrackChange!: EventEmitter<PlayerProps['currentTextTrack']>;

  /** @inheritDoc */
  @Event() vmTextTrackVisibleChange!: EventEmitter<PlayerProps['isTextTrackVisible']>;

  /** @inheritDoc */
  @Event() vmAudioTracksChange!: EventEmitter<PlayerProps['audioTracks']>;

  /** @inheritDoc */
  @Event() vmCurrentAudioTrackChange!: EventEmitter<PlayerProps['currentAudioTrack']>;

  /**
   * ------------------------------------------------------
   * Methods
   * ------------------------------------------------------
   */

  /** @inheritDoc */
  @Method()
  async getProvider<InternalPlayerType = any>(): Promise<
  AdapterHost<InternalPlayerType> | undefined
  > {
    return this.provider;
  }

  /** @internal */
  @Method()
  async getAdapter<InternalPlayerType = any>(): Promise<
  MediaProviderAdapter<InternalPlayerType> | undefined
  > {
    return this.adapter;
  }

  /** @inheritDoc */
  @Method()
  async play() {
    return (await this.adapter)?.play();
  }

  /** @inheritDoc */
  @Method()
  async pause() {
    return (await this.adapter)?.pause();
  }

  /** @inheritDoc */
  @Method()
  async canPlay(type: string) {
    return (await this.adapter)?.canPlay(type) ?? false;
  }

  /** @inheritDoc */
  @Method()
  async canAutoplay() {
    return canAutoplay();
  }

  /** @inheritDoc */
  @Method()
  async canMutedAutoplay() {
    return canAutoplay(true);
  }

  /** @inheritDoc */
  @Method()
  async canSetPlaybackRate() {
    return (await this.adapter)?.canSetPlaybackRate?.() ?? false;
  }

  /** @inheritDoc */
  @Method()
  async canSetPlaybackQuality() {
    return (await this.adapter)?.canSetPlaybackQuality?.() ?? false;
  }

  /** @inheritDoc */
  @Method()
  async canSetFullscreen() {
    return this.fullscreen!.isSupported || ((await this.adapter)?.canSetFullscreen?.() ?? false);
  }

  /** @inheritDoc */
  @Method()
  async enterFullscreen(options?: FullscreenOptions) {
    if (!this.isVideoView) throw Error('Cannot enter fullscreen on an audio player view.');
    if (this.fullscreen!.isSupported) return this.fullscreen!.enterFullscreen(options);
    if (await (await this.adapter)?.canSetFullscreen?.()) {
      return (await this.adapter)?.enterFullscreen?.(options);
    }
    throw Error('Fullscreen API is not available.');
  }

  /** @inheritDoc */
  @Method()
  async exitFullscreen() {
    if (this.fullscreen!.isSupported) return this.fullscreen!.exitFullscreen();
    return (await this.adapter)?.exitFullscreen?.();
  }

  /** @inheritDoc */
  @Method()
  async canSetPiP() {
    return (await this.adapter)?.canSetPiP?.() ?? false;
  }

  /** @inheritDoc */
  @Method()
  async enterPiP() {
    if (!this.isVideoView) throw Error('Cannot enter PiP mode on an audio player view.');
    if (!(await this.canSetPiP())) throw Error('Picture-in-Picture API is not available.');
    return (await this.adapter)?.enterPiP?.();
  }

  /** @inheritDoc */
  @Method()
  async exitPiP() {
    return (await this.adapter)?.exitPiP?.();
  }

  /** @inheritDoc */
  @Method()
  async canSetAudioTrack() {
    return !isUndefined((await this.adapter)?.setCurrentAudioTrack);
  }

  /** @inheritDoc */
  @Method()
  async setCurrentAudioTrack(trackId: number) {
    (await this.adapter)?.setCurrentAudioTrack?.(trackId);
  }

  /** @inheritDoc */
  @Method()
  async canSetTextTrack() {
    return !isUndefined((await this.adapter)?.setCurrentTextTrack);
  }

  /** @inheritDoc */
  @Method()
  async setCurrentTextTrack(trackId: number) {
    (await this.adapter)?.setCurrentTextTrack?.(trackId);
  }

  /** @inheritDoc */
  @Method()
  async canSetTextTrackVisibility() {
    return !isUndefined((await this.adapter)?.setTextTrackVisibility);
  }

  /** @inheritDoc */
  @Method()
  async setTextTrackVisibility(isVisible: boolean) {
    (await this.adapter)?.setTextTrackVisibility?.(isVisible);
  }

  /** @inheritDoc */
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

  constructor() {
    withFindPlayer(this);
    withComponentRegistrar(this);
    withAutopause(this);
    withProviderHost(this);
    withPlayerEvents(this);
    this.safeAdapterCall = withPlayerScheduler(this);
  }

  connectedCallback() {
    this.onPausedChange();
    this.onCurrentTimeChange();
    this.onVolumeChange();
    this.onMutedChange();
    this.onDebugChange();
    this.onTranslationsChange();
    this.onLanguageChange(this.language, initialState.language);
    this.disposal.add(onMobileChange((isMobile) => { this.isMobile = isMobile; }));
    this.disposal.add(onTouchInputChange((isTouch) => { this.isTouch = isTouch; }));
  }

  componentWillLoad() {
    Universe.create(this, this.getPlayerState());
  }

  disconnectedCallback() {
    this.fullscreen?.destroy();
    this.disposal.empty();
  }

  private async rotateDevice() {
    if (!this.isMobile || !canRotateScreen()) return;

    try {
      if (this.isFullscreenActive) {
        await window.screen.orientation.lock('landscape');
      } else {
        await window.screen.orientation.unlock();
      }
    } catch (err) {
      this.vmError.emit(err);
    }
  }

  private getPlayerState(): PlayerProps {
    const state: any = {};
    const props = Object.keys(initialState) as PlayerProp[];
    for (let i = 0; i < props.length; i += 1) {
      state[props[i]] = this[props[i]];
    }
    return state;
  }

  private calcAspectRatio() {
    const [width, height] = /\d{1,2}:\d{1,2}/.test(this.aspectRatio)
      ? this.aspectRatio.split(':')
      : [16, 9];
    return (100 / Number(width)) * Number(height);
  }

  /**
   * Returns the inner container.
   */
  @Method()
  async getContainer() {
    return this.container;
  }

  /** @internal Exposed for E2E testing. */
  @Method()
  async callAdapter(method: keyof MediaProviderAdapter, value?: any) {
    return ((await this.adapter) as any)[method](value);
  }

  private hasCustomControls() {
    return isComponentRegistered(this, 'vm-controls');
  }

  private genId() {
    const id = this.host?.id;
    if (isString(id) && id.length > 0) return id;
    idCount += 1;
    return `vm-player-${idCount}`;
  }

  render() {
    console.log(this.isVideoView, this.calcAspectRatio());
    const label = `${this.isAudioView ? 'Audio Player' : 'Video Player'}`
      + `${!isUndefined(this.mediaTitle) ? ` - ${this.mediaTitle}` : ''}`;

    const canShowCustomUI = !IS_IOS
      || !this.isVideoView
      || (this.playsinline && !this.isFullscreenActive);

    if (!canShowCustomUI) { this.controls = true; }

    const isIdle = canShowCustomUI
      && this.hasCustomControls()
      && this.isVideoView
      && !this.paused
      && !this.isControlsActive;

    const isBlockerVisible = !this.controls
      && canShowCustomUI
      && this.isVideoView;

    return (
      <Host
        id={this.genId()}
        idle={isIdle}
        mobile={this.isMobile}
        touch={this.isTouch}
        live={this.isLive}
        audio={this.isAudioView}
        video={this.isVideoView}
        pip={this.isPiPActive}
        fullscreen={this.isFullscreenActive}
      >
        <div
          aria-label={label}
          aria-hidden={!this.ready ? 'true' : 'false'}
          aria-busy={!this.playbackReady ? 'true' : 'false'}
          class={{
            player: true,
            idle: isIdle,
            audio: this.isAudioView,
            video: this.isVideoView,
            fullscreen: this.isFullscreenActive,
          }}
          style={{
            paddingBottom: this.isVideoView ? `${this.calcAspectRatio()}%` : undefined,
          }}
          ref={(el) => { writeTask(() => { this.container = el; }); }}
        >
          {isBlockerVisible && <div class="blocker" />}

          <Universe.Provider state={this.getPlayerState()}>
            <slot />
          </Universe.Provider>
        </div>
      </Host>
    );
  }
}
