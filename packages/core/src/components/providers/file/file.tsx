/* eslint-disable no-continue, jsx-a11y/media-has-caption */

import {
  h, Prop, Method, Component, Event, EventEmitter, Watch, Element,
} from '@stencil/core';
import { withProviderContext, MediaProvider, withProviderConnect } from '../MediaProvider';
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
import { MediaResource } from './MediaResource';
import { createDispatcher } from '../../core/player/PlayerDispatcher';

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

  private wasPausedBeforeSeeking = true;

  private playbackQuality?: string;

  private currentSrcSet: MediaResource[] = [];

  private prevMediaEl?: HTMLMediaElement;

  private mediaEl?: HTMLMediaElement;

  private mediaQueryDisposal = new Disposal();

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
  @Prop() noConnect = false;

  /**
   * @internal
   */
  @Prop() paused = true;

  /**
   * @internal
   */
  @Prop() currentTime = 0;

  /**
   * @internal
   */
  @Prop() playbackStarted = false;

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
  @Event() vSrcSetChange!: EventEmitter<MediaResource[]>;

  constructor() {
    if (!this.noConnect) withProviderConnect(this);
    withProviderContext(this, ['playbackStarted', 'currentTime', 'paused']);
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
    this.mediaQueryDisposal.empty();
    this.cancelTimeUpdates();
    this.disposal.empty();
    this.lazyLoader?.destroy();
    this.wasPausedBeforeSeeking = true;
  }

  private initLazyLoader() {
    this.lazyLoader = new LazyLoader(this.el, ['data-src', 'data-poster'], () => {
      if (isNullOrUndefined(this.mediaEl)) return;

      const poster = this.mediaEl.getAttribute('data-poster');
      if (!isNull(poster)) this.mediaEl.setAttribute('poster', poster);

      this.refresh();
      this.didSrcSetChange();
    });
  }

  private refresh() {
    if (isNullOrUndefined(this.mediaEl)) return;
    const { children } = this.mediaEl;

    for (let i = 0; i <= children.length - 1; i += 1) {
      const child = children[i];
      const src = child.getAttribute('data-src') || child.getAttribute('src') || child.getAttribute('data-vs');
      child.removeAttribute('src');
      if (isNull(src)) continue;
      child.setAttribute('data-vs', src);

      if (!isNull(child.getAttribute('data-quality'))) {
        const quality = child.getAttribute('data-quality');
        if (quality !== this.playbackQuality) {
          child.removeAttribute('src');
          continue;
        }
      }

      child.setAttribute('src', src);
    }
  }

  private didSrcSetChange() {
    if (isNullOrUndefined(this.mediaEl)) return;

    const sources = Array.from(this.mediaEl!.querySelectorAll('source'));

    const srcSet = sources.map((source) => ({
      src: source.getAttribute('data-vs')!,
      quality: source.getAttribute('data-quality') ?? undefined,
      media: source.getAttribute('data-media') ?? undefined,
      ref: source,
    }));

    const didChange = (this.currentSrcSet.length !== srcSet.length)
      || (srcSet.some((resource, i) => (
        (this.currentSrcSet[i].src !== resource.src)
        || (this.currentSrcSet[i].quality !== resource.quality)
      )));

    if (didChange) {
      this.currentSrcSet = srcSet;
      this.onSrcSetChange();
    }
  }

  private onSrcSetChange() {
    this.mediaQueryDisposal.empty();
    this.vLoadStart.emit();
    this.vSrcSetChange.emit(this.currentSrcSet);
    if (this.hasPlaybackQualities()) {
      this.dispatch('playbackQualities', this.getPlaybackQualities());
      this.pickInitialPlaybackQuality();
      this.refresh();
    }
    this.mediaEl?.load();
  }

  private hasPlaybackQualities() {
    return this.currentSrcSet.every((resource) => !!resource.quality);
  }

  private getPlaybackQualities() {
    if (!this.hasPlaybackQualities()) return [];
    return this.currentSrcSet.map((resource) => resource.quality!);
  }

  private pickInitialPlaybackQuality() {
    if (!isUndefined(this.playbackQuality)) return;

    const getQualityValue = (
      resource: MediaResource,
    ) => Number(resource.quality?.slice(0, -1) ?? 0);

    const sortMediaResource = (
      a: MediaResource,
      b: MediaResource,
    ) => getQualityValue(a) - getQualityValue(b);

    // Try to find best quality based on media queries.
    let mediaResource = this.currentSrcSet
      .filter((resource) => {
        if (!isString(resource.media)) return false;
        const query = window.matchMedia(resource.media);
        const dispatch = createDispatcher(this);

        this.mediaQueryDisposal.add(listen(query, 'change', (e) => {
          if ((e as any).matches) dispatch('playbackQuality', resource.quality);
        }));

        return query.matches;
      })
      .sort(sortMediaResource)
      .pop();

    // Otherwise pick best quality based on window width.
    if (isUndefined(mediaResource)) {
      mediaResource = this.currentSrcSet
        .find((resource) => getQualityValue(resource) > window.innerWidth);
    }

    // Otehrwise pick best quality.
    if (isUndefined(mediaResource)) {
      mediaResource = this.currentSrcSet.sort(sortMediaResource).pop();
    }

    this.playbackQuality = mediaResource?.quality;
    this.dispatch('playbackQuality', mediaResource?.quality);
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
    this.onTracksChange();

    // Reset player state on quality change.
    if (this.playbackStarted) {
      this.mediaEl!.muted = this.muted;
      if (this.currentTime > 0) this.mediaEl!.currentTime = this.currentTime;
      if (!this.paused) this.mediaEl!.play();
    } else {
      this.onProgress();
      this.dispatch('currentPoster', this.poster);
      this.dispatch('duration', this.mediaEl!.duration);
      this.dispatch('playbackRates', this.playbackRates);
    }

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
    if (!this.playbackStarted) this.dispatch('playbackStarted', true);
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
      canSetPlaybackQuality: async () => this.hasPlaybackQualities(),
      setPlaybackQuality: async (quality: string) => {
        this.cancelTimeUpdates();
        this.playbackQuality = quality;
        this.refresh();
        this.mediaEl?.load();
        this.dispatch('playbackQuality', this.playbackQuality);
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
