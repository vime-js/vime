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
import { Universe } from 'stencil-wormhole';
import { MediaType } from './MediaType';
import { MediaProvider, MediaProviderAdapter } from '../../providers/MediaProvider';
import { isUndefined, isString, isNull } from '../../../utils/unit';
import { MediaPlayer } from './MediaPlayer';
import { PlayerProp, PlayerProps } from './PlayerProp';
import { ViewType } from './ViewType';
import {
  canAutoplay, IS_MOBILE, onTouchInputChange, IS_IOS,
} from '../../../utils/support';
import { Fullscreen } from './fullscreen/Fullscreen';
import { en } from './lang/en';
import { PlayerStateChange } from './PlayerDispatcher';
import { Disposal } from './Disposal';
import { listen } from '../../../utils/dom';
import { lazyLoader } from './lazyLoader';
import { Scheduler } from './Scheduler';
import { Autopause } from './Autopause';

let idCount = 0;

/**
 * @slot - Used to pass in providers, plugins and UI components.
 */
@Component({
  tag: 'vime-player',
  styleUrl: 'player.scss',
})
export class Player implements MediaPlayer {
  private scheduler!: Scheduler;

  private provider?: MediaProvider;

  private adapter?: MediaProviderAdapter;

  private fullscreen!: Fullscreen;

  private autopauseMgr!: Autopause;

  private disposal = new Disposal();

  // Keeps track of the active caption as we toggle mode/visibility.
  private toggledCaption?: TextTrack;

  @Element() el!: HTMLVimePlayerElement;

  /**
   * ------------------------------------------------------
   * Props
   * ------------------------------------------------------
   */

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
      this.scheduler.markAsInternallyChanged(PlayerProp.playing);
    } else {
      this.autopauseMgr.willPlay();
    }

    this.scheduler.onPausedChange(this.paused);
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
  onCurrentTimeChange() {
    this.scheduler.onCurrentTimeChange(this.currentTime);
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
  @Prop({ mutable: true }) mounted = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) destroyed = false;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) playbackReady = false;

  @Watch('playbackReady')
  onPlaybackReady() {
    if (!this.ready) {
      this.ready = true;
      this.scheduler.markAsInternallyChanged(PlayerProp.ready);
    }
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
    this.scheduler.onMutedChange(this.muted);
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) buffered = 0;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) playbackRate = 1;

  @Watch('playbackRate')
  onPlaybackRateChange(newRate: number, prevRate: number) {
    this.scheduler.onPlaybackRateChange(prevRate, newRate);
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) playbackRates = [1];

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) playbackQuality?: string;

  @Watch('playbackQuality')
  onPlaybackQualityChange(newQuality: string, prevQuality: string) {
    this.scheduler.onPlaybackQualityChange(prevQuality, newQuality);
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
      this.currentCaption = undefined;
      this.scheduler.markAsInternallyChanged(PlayerProp.currentCaption);
      this.isCaptionsActive = false;
      this.scheduler.markAsInternallyChanged(PlayerProp.isCaptionsActive);
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
  onVolumeChange() {
    this.scheduler.onVolumeChange(this.volume);
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
  onViewTypeChange() {
    this.isAudioView = this.viewType === ViewType.Audio;
    this.scheduler.markAsInternallyChanged(PlayerProp.isAudioView);
    this.isVideoView = this.viewType === ViewType.Video;
    this.scheduler.markAsInternallyChanged(PlayerProp.isVideoView);
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
    this.scheduler.markAsInternallyChanged(PlayerProp.isAudio);
    this.isVideo = this.mediaType === MediaType.Video;
    this.scheduler.markAsInternallyChanged(PlayerProp.isVideo);
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
    this.isLive = this.duration === Infinity;
    this.scheduler.markAsInternallyChanged(PlayerProp.isLive);
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
  onLanguagesUpdate() {
    this.languages = Object.keys(this.translations);
    this.scheduler.markAsInternallyChanged(PlayerProp.languages);
  }

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true, attribute: null }) i18n: Record<string, string> = en;

  @Watch('language')
  @Watch('translations')
  onI18NUpdate() {
    this.i18n = { ...(this.translations[this.language] ?? en) };
    this.scheduler.markAsInternallyChanged(PlayerProp.i18n);
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
  @Event() vThemeChange!: EventEmitter<PlayerProps[PlayerProp.theme]>;

  /**
   * @inheritDoc
   */
  @Event() vPausedChange!: EventEmitter<PlayerProps[PlayerProp.paused]>;

  /**
   * @inheritDoc
   */
  @Event() vPlay!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event() vPlayingChange!: EventEmitter<PlayerProps[PlayerProp.playing]>;

  /**
   * @inheritDoc
   */
  @Event() vSeekingChange!: EventEmitter<PlayerProps[PlayerProp.seeking]>;

  /**
   * @inheritDoc
   */
  @Event() vSeeked!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event() vBufferingChange!: EventEmitter<PlayerProps[PlayerProp.buffering]>;

  /**
   * @inheritDoc
   */
  @Event() vDurationChange!: EventEmitter<PlayerProps[PlayerProp.duration]>;

  /**
   * @inheritDoc
   */
  @Event() vCurrentTimeChange!: EventEmitter<PlayerProps[PlayerProp.currentTime]>;

  /**
   * @inheritDoc
   */
  @Event() vMounted!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event() vDestroyed!: EventEmitter<void>;

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
  @Event() vBufferedChange!: EventEmitter<PlayerProps[PlayerProp.buffered]>;

  /**
   * @inheritDoc
   */
  @Event() vTextTracksChange!: EventEmitter<PlayerProps[PlayerProp.textTracks]>;

  /**
   * @inheritDoc
   */
  @Event() vErrorsChange!: EventEmitter<PlayerProps[PlayerProp.errors]>;

  /**
   * @inheritDoc
   */
  @Event() vLoadStart!: EventEmitter<void>;

  /**
   * @inheritDoc
   */
  @Event() vCurrentSrcChange!: EventEmitter<PlayerProps[PlayerProp.currentSrc]>;

  /**
   * @inheritDoc
   */
  @Event() vCurrentPosterChange!: EventEmitter<PlayerProps[PlayerProp.currentPoster]>;

  /**
   * @inheritDoc
   */
  @Event() vMediaTitleChange!: EventEmitter<PlayerProps[PlayerProp.mediaTitle]>;

  /**
   * @inheritDoc
   */
  @Event() vControlsChange!: EventEmitter<PlayerProps[PlayerProp.isControlsActive]>;

  /**
   * @inheritDoc
   */
  @Event() vPlaybackRateChange!: EventEmitter<PlayerProps[PlayerProp.playbackRate]>;

  /**
   * @inheritDoc
   */
  @Event() vPlaybackRatesChange!: EventEmitter<PlayerProps[PlayerProp.playbackRates]>;

  /**
   * @inheritDoc
   */
  @Event() vPlaybackQualityChange!: EventEmitter<PlayerProps[PlayerProp.playbackQuality]>;

  /**
   * @inheritDoc
   */
  @Event() vPlaybackQualitiesChange!: EventEmitter<PlayerProps[PlayerProp.playbackQualities]>;

  /**
   * @inheritDoc
   */
  @Event() vMutedChange!: EventEmitter<PlayerProps[PlayerProp.muted]>;

  /**
   * @inheritDoc
   */
  @Event() vVolumeChange!: EventEmitter<PlayerProps[PlayerProp.volume]>;

  /**
   * @inheritDoc
   */
  @Event() vViewTypeChange!: EventEmitter<PlayerProps[PlayerProp.viewType]>;

  /**
   * @inheritDoc
   */
  @Event() vMediaTypeChange!: EventEmitter<PlayerProps[PlayerProp.mediaType]>;

  /**
   * @inheritDoc
   */
  @Event() vLiveChange!: EventEmitter<PlayerProps[PlayerProp.isLive]>;

  /**
   * @inheritDoc
   */
  @Event() vTouchChange!: EventEmitter<PlayerProps[PlayerProp.isTouch]>;

  /**
   * @inheritDoc
   */
  @Event() vLanguageChange!: EventEmitter<PlayerProps[PlayerProp.language]>;

  /**
   * @inheritDoc
   */
  @Event() vLanguagesChange!: EventEmitter<PlayerProps[PlayerProp.languages]>;

  /**
   * @inheritDoc
   */
  @Event() vFullscreenChange!: EventEmitter<PlayerProps[PlayerProp.isFullscreenActive]>;

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
    // @ts-ignore
    this.translations = {
      ...this.translations,
      [language]: {
        ...(this.translations[language] ?? {}),
        ...translations,
      },
    };

    this.scheduler.markAsInternallyChanged(PlayerProp.translations);
  }

  @Listen('vLoadStart')
  async onMediaChange(event: Event) {
    event.stopPropagation();
    this.scheduler.onMediaChange();
  }

  @Listen('vStateChange')
  async onStateChange(event: CustomEvent<PlayerStateChange>) {
    event.stopImmediatePropagation();
    const change = event.detail;
    this.scheduler.onInternalStateChange(change.by, change.prop, change.value);
  }

  connectedCallback() {
    this.autopauseMgr = new Autopause(this.el);
    this.scheduler = new Scheduler(this.el);
    this.onPausedChange();
    this.onCurrentTimeChange();
    this.onVolumeChange();
    this.onMutedChange();

    this.fullscreen = new Fullscreen(
      this.el,
      (isActive) => {
        this.isFullscreenActive = isActive;
        this.scheduler.markAsInternallyChanged(PlayerProp.isFullscreenActive);
      },
    );

    this.disposal.add(onTouchInputChange((isTouch) => {
      this.isTouch = isTouch;
      this.scheduler.markAsInternallyChanged(PlayerProp.isTouch);
    }));
  }

  componentWillLoad() {
    Universe.create(this, this.getPlayerState());
    return this.getProvider() as Promise<any>;
  }

  componentDidLoad() {
    this.disposal.add(lazyLoader(this.el));
    this.mounted = true;
    this.scheduler.markAsInternallyChanged(PlayerProp.mounted);
  }

  componentWillRender() {
    return this.scheduler.onWillRender();
  }

  disconnectedCallback() {
    this.textTracksChangeListener?.();
    this.fullscreen.destroy();
    this.autopauseMgr.destroy();
    this.scheduler.destroy();
    this.disposal.empty();
    this.destroyed = true;
    this.scheduler.markAsInternallyChanged(PlayerProp.destroyed);
  }

  private getPlayerState() {
    return Object.values(PlayerProp)
      .reduce((state, prop) => ({ ...state, [prop]: this[prop] }), {});
  }

  private calcAspectRatio() {
    const [width, height] = this.aspectRatio.split(':');
    return (100 / Number(width)) * Number(height);
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
   * @inheritdoc
   */
  @Method()
  async toggleCaptionsVisiblity(isVisible?: boolean) {
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
    this.scheduler.markAsInternallyChanged(PlayerProp.currentCaption);
    this.isCaptionsActive = !isUndefined(activeCaption);
    this.scheduler.markAsInternallyChanged(PlayerProp.isCaptionsActive);
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
        aria-hidden={!this.ready ? 'true' : 'false'}
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
                active: !this.ready,
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
