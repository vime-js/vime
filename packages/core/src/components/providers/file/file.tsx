/* eslint-disable jsx-a11y/media-has-caption */

import {
  h, Prop, Method, Component, Event, EventEmitter, Watch, Element,
} from '@stencil/core';
import { withProviderContext, MediaProvider } from '../MediaProvider';
import { ViewType } from '../../core/player/ViewType';
import { MediaFileProvider, MediaPreloadOption, MediaCrossOriginOption } from './MediaFileProvider';
import {
  isString, isNumber, isUndefined, isNull, isNullOrUndefined,
} from '../../../utils/unit';
import { audioRegex, videoRegex, hlsRegex } from './utils';
import { WebkitPresentationMode } from './WebkitPresentationMode';
import {
  canUsePiP, canUsePiPInChrome, canUsePiPInSafari, canFullscreenVideo, IS_IOS,
} from '../../../utils/support';
import { MediaType } from '../../core/player/MediaType';
import { listen } from '../../../utils/dom';
import { Disposal } from '../../core/player/Disposal';
import { findRootPlayer } from '../../core/player/utils';
import { createProviderDispatcher, ProviderDispatcher } from '../ProviderDispatcher';
import { Logger } from '../../core/player/PlayerLogger';
import { LazyLoader } from '../../core/player/LazyLoader';

/**
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
@Component({
  tag: 'vime-file',
  styleUrl: 'file.scss',
})
export class File implements MediaFileProvider<HTMLMediaElement>, MediaProvider<HTMLMediaElement> {
  private dispatch!: ProviderDispatcher;

  private timeRAF?: number;

  private disposal = new Disposal();

  private lazyLoader?: LazyLoader;

  private playbackStarted = false;

  private wasPausedBeforeSeeking = true;

  private currentSrcSet: (string | null)[] = [];

  private prevMediaEl?: HTMLMediaElement;

  private mediaEl?: HTMLMediaElement;

  @Element() el!: HTMLVimeFileElement;

  /**
   * @internal Whether an external SDK will attach itself to the media player and control it.
   */
  @Prop() willAttach = false;

  /**
   * @inheritdoc
   */
  @Prop() crossOrigin?: MediaCrossOriginOption;

  /**
   * @inheritdoc
   */
  @Prop() preload?: MediaPreloadOption = 'metadata';

  /**
   * @inheritdoc
   */
  @Prop() poster?: string;

  /**
   * The title of the current media.
   */
  @Prop() mediaTitle?: string;

  @Watch('mediaTitle')
  onMediaTitleChange() {
    this.dispatch('mediaTitle', this.mediaTitle);
  }

  @Watch('poster')
  onPosterChange() {
    this.dispatch('currentPoster', this.poster);
  }

  /**
   * @inheritdoc
   */
  @Prop() controlsList?: string;

  /**
   * @inheritdoc
   */
  @Prop({ attribute: 'auto-pip' }) autoPiP?: boolean;

  /**
   * @inheritdoc
   */
  @Prop({ attribute: 'disable-pip' }) disablePiP?: boolean;

  /**
   * @inheritdoc
   */
  @Prop() disableRemotePlayback?: boolean;

  /**
   * Whether to use an `audio` or `video` element to play the media.
   */
  @Prop() viewType?: ViewType;

  @Watch('viewType')
  onViewTypeChange() {
    this.dispatch('viewType', this.viewType);
  }

  /**
   * The playback rates that are available for this media.
   */
  @Prop() playbackRates: number[] = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  /**
   * @internal
   */
  @Prop() language = 'en';

  /**
   * @internal
   */
  @Prop() autoplay = false;

  /**
   * @internal
   */
  @Prop() controls = false;

  /**
   * @internal
   */
  @Prop() logger?: Logger;

  /**
   * @internal
   */
  @Prop() loop = false;

  /**
   * @internal
   */
  @Prop() muted = false;

  /**
   * @internal
   */
  @Prop() playsinline = false;

  /**
   * @internal
   */
  @Event() vLoadStart!: EventEmitter<void>;

  /**
   * Emitted when the underlying media element changes.
   */
  @Event() vMediaElChange!: EventEmitter<HTMLAudioElement | HTMLVideoElement | undefined>;

  /**
   * Emitted when the child `<source />` elements are modified.
   */
  @Event() vSrcSetChange!: EventEmitter<void>;

  constructor() {
    withProviderContext(this);
  }

  connectedCallback() {
    this.initLazyLoader();
    this.dispatch = createProviderDispatcher(this);
    this.onViewTypeChange();
    this.onPosterChange();
    this.onMediaTitleChange();
    this.listenToTextTracksChanges();
  }

  componentDidRender() {
    if (this.prevMediaEl !== this.mediaEl) {
      this.prevMediaEl = this.mediaEl;
      this.vMediaElChange.emit(this.mediaEl);
    }
  }

  componentDidLoad() {
    this.onViewTypeChange();
  }

  disconnectedCallback() {
    this.cancelTimeUpdates();
    this.disposal.empty();
    this.lazyLoader?.destroy();
    this.playbackStarted = false;
    this.wasPausedBeforeSeeking = true;
  }

  private initLazyLoader() {
    this.lazyLoader = new LazyLoader(this.el, this.didSrcSetChange.bind(this));
  }

  private didSrcSetChange() {
    if (isNullOrUndefined(this.mediaEl)) return;

    const sources = Array.from(this.mediaEl!.querySelectorAll('source'));
    const srcSet = sources.map((source) => source.src);

    const didChange = (this.currentSrcSet.length !== srcSet.length)
      || (srcSet.some((src, i) => this.currentSrcSet[i] !== src));

    if (didChange) {
      this.onSrcChange();
      this.currentSrcSet = srcSet;
    }
  }

  private onSrcChange() {
    this.vLoadStart.emit();
    this.vSrcSetChange.emit();
    this.mediaEl?.load();
  }

  private hasCustomPoster() {
    const root = findRootPlayer(this);
    return !IS_IOS && !isNull(root.querySelector('vime-ui vime-poster'));
  }

  private cancelTimeUpdates() {
    if (isNumber(this.timeRAF)) window.cancelAnimationFrame(this.timeRAF!);
    this.timeRAF = undefined;
  }

  private requestTimeUpdates() {
    this.dispatch('currentTime', this.mediaEl?.currentTime ?? 0);
    this.timeRAF = window.requestAnimationFrame(() => { this.requestTimeUpdates(); });
  }

  private getMediaType() {
    const { currentSrc } = this.mediaEl!;
    if (audioRegex.test(currentSrc)) return MediaType.Audio;
    if (videoRegex.test(currentSrc) || hlsRegex.test(currentSrc)) return MediaType.Video;
    return undefined;
  }

  private onLoadedMetadata() {
    this.dispatch('currentPoster', this.poster);
    this.dispatch('duration', this.mediaEl!.duration);
    this.dispatch('playbackRates', this.playbackRates);
    this.onProgress();
    this.onTracksChange();
    this.didSrcSetChange();
    if (!this.willAttach) {
      this.dispatch('currentSrc', this.mediaEl!.currentSrc);
      this.dispatch('mediaType', this.getMediaType());
      this.dispatch('playbackReady', true);
    }
  }

  private onProgress() {
    const { buffered, duration } = this.mediaEl!;
    const end = (buffered.length === 0) ? 0 : buffered.end(buffered.length - 1);
    this.dispatch('buffered', (end > duration) ? duration : end);
  }

  private onPlay() {
    this.requestTimeUpdates();
    this.dispatch('paused', false);
    if (!this.playbackStarted) {
      this.playbackStarted = true;
      this.dispatch('playbackStarted', true);
    }
  }

  private onPause() {
    this.cancelTimeUpdates();
    this.dispatch('paused', true);
    this.dispatch('buffering', false);
  }

  private onPlaying() {
    this.dispatch('playing', true);
    this.dispatch('buffering', false);
  }

  private onSeeking() {
    if (!this.wasPausedBeforeSeeking) this.wasPausedBeforeSeeking = this.mediaEl!.paused;
    this.dispatch('currentTime', this.mediaEl!.currentTime);
    this.dispatch('seeking', true);
  }

  private onSeeked() {
    this.dispatch('seeking', false);
    if (!this.playbackStarted || !this.wasPausedBeforeSeeking) this.attemptToPlay();
    this.wasPausedBeforeSeeking = true;
  }

  private onRateChange() {
    this.dispatch('playbackRate', this.mediaEl!.playbackRate);
  }

  private onVolumeChange() {
    this.dispatch('muted', this.mediaEl!.muted);
    this.dispatch('volume', this.mediaEl!.volume * 100);
  }

  private onDurationChange() {
    this.dispatch('duration', this.mediaEl!.duration);
  }

  private onWaiting() {
    this.dispatch('buffering', true);
  }

  private onSuspend() {
    this.dispatch('buffering', false);
  }

  private onEnded() {
    if (!this.loop) this.dispatch('playbackEnded', true);
  }

  private onError() {
    this.dispatch('errors', [this.mediaEl!.error]);
  }

  private attemptToPlay() {
    try {
      this.mediaEl?.play();
    } catch (e) {
      this.dispatch('errors', [e]);
    }
  }

  private togglePiPInChrome(toggle: boolean) {
    return toggle
      ? (this.mediaEl as any)?.requestPictureInPicture()
      : (document as any).exitPictureInPicture();
  }

  private togglePiPInSafari(toggle: boolean) {
    const mode = toggle ? WebkitPresentationMode.PiP : WebkitPresentationMode.Inline;

    if (!(this.mediaEl as any)?.webkitSupportsPresentationMode(mode)) {
      throw new Error('PiP API is not available.');
    }

    return (this.mediaEl as any)?.webkitSetPresentationMode(mode);
  }

  private async togglePiP(toggle: boolean) {
    if (canUsePiPInChrome()) return this.togglePiPInChrome(toggle);
    if (canUsePiPInSafari()) return this.togglePiPInSafari(toggle);
    throw new Error('PiP API is not available.');
  }

  private async toggleFullscreen(toggle: boolean) {
    if (!((this.mediaEl as any)?.webkitSupportsFullscreen)) {
      throw new Error('Fullscreen API is not available.');
    }

    return toggle
      ? (this.mediaEl as any)?.webkitEnterFullscreen()
      : (this.mediaEl as any)?.webkitExitFullscreen();
  }

  private onPresentationModeChange() {
    const mode = (this.mediaEl as any)?.webkitPresentationMode;
    this.dispatch('isPiPActive', (mode === WebkitPresentationMode.PiP));
    this.dispatch('isFullscreenActive', (mode === WebkitPresentationMode.Fullscreen));
  }

  private onEnterPiP() {
    this.dispatch('isPiPActive', true);
  }

  private onLeavePiP() {
    this.dispatch('isPiPActive', false);
  }

  private onTracksChange() {
    this.dispatch('textTracks', this.mediaEl!.textTracks);
  }

  private listenToTextTracksChanges() {
    if (isUndefined(this.mediaEl)) return;
    this.disposal.add(
      listen(this.mediaEl!.textTracks, 'change', this.onTracksChange.bind(this)),
    );
  }

  /**
   * @internal
   */
  @Method()
  async getAdapter() {
    return {
      getInternalPlayer: async () => this.mediaEl!,
      play: async () => this.mediaEl?.play(),
      pause: async () => this.mediaEl?.pause(),
      canPlay: async (type: any) => isString(type)
        && (audioRegex.test(type) || videoRegex.test(type)),
      setCurrentTime: async (time: number) => {
        if (this.mediaEl) this.mediaEl.currentTime = time;
      },
      setMuted: async (muted: boolean) => {
        if (this.mediaEl) this.mediaEl.muted = muted;
      },
      setVolume: async (volume: number) => {
        if (this.mediaEl) this.mediaEl.volume = (volume / 100);
      },
      canSetPlaybackRate: async () => true,
      setPlaybackRate: async (rate: number) => {
        if (this.mediaEl) this.mediaEl.playbackRate = rate;
      },
      canSetPiP: async () => canUsePiP(),
      enterPiP: () => this.togglePiP(true),
      exitPiP: () => this.togglePiP(false),
      canSetFullscreen: async () => canFullscreenVideo(),
      enterFullscreen: () => this.toggleFullscreen(true),
      exitFullscreen: () => this.toggleFullscreen(false),
    };
  }

  render() {
    const mediaProps = {
      autoplay: this.autoplay,
      muted: this.muted,
      playsinline: this.playsinline,
      playsInline: this.playsinline,
      'x5-playsinline': this.playsinline,
      'webkit-playsinline': this.playsinline,
      controls: this.controls,
      crossorigin: this.crossOrigin,
      controlslist: this.controlsList,
      'data-poster': !this.hasCustomPoster() ? this.poster : undefined,
      loop: this.loop,
      preload: this.preload,
      disablePictureInPicture: this.disablePiP,
      autoPictureInPicture: this.autoPiP,
      disableRemotePlayback: this.disableRemotePlayback,
      'x-webkit-airplay': this.disableRemotePlayback ? 'deny' : 'allow',
      ref: (el: any) => { this.mediaEl = el; },
      onLoadedMetadata: this.onLoadedMetadata.bind(this),
      onProgress: this.onProgress.bind(this),
      onPlay: this.onPlay.bind(this),
      onPause: this.onPause.bind(this),
      onPlaying: this.onPlaying.bind(this),
      onSeeking: this.onSeeking.bind(this),
      onSeeked: this.onSeeked.bind(this),
      onRateChange: this.onRateChange.bind(this),
      onVolumeChange: this.onVolumeChange.bind(this),
      onDurationChange: this.onDurationChange.bind(this),
      onWaiting: this.onWaiting.bind(this),
      onSuspend: this.onSuspend.bind(this),
      onEnded: this.onEnded.bind(this),
      onError: this.onError.bind(this),
    };

    const audio = (
      <audio
        class="lazy"
        {...mediaProps}
      >
        <slot />
        Your browser does not support the
        <code>audio</code>
        element.
      </audio>
    );

    const video = (
      <video
        class="lazy"
        {...mediaProps}
        // @ts-ignore
        onwebkitpresentationmodechanged={this.onPresentationModeChange.bind(this)}
        onenterpictureinpicture={this.onEnterPiP.bind(this)}
        onleavepictureinpicture={this.onLeavePiP.bind(this)}
      >
        <slot />
        Your browser does not support the
        <code>video</code>
        element.
      </video>
    );

    return (this.viewType === ViewType.Audio) ? audio : video;
  }
}
