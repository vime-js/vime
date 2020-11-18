/* eslint-disable no-continue, jsx-a11y/media-has-caption */

import {
  h, Prop, Method, Component, Event, EventEmitter, Watch, Element, State,
} from '@stencil/core';
import { MediaProvider } from '../MediaProvider';
import { withProviderConnect } from '../ProviderConnect';
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
import { Disposal } from '../../../utils/Disposal';
import { createProviderDispatcher, ProviderDispatcher } from '../ProviderDispatcher';
import { Logger } from '../../core/player/PlayerLogger';
import { LazyLoader } from '../../core/player/LazyLoader';
import { MediaResource } from './MediaResource';
import { watchComponentRegistry, withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withProviderContext } from '../withProviderContext';

/**
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
@Component({
  tag: 'vm-file',
  styleUrl: 'file.css',
  scoped: true,
})
export class File implements MediaFileProvider<HTMLMediaElement>, MediaProvider<HTMLMediaElement> {
  private dispatch!: ProviderDispatcher;

  private timeRAF?: number;

  private textTracksDisposal = new Disposal();

  private lazyLoader?: LazyLoader;

  private wasPausedBeforeSeeking = true;

  private currentSrcSet: MediaResource[] = [];

  private prevMediaEl?: HTMLMediaElement;

  private mediaEl?: HTMLMediaElement;

  private mediaQueryDisposal = new Disposal();

  @Element() host!: HTMLVmFileElement;

  @State() vmPoster?: HTMLVmPosterElement;

  /** @internal Whether an external SDK will attach itself to the media player and control it. */
  @Prop() willAttach = false;

  /** @inheritdoc */
  @Prop() crossOrigin?: MediaCrossOriginOption;

  /** @inheritdoc */
  @Prop() preload?: MediaPreloadOption = 'metadata';

  /** @inheritdoc */
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
    if (!this.playbackStarted) this.mediaEl?.load();
  }

  /** @inheritdoc */
  @Prop() controlsList?: string;

  /** @inheritdoc */
  @Prop({ attribute: 'auto-pip' }) autoPiP?: boolean;

  /** @inheritdoc */
  @Prop({ attribute: 'disable-pip' }) disablePiP?: boolean;

  /** @inheritdoc */
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

  /** @internal */
  @Prop() language = 'en';

  /** @internal */
  @Prop() autoplay = false;

  /** @internal */
  @Prop() controls = false;

  /** @internal */
  @Prop() logger?: Logger;

  /** @internal */
  @Prop() loop = false;

  /** @internal */
  @Prop() muted = false;

  /** @internal */
  @Prop() playsinline = false;

  /** @internal */
  @Prop() noConnect = false;

  /** @internal */
  @Prop() paused = true;

  /** @internal */
  @Prop() currentTime = 0;

  /** @internal */
  @Prop() playbackReady = false;

  /** @internal */
  @Prop() playbackStarted = false;

  /** @internal */
  @Event() vmLoadStart!: EventEmitter<void>;

  /**
   * Emitted when an error has occurred.
   */
  @Event() vmError!: EventEmitter<any>;

  /**
   * Emitted when the underlying media element changes.
   */
  @Event() vmMediaElChange!: EventEmitter<HTMLAudioElement | HTMLVideoElement | undefined>;

  /**
   * Emitted when the child `<source />` elements are modified.
   */
  @Event() vmSrcSetChange!: EventEmitter<MediaResource[]>;

  constructor() {
    withComponentRegistry(this);
    if (!this.noConnect) withProviderConnect(this);
    withProviderContext(this, [
      'playbackReady',
      'playbackStarted',
      'currentTime',
      'paused',
      'currentTextTrack',
      'isTextTrackVisible',
      'shouldRenderNativeTextTracks',
    ]);
    watchComponentRegistry(this, 'vm-poster', ((regs) => { [this.vmPoster] = regs; }));
  }

  connectedCallback() {
    this.initLazyLoader();
    this.dispatch = createProviderDispatcher(this);
    this.onViewTypeChange();
    this.onPosterChange();
    this.onMediaTitleChange();
  }

  componentDidRender() {
    if (this.prevMediaEl !== this.mediaEl) {
      this.prevMediaEl = this.mediaEl;
      this.vmMediaElChange.emit(this.mediaEl);
    }
  }

  componentDidLoad() {
    this.onViewTypeChange();
  }

  disconnectedCallback() {
    this.mediaQueryDisposal.empty();
    this.textTracksDisposal.empty();
    this.cancelTimeUpdates();
    this.lazyLoader?.destroy();
    this.wasPausedBeforeSeeking = true;
  }

  private initLazyLoader() {
    this.lazyLoader = new LazyLoader(this.host, ['data-src', 'data-poster'], () => {
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
      child.setAttribute('src', src);
    }
  }

  private didSrcSetChange() {
    if (isNullOrUndefined(this.mediaEl)) return;

    const sources = Array.from(this.mediaEl!.querySelectorAll('source'));

    const srcSet = sources.map((source) => ({
      src: source.getAttribute('data-vs')!,
      media: source.getAttribute('data-media') ?? undefined,
      ref: source,
    }));

    const didChange = (this.currentSrcSet.length !== srcSet.length)
      || srcSet.some((resource, i) => this.currentSrcSet[i].src !== resource.src);

    if (didChange) {
      this.currentSrcSet = srcSet;
      this.onSrcSetChange();
    }
  }

  private onSrcSetChange() {
    this.textTracksDisposal.empty();
    this.mediaQueryDisposal.empty();
    this.vmLoadStart.emit();
    this.vmSrcSetChange.emit(this.currentSrcSet);
    if (!this.willAttach) this.mediaEl?.load();
  }

  private hasCustomPoster() {
    return !IS_IOS && !isUndefined(this.vmPoster);
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
    this.listenToTextTracksForChanges();
    this.onTextTracksChange();
    this.onProgress();
    this.dispatch('currentPoster', this.poster);
    this.dispatch('duration', this.mediaEl!.duration);
    this.dispatch('playbackRates', this.playbackRates);

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
    this.vmError.emit(this.mediaEl!.error);
  }

  private attemptToPlay() {
    try {
      this.mediaEl?.play();
    } catch (e) {
      this.vmError.emit(e);
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

  /** @internal */
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
      setCurrentTextTrack: async (trackId: number) => {
        if (trackId !== this.currentTextTrack) this.toggleTextTrackModes(trackId);
      },
      setTextTrackVisibility: async (isVisible: boolean) => {
        this.isTextTrackVisible = isVisible;
        this.toggleTextTrackModes(this.currentTextTrack);
      },
    };
  }

  /** @internal */
  @Prop() currentTextTrack = -1;

  /** @internal */
  @Prop() hasCustomTextManager = false;

  @Watch('hasCustomTextManager')
  onHasCustomTextManagerChange() {
    if (this.hasCustomTextManager) {
      this.textTracksDisposal.empty();
    } else if (this.playbackReady) {
      this.listenToTextTracksForChanges();
    }
  }

  /** @internal */
  @Prop() isTextTrackVisible = true;

  /** @internal */
  @Prop() shouldRenderNativeTextTracks = true;

  @Watch('shouldRenderNativeTextTracks')
  onShouldRenderNativeTextTracksChange() {
    if (this.hasCustomTextManager) return;
    this.toggleTextTrackModes(this.currentTextTrack);
  }

  private getFilteredTextTracks() {
    const tracks = [];
    const textTrackList = Array.from(this.mediaEl!.textTracks);

    for (let i = 0; i < textTrackList.length; i += 1) {
      const track = textTrackList[i];
      // Edge adds a track without a label; we don't want to use it.
      if ((track.kind === 'subtitles' || track.kind === 'captions') && track.label) {
        tracks.push(textTrackList[i]);
      }
    }

    return tracks;
  }

  private listenToTextTracksForChanges() {
    if (this.hasCustomTextManager) return;
    this.textTracksDisposal.empty();
    if (isUndefined(this.mediaEl)) return;
    this.textTracksDisposal.add(
      listen(this.mediaEl!.textTracks, 'change', this.onTextTracksChange.bind(this)),
    );
  }

  private onTextTracksChange() {
    const tracks = this.getFilteredTextTracks();

    let trackId = -1;
    for (let id = 0; id < tracks.length; id += 1) {
      if (tracks[id].mode === 'hidden') {
        // Do not break in case there is a following track with showing.
        trackId = id;
      } else if (tracks[id].mode === 'showing') {
        trackId = id;
        break;
      }
    }

    if (!this.shouldRenderNativeTextTracks && tracks[trackId]?.mode === 'showing') {
      tracks[trackId].mode = 'hidden';
      return;
    }

    if (this.shouldRenderNativeTextTracks) {
      this.isTextTrackVisible = (trackId !== -1) && (tracks[trackId].mode === 'showing');
      this.dispatch('isTextTrackVisible', this.isTextTrackVisible);
    }

    this.dispatch('textTracks', tracks);
    this.dispatch('currentTextTrack', (
      this.shouldRenderNativeTextTracks && !this.isTextTrackVisible
    ) ? -1 : trackId);
  }

  private toggleTextTrackModes(newTrackId: number) {
    if (isNullOrUndefined(this.mediaEl)) return;

    const { textTracks } = this.mediaEl;

    if (newTrackId === -1) {
      Array.from(textTracks).forEach((track) => { track.mode = 'disabled'; });
    } else {
      const oldTrack = textTracks[this.currentTextTrack];
      if (oldTrack) oldTrack.mode = 'disabled';
    }

    const nextTrack = textTracks[newTrackId];

    if (nextTrack) {
      nextTrack.mode = (this.isTextTrackVisible && this.shouldRenderNativeTextTracks)
        ? 'showing'
        : 'hidden';
    }

    this.dispatch('currentTextTrack', (
      this.shouldRenderNativeTextTracks && !this.isTextTrackVisible
    ) ? -1 : newTrackId);
    this.dispatch('isTextTrackVisible', this.isTextTrackVisible);
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
      crossorigin: (this.crossOrigin === '') ? 'anonymous' : this.crossOrigin,
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
