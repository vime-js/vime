/* eslint-disable jsx-a11y/media-has-caption */

import {
  h, Prop, Method, Component, Event, EventEmitter, Watch, Element, State,
} from '@stencil/core';
import { withProviderContext, MediaProvider } from '../MediaProvider';
import { createPlayerDispatcher, PlayerDispatcher } from '../../core/player/PlayerDispatcher';
import { PlayerProp } from '../../core/player/PlayerProp';
import { ViewType } from '../../core/player/ViewType';
import { MediaFileProvider, MediaPreloadOption, MediaCrossOriginOption } from './MediaFileProvider';
import {
  isString, isNumber, isUndefined, isNull, isNullOrUndefined,
} from '../../../utils/unit';
import { audioRegex, videoRegex, hlsRegex } from './utils';
import { WebkitPresentationMode } from './WebkitPresentationMode';
import {
  canUsePiP,
  canUsePiPInChrome,
  canUsePiPInSafari,
  canFullscreenVideo,
} from '../../../utils/support';
import { MediaType } from '../../core/player/MediaType';
import { listen } from '../../../utils/dom';
import { Disposal } from '../../core/player/Disposal';
import { findRootPlayer } from '../../core/player/utils';

/**
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
@Component({
  tag: 'vime-file',
  styleUrl: 'file.scss',
})
export class File implements MediaFileProvider<HTMLMediaElement>, MediaProvider<HTMLMediaElement> {
  private dispatch!: PlayerDispatcher;

  private timeRAF?: number;

  private disposal = new Disposal();

  private cancelMutationObserver?: () => void;

  private playbackStarted = false;

  private wasPausedBeforeSeeking = true;

  private currentSrcSet: (string | null)[] = [];

  @Element() el!: HTMLVimeFileElement;

  @State() mediaEl?: HTMLMediaElement;

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
    this.dispatch(PlayerProp.mediaTitle, this.mediaTitle);
  }

  @Watch('poster')
  onPosterChange() {
    this.dispatch(PlayerProp.currentPoster, this.poster);
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
    this.dispatch(PlayerProp.viewType, this.viewType);
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
  @Prop() debug = false;

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
   * Emitted when the child <source> elements are modified.
   */
  @Event() vSrcSetChange!: EventEmitter<void>;

  componentWillLoad() {
    this.dispatch = createPlayerDispatcher(this);
    this.onViewTypeChange();
    this.onPosterChange();
    this.onMediaTitleChange();
    this.listenToTextTracksChanges();
  }

  componentDidLoad() {
    this.onViewTypeChange();
  }

  disconnectedCallback() {
    this.mediaEl!.pause();
    this.cancelTimeUpdates();
    this.disposal.empty();
    this.cancelMutationObserver?.();
    this.playbackStarted = false;
    this.wasPausedBeforeSeeking = true;
  }

  @Watch('mediaEl')
  setupMutationObserver() {
    this.cancelMutationObserver?.();
    if (isNullOrUndefined(this.mediaEl)) return;

    const observer = new MutationObserver(this.didSrcSetChange.bind(this));

    observer.observe(this.mediaEl!, {
      childList: true,
      subtree: true,
      attributeFilter: ['src', 'data-src'],
    });

    this.cancelMutationObserver = () => { observer.disconnect(); };
  }

  private didSrcSetChange() {
    if (isNullOrUndefined(this.mediaEl)) return;

    const sources = Array.from(this.mediaEl!.querySelectorAll('source'));
    const srcSet = sources.map((source) => source.src || source.getAttribute('data-src'));

    const didChange = (this.currentSrcSet.length !== srcSet.length)
      || (srcSet.some((src, i) => this.currentSrcSet[i] !== src));

    if (didChange) {
      if (this.mediaEl!.hasAttribute('data-loaded')) {
        sources.forEach((source) => {
          if (source.hasAttribute('data-src') && !source.hasAttribute('src')) {
            source.setAttribute('src', source.getAttribute('data-src')!);
          }
        });
      }

      this.vLoadStart.emit();
      this.mediaEl?.load();
      this.vSrcSetChange.emit();
    }

    this.currentSrcSet = srcSet;
  }

  private hasCustomPoster() {
    const root = findRootPlayer(this);
    return !isNull(root.querySelector('vime-ui vime-poster'));
  }

  private cancelTimeUpdates() {
    if (isNumber(this.timeRAF)) window.cancelAnimationFrame(this.timeRAF!);
    this.timeRAF = undefined;
  }

  private requestTimeUpdates() {
    this.dispatch(PlayerProp.currentTime, this.mediaEl?.currentTime ?? 0);
    this.timeRAF = window.requestAnimationFrame(() => { this.requestTimeUpdates(); });
  }

  private getMediaType() {
    const { currentSrc } = this.mediaEl!;
    if (audioRegex.test(currentSrc)) return MediaType.Audio;
    if (videoRegex.test(currentSrc) || hlsRegex.test(currentSrc)) return MediaType.Video;
    return undefined;
  }

  private onLoadedMetadata() {
    this.dispatch(PlayerProp.currentPoster, this.poster);
    this.dispatch(PlayerProp.duration, this.mediaEl!.duration);
    this.dispatch(PlayerProp.playbackRates, this.playbackRates);
    this.onProgress();
    this.onTracksChange();
    this.didSrcSetChange();
    if (!this.willAttach) {
      this.dispatch(PlayerProp.currentSrc, this.mediaEl!.currentSrc);
      this.dispatch(PlayerProp.mediaType, this.getMediaType());
      this.dispatch(PlayerProp.playbackReady, true);
    }
  }

  private onProgress() {
    const { buffered, duration } = this.mediaEl!;
    const end = (buffered.length === 0) ? 0 : buffered.end(buffered.length - 1);
    this.dispatch(PlayerProp.buffered, (end > duration) ? duration : end);
  }

  private onPlay() {
    this.requestTimeUpdates();
    this.dispatch(PlayerProp.paused, false);
    if (!this.playbackStarted) {
      this.playbackStarted = true;
      this.dispatch(PlayerProp.playbackStarted, true);
    }
  }

  private onPause() {
    this.cancelTimeUpdates();
    this.dispatch(PlayerProp.paused, true);
    this.dispatch(PlayerProp.buffering, false);
  }

  private onPlaying() {
    this.dispatch(PlayerProp.playing, true);
    this.dispatch(PlayerProp.buffering, false);
  }

  private onSeeking() {
    if (!this.wasPausedBeforeSeeking) this.wasPausedBeforeSeeking = this.mediaEl!.paused;
    this.dispatch(PlayerProp.currentTime, this.mediaEl!.currentTime);
    this.dispatch(PlayerProp.seeking, true);
  }

  private onSeeked() {
    this.dispatch(PlayerProp.seeking, false);
    if (!this.playbackStarted || !this.wasPausedBeforeSeeking) this.attemptToPlay();
    this.wasPausedBeforeSeeking = true;
  }

  private onRateChange() {
    this.dispatch(PlayerProp.playbackRate, this.mediaEl!.playbackRate);
  }

  private onVolumeChange() {
    this.dispatch(PlayerProp.muted, this.mediaEl!.muted);
    this.dispatch(PlayerProp.volume, this.mediaEl!.volume * 100);
  }

  private onDurationChange() {
    this.dispatch(PlayerProp.duration, this.mediaEl!.duration);
  }

  private onWaiting() {
    this.dispatch(PlayerProp.buffering, true);
  }

  private onSuspend() {
    this.dispatch(PlayerProp.buffering, false);
  }

  private onEnded() {
    if (!this.loop) this.dispatch(PlayerProp.playbackEnded, true);
  }

  private onError(event: Event) {
    this.dispatch(PlayerProp.errors, [event]);
  }

  private attemptToPlay() {
    try {
      this.mediaEl?.play();
    } catch (e) {
      this.dispatch(PlayerProp.errors, [e]);
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
    this.dispatch(PlayerProp.isPiPActive, (mode === WebkitPresentationMode.PiP));
    this.dispatch(PlayerProp.isFullscreenActive, (mode === WebkitPresentationMode.Fullscreen));
  }

  private onEnterPiP() {
    this.dispatch(PlayerProp.isPiPActive, true);
  }

  private onLeavePiP() {
    this.dispatch(PlayerProp.isPiPActive, false);
  }

  private onTracksChange() {
    this.dispatch(PlayerProp.textTracks, this.mediaEl!.textTracks);
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
      <audio class="lazy" {...mediaProps}>
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

withProviderContext(File);
