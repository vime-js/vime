/* eslint-disable jsx-a11y/media-has-caption */

import {
  h, Prop, Method, Component, Event, EventEmitter, Watch,
} from '@stencil/core';
import { openProviderWormhole, MediaProvider } from '../MediaProvider';
import { createPlayerStateDispatcher, PlayerStateDispatcher } from '../../core/player/PlayerState';
import { PlayerProp } from '../../core/player/PlayerProp';
import { ViewType } from '../../core/player/ViewType';
import { MediaFileProvider, MediaPreloadOption } from './MediaFileProvider';
import { isString, isNumber, isUndefined } from '../../../utils/unit';
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

/**
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
@Component({
  tag: 'vime-file',
  styleUrl: 'file.scss',
})
export class File implements MediaFileProvider<HTMLMediaElement>, MediaProvider<HTMLMediaElement> {
  private dispatch!: PlayerStateDispatcher;

  private mediaEl?: HTMLMediaElement;

  private timeRAF?: number;

  private disposal = new Disposal();

  private playbackStarted = false;

  private wasPausedBeforeSeeking = true;

  /**
   * @internal Whether an external SDK will attach itself to the media player and control it.
   */
  @Prop() willAttach = false;

  /**
   * @inheritdoc
   */
  @Prop() crossOrigin?: string;

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
    this.dispatch(PlayerProp.MediaTitle, this.mediaTitle);
  }

  @Watch('poster')
  onPosterChange() {
    this.dispatch(PlayerProp.CurrentPoster, this.poster);
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
    this.dispatch(PlayerProp.ViewType, this.viewType);
  }

  /**
   * The playback rates that are available for this media.
   */
  @Prop() playbackRates: number[] = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  /**
   * @internal
   */
  @Prop({ attribute: null }) language!: string;

  /**
   * @internal
   */
  @Prop({ attribute: null }) autoplay!: boolean;

  /**
   * @internal
   */
  @Prop({ attribute: null }) controls!: boolean;

  /**
   * @internal
   */
  @Prop({ attribute: null }) debug!: boolean;

  /**
   * @internal
   */
  @Prop({ attribute: null }) loop!: boolean;

  /**
   * @internal
   */
  @Prop({ attribute: null }) muted!: boolean;

  /**
   * @internal
   */
  @Prop({ attribute: null }) playsinline!: boolean;

  /**
   * @internal
   */
  @Event() vLoadStart!: EventEmitter<void>;

  connectedCallback() {
    this.dispatch = createPlayerStateDispatcher(this);
    this.onViewTypeChange();
    this.onPosterChange();
    this.onMediaTitleChange();
    this.listenToTextTracksChanges();
  }

  componentWillLoad() {
    this.vLoadStart.emit();
  }

  disconnectedCallback() {
    this.mediaEl!.pause();
    this.cancelTimeUpdates();
    this.disposal.empty();
    this.playbackStarted = false;
    this.wasPausedBeforeSeeking = true;
  }

  private cancelTimeUpdates() {
    if (isNumber(this.timeRAF)) window.cancelAnimationFrame(this.timeRAF!);
    this.timeRAF = undefined;
  }

  private requestTimeUpdates() {
    this.dispatch(PlayerProp.CurrentTime, this.mediaEl?.currentTime ?? 0);
    this.timeRAF = window.requestAnimationFrame(() => { this.requestTimeUpdates(); });
  }

  private getMediaType() {
    const { currentSrc } = this.mediaEl!;
    if (audioRegex.test(currentSrc)) return MediaType.Audio;
    if (videoRegex.test(currentSrc) || hlsRegex.test(currentSrc)) return MediaType.Video;
    return undefined;
  }

  private onLoadedMetadata() {
    this.dispatch(PlayerProp.CurrentPoster, this.poster);
    this.dispatch(PlayerProp.Duration, this.mediaEl!.duration);
    this.dispatch(PlayerProp.PlaybackRates, this.playbackRates);
    this.onProgress();
    this.onTracksChange();
    if (!this.willAttach) {
      this.dispatch(PlayerProp.CurrentSrc, this.mediaEl!.currentSrc);
      this.dispatch(PlayerProp.MediaType, this.getMediaType());
      this.dispatch(PlayerProp.PlaybackReady, true);
    }
  }

  private onProgress() {
    const { buffered, duration } = this.mediaEl!;
    const end = (buffered.length === 0) ? 0 : buffered.end(buffered.length - 1);
    this.dispatch(PlayerProp.Buffered, (end > duration) ? duration : end);
  }

  private onPlay() {
    this.requestTimeUpdates();
    this.dispatch(PlayerProp.Paused, false);
    if (!this.playbackStarted) {
      this.playbackStarted = true;
      this.dispatch(PlayerProp.PlaybackStarted, true);
    }
  }

  private onPause() {
    this.cancelTimeUpdates();
    this.dispatch(PlayerProp.Paused, true);
    this.dispatch(PlayerProp.Buffering, false);
  }

  private onPlaying() {
    this.dispatch(PlayerProp.Playing, true);
    this.dispatch(PlayerProp.Buffering, false);
  }

  private onSeeking() {
    if (!this.wasPausedBeforeSeeking) this.wasPausedBeforeSeeking = this.mediaEl!.paused;
    this.dispatch(PlayerProp.CurrentTime, this.mediaEl!.currentTime);
    this.dispatch(PlayerProp.Seeking, true);
  }

  private onSeeked() {
    this.dispatch(PlayerProp.Seeking, false);
    if (!this.playbackStarted || !this.wasPausedBeforeSeeking) this.attemptToPlay();
    this.wasPausedBeforeSeeking = true;
  }

  private onRateChange() {
    this.dispatch(PlayerProp.PlaybackRate, this.mediaEl!.playbackRate);
  }

  private onVolumeChange() {
    this.dispatch(PlayerProp.Muted, this.mediaEl!.muted);
    this.dispatch(PlayerProp.Volume, this.mediaEl!.volume * 100);
  }

  private onDurationChange() {
    this.dispatch(PlayerProp.Duration, this.mediaEl!.duration);
  }

  private onWaiting() {
    this.dispatch(PlayerProp.Buffering, true);
  }

  private onSuspend() {
    this.dispatch(PlayerProp.Buffering, false);
  }

  private onEnded() {
    if (!this.loop) this.dispatch(PlayerProp.PlaybackEnded, true);
  }

  private onError(event: Event) {
    this.dispatch(PlayerProp.Errors, [event]);
  }

  private attemptToPlay() {
    try {
      this.mediaEl?.play();
    } catch (e) {
      this.dispatch(PlayerProp.Errors, [e]);
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
    this.dispatch(PlayerProp.IsPiPActive, (mode === WebkitPresentationMode.PiP));
    this.dispatch(PlayerProp.IsFullscreenActive, (mode === WebkitPresentationMode.Fullscreen));
  }

  private onEnterPiP() {
    this.dispatch(PlayerProp.IsPiPActive, true);
  }

  private onLeavePiP() {
    this.dispatch(PlayerProp.IsPiPActive, false);
  }

  private onTracksChange() {
    this.dispatch(PlayerProp.TextTracks, this.mediaEl!.textTracks);
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
      poster: this.poster,
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
      <audio {...mediaProps}>
        <slot />
        Your browser does not support the
        <code>audio</code>
        element.
      </audio>
    );

    const video = (
      <video
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

openProviderWormhole(File);
