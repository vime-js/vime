import {
  Component,
  Event,
  EventEmitter,
  h,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { decodeJSON, loadImage } from '../../../utils/network';
import {
  isArray,
  isBoolean,
  isNumber,
  isObject,
  isString,
} from '../../../utils/unit';
import { MediaType } from '../../core/player/MediaType';
import { Logger } from '../../core/player/PlayerLogger';
import { ViewType } from '../../core/player/ViewType';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { MediaProvider } from '../MediaProvider';
import { withProviderConnect } from '../ProviderConnect';
import {
  createProviderDispatcher,
  ProviderDispatcher,
} from '../ProviderDispatcher';
import { withProviderContext } from '../withProviderContext';
import { YouTubeCommand, YouTubeCommandArg } from './YouTubeCommand';
import { YouTubeMessage } from './YouTubeMessage';
import { YouTubeParams } from './YouTubeParams';
import { mapYouTubePlaybackQuality } from './YouTubePlaybackQuality';
import { YouTubePlayerState } from './YouTubePlayerState';

const posterCache = new Map<string, string>();

/**
 * Enables loading, playing and controlling videos from [YouTube](https://www.youtube.com).
 *
 * > You don't interact with this component for passing player properties, controlling playback,
 * listening to player events and so on, that is all done through the `vime-player` component.
 */
@Component({
  tag: 'vm-youtube',
  styleUrl: 'youtube.css',
  shadow: true,
})
export class YouTube implements MediaProvider<HTMLVmEmbedElement> {
  private embed!: HTMLVmEmbedElement;

  private dispatch!: ProviderDispatcher;

  private defaultInternalState: any = {};

  private internalState = {
    paused: true,
    duration: 0,
    seeking: false,
    playbackReady: false,
    playbackStarted: false,
    currentTime: 0,
    lastTimeUpdate: 0,
    playbackRate: 1,
    state: -1,
  };

  private initialMuted!: boolean;

  private fetchPosterURL?: Promise<string | undefined>;

  @State() embedSrc = '';

  @State() mediaTitle = '';

  /**
   * Whether cookies should be enabled on the embed.
   */
  @Prop() cookies = false;

  /**
   * The YouTube resource ID of the video to load.
   */
  @Prop() videoId!: string;

  @Watch('cookies')
  @Watch('videoId')
  onVideoIdChange() {
    if (!this.videoId) {
      this.embedSrc = '';
      return;
    }

    this.embedSrc = `${this.getOrigin()}/embed/${this.videoId}`;
    this.fetchPosterURL = this.findPosterURL();
  }

  /**
   * Whether the fullscreen control should be shown.
   */
  @Prop() showFullscreenControl = true;

  /**
   * The absolute URL of a custom poster to be used for the current video.
   */
  @Prop() poster?: string;

  @Watch('poster')
  onCustomPosterChange() {
    this.dispatch('currentPoster', this.poster);
  }

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
  @Event() vmLoadStart!: EventEmitter<void>;

  constructor() {
    withComponentRegistry(this);
    withProviderConnect(this);
    withProviderContext(this);
  }

  connectedCallback() {
    this.dispatch = createProviderDispatcher(this);
    this.dispatch('viewType', ViewType.Video);
    this.onVideoIdChange();
    this.defaultInternalState = { ...this.internalState };
  }

  componentWillLoad() {
    this.initialMuted = this.muted;
  }

  /** @internal */
  @Method()
  async getAdapter() {
    const canPlayRegex =
      /(?:youtu\.be|youtube|youtube\.com|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|)((?:\w|-){11})/;

    return {
      getInternalPlayer: async () => this.embed,
      play: async () => {
        this.remoteControl(YouTubeCommand.Play);
      },
      pause: async () => {
        this.remoteControl(YouTubeCommand.Pause);
      },
      canPlay: async (type: any) => isString(type) && canPlayRegex.test(type),
      setCurrentTime: async (time: number) => {
        if (time !== this.internalState.currentTime) {
          this.remoteControl(YouTubeCommand.Seek, time);
        }
      },
      setMuted: async (muted: boolean) => {
        muted
          ? this.remoteControl(YouTubeCommand.Mute)
          : this.remoteControl(YouTubeCommand.Unmute);
      },
      setVolume: async (volume: number) => {
        this.remoteControl(YouTubeCommand.SetVolume, volume);
      },
      canSetPlaybackRate: async () => true,
      setPlaybackRate: async (rate: number) => {
        this.remoteControl(YouTubeCommand.SetPlaybackRate, rate);
      },
    };
  }

  private getOrigin() {
    return !this.cookies
      ? 'https://www.youtube-nocookie.com'
      : 'https://www.youtube.com';
  }

  private getPreconnections() {
    return [
      this.getOrigin(),
      'https://www.google.com',
      'https://googleads.g.doubleclick.net',
      'https://static.doubleclick.net',
      'https://s.ytimg.com',
      'https://i.ytimg.com',
    ];
  }

  private remoteControl<T extends keyof YouTubeCommandArg>(
    command: T,
    arg?: YouTubeCommandArg[T],
  ) {
    return this.embed.postMessage({
      event: 'command',
      func: command,
      args: arg ? [arg] : undefined,
    });
  }

  private buildParams(): YouTubeParams {
    return {
      enablejsapi: 1,
      cc_lang_pref: this.language,
      hl: this.language,
      fs: this.showFullscreenControl ? 1 : 0,
      controls: this.controls ? 1 : 0,
      disablekb: !this.controls ? 1 : 0,
      iv_load_policy: this.controls ? 1 : 3,
      mute: this.initialMuted ? 1 : 0,
      playsinline: this.playsinline ? 1 : 0,
      autoplay: this.autoplay ? 1 : 0,
    };
  }

  private onEmbedSrcChange() {
    this.vmLoadStart.emit();
    this.dispatch('viewType', ViewType.Video);
  }

  private onEmbedLoaded() {
    // Seems like we have to wait a random small delay or else YT player isn't ready.
    window.setTimeout(
      () => this.embed.postMessage({ event: 'listening' }),
      100,
    );
  }

  private async findPosterURL() {
    if (posterCache.has(this.videoId)) return posterCache.get(this.videoId);

    const posterURL = (quality: string) =>
      `https://i.ytimg.com/vi/${this.videoId}/${quality}.jpg`;

    /**
     * We are testing a that the image has a min-width of 121px because if the thumbnail does not
     * exist YouTube returns a blank/error image that is 120px wide.
     */
    return loadImage(posterURL('maxresdefault'), 121) // 1080p (no padding)
      .catch(() => loadImage(posterURL('sddefault'), 121)) // 640p (padded 4:3)
      .catch(() => loadImage(posterURL('hqdefault'), 121)) // 480p (padded 4:3)
      .then(img => {
        const poster = img.src;
        posterCache.set(this.videoId, poster);
        return poster;
      });
  }

  private onCued() {
    if (this.internalState.playbackReady) return;
    this.internalState = { ...this.defaultInternalState };
    this.dispatch('currentSrc', this.embedSrc);
    this.dispatch('mediaType', MediaType.Video);
    this.fetchPosterURL!.then(poster => {
      this.dispatch('currentPoster', this.poster ?? poster);
      this.dispatch('playbackReady', true);
    });
    this.internalState.playbackReady = true;
  }

  private onPlayerStateChange(state: YouTubePlayerState) {
    // Sometimes the embed falls back to an unstarted state for some unknown reason, this will
    // make sure the player is configured to the right starting state.
    if (
      this.internalState.playbackReady &&
      state === YouTubePlayerState.Unstarted
    ) {
      this.internalState.paused = true;
      this.internalState.playbackStarted = false;
      this.dispatch('buffering', false);
      this.dispatch('paused', true);
      this.dispatch('playbackStarted', false);
      return;
    }

    const isPlaying = state === YouTubePlayerState.Playing;
    const isBuffering = state === YouTubePlayerState.Buffering;

    this.dispatch('buffering', isBuffering);

    // Attempt to detect `play` events early.
    if (this.internalState.paused && (isBuffering || isPlaying)) {
      this.internalState.paused = false;
      this.dispatch('paused', false);

      if (!this.internalState.playbackStarted) {
        this.dispatch('playbackStarted', true);
        this.internalState.playbackStarted = true;
      }
    }

    switch (state) {
      case YouTubePlayerState.Cued:
        this.onCued();
        break;
      case YouTubePlayerState.Playing:
        // Incase of autoplay which might skip `Cued` event.
        this.onCued();
        this.dispatch('playing', true);
        break;
      case YouTubePlayerState.Paused:
        this.internalState.paused = true;
        this.dispatch('paused', true);
        break;
      case YouTubePlayerState.Ended:
        if (this.loop) {
          window.setTimeout(() => {
            this.remoteControl(YouTubeCommand.Play);
          }, 150);
        } else {
          this.dispatch('playbackEnded', true);
          this.internalState.paused = true;
          this.dispatch('paused', true);
        }
        break;
    }

    this.internalState.state = state;
  }

  private calcCurrentTime(time: number) {
    let currentTime = time;

    if (this.internalState.state === YouTubePlayerState.Ended) {
      return this.internalState.duration;
    }

    if (this.internalState.state === YouTubePlayerState.Playing) {
      const elapsedTime =
        (Date.now() / 1e3 - this.defaultInternalState.lastTimeUpdate) *
        this.internalState.playbackRate;
      if (elapsedTime > 0) currentTime += Math.min(elapsedTime, 1);
    }

    return currentTime;
  }

  private onTimeChange(time: number) {
    const currentTime = this.calcCurrentTime(time);
    this.dispatch('currentTime', currentTime);

    // This is the only way to detect `seeking`.
    if (Math.abs(this.internalState.currentTime - currentTime) > 1.5) {
      this.internalState.seeking = true;
      this.dispatch('seeking', true);
    }

    this.internalState.currentTime = currentTime;
  }

  private onBufferedChange(buffered: number) {
    this.dispatch('buffered', buffered);

    /**
     * This is the only way to detect `seeked`. Unfortunately while the player is `paused` `seeking`
     * and `seeked` will fire at the same time, there are no updates inbetween -_-. We need an
     * artifical delay between the two events.
     */
    if (
      this.internalState.seeking &&
      buffered > this.internalState.currentTime
    ) {
      window.setTimeout(
        () => {
          this.internalState.seeking = false;
          this.dispatch('seeking', false);
        },
        this.internalState.paused ? 100 : 0,
      );
    }
  }

  private onEmbedMessage(event: CustomEvent<YouTubeMessage>) {
    const message = event.detail;
    const { info } = message;

    if (!info) return;

    if (isObject(info.videoData))
      this.dispatch('mediaTitle', info.videoData!.title);

    if (isNumber(info.duration)) {
      this.internalState.duration = info.duration!;
      this.dispatch('duration', info.duration!);
    }

    if (isArray(info.availablePlaybackRates)) {
      this.dispatch('playbackRates', info.availablePlaybackRates!);
    }

    if (isNumber(info.playbackRate)) {
      this.internalState.playbackRate = info.playbackRate!;
      this.dispatch('playbackRate', info.playbackRate!);
    }

    if (isNumber(info.currentTime)) this.onTimeChange(info.currentTime!);

    if (isNumber(info.currentTimeLastUpdated)) {
      this.internalState.lastTimeUpdate = info.currentTimeLastUpdated!;
    }

    if (isNumber(info.videoLoadedFraction)) {
      this.onBufferedChange(
        info.videoLoadedFraction! * this.internalState.duration,
      );
    }

    if (isNumber(info.volume)) this.dispatch('volume', info.volume!);

    if (isBoolean(info.muted)) this.dispatch('muted', info.muted!);

    if (isArray(info.availableQualityLevels)) {
      this.dispatch(
        'playbackQualities',
        info.availableQualityLevels!.map(q =>
          mapYouTubePlaybackQuality(q),
        ) as string[],
      );
    }

    if (isString(info.playbackQuality)) {
      this.dispatch(
        'playbackQuality',
        mapYouTubePlaybackQuality(info.playbackQuality!),
      );
    }

    if (isNumber(info.playerState)) this.onPlayerStateChange(info.playerState!);
  }

  render() {
    return (
      <vm-embed
        embedSrc={this.embedSrc}
        mediaTitle={this.mediaTitle}
        origin={this.getOrigin()}
        params={this.buildParams()}
        decoder={decodeJSON}
        preconnections={this.getPreconnections()}
        onVmEmbedLoaded={this.onEmbedLoaded.bind(this)}
        onVmEmbedMessage={this.onEmbedMessage.bind(this)}
        onVmEmbedSrcChange={this.onEmbedSrcChange.bind(this)}
        ref={(el: any) => {
          this.embed = el;
        }}
      />
    );
  }
}
