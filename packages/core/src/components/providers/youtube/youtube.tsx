import {
  h, Component, Method, Prop, State, Watch, EventEmitter, Event,
} from '@stencil/core';
import { MediaProvider, withProviderConnect, withProviderContext } from '../MediaProvider';
import { decodeJSON, loadImage } from '../../../utils/network';
import { YouTubeCommand, YouTubeCommandArg } from './YouTubeCommand';
import { YouTubeParams } from './YouTubeParams';
import {
  isString, isNumber, isArray, isBoolean, isObject,
} from '../../../utils/unit';
import { mapYouTubePlaybackQuality } from './YouTubePlaybackQuality';
import { MediaType } from '../../core/player/MediaType';
import { ViewType } from '../../core/player/ViewType';
import { YouTubePlayerState } from './YouTubePlayerState';
import { YouTubeMessage } from './YouTubeMessage';
import { createProviderDispatcher, ProviderDispatcher } from '../ProviderDispatcher';
import { Logger } from '../../core/player/PlayerLogger';

const posterCache = new Map<string, string>();

@Component({
  tag: 'vime-youtube',
})
export class YouTube implements MediaProvider<HTMLVimeEmbedElement> {
  private embed!: HTMLVimeEmbedElement;

  private dispatch!: ProviderDispatcher;

  private defaultInternalState: any = {};

  private hasCued = false;

  private internalState = {
    paused: true,
    duration: 0,
    seeking: false,
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

  constructor() {
    withProviderConnect(this);
    withProviderContext(this);
  }

  connectedCallback() {
    this.dispatch = createProviderDispatcher(this);
    this.dispatch('viewType', ViewType.Video);
    this.onVideoIdChange();
    this.initialMuted = this.muted;
    this.defaultInternalState = { ...this.internalState };
  }

  /**
   * @internal
   */
  @Method()
  async getAdapter() {
    const canPlayRegex = /(?:youtu\.be|youtube|youtube\.com|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|)((?:\w|-){11})/;

    return {
      getInternalPlayer: async () => this.embed,
      play: async () => { this.remoteControl(YouTubeCommand.Play); },
      pause: async () => { this.remoteControl(YouTubeCommand.Pause); },
      canPlay: async (type: any) => isString(type) && canPlayRegex.test(type),
      setCurrentTime: async (time: number) => { this.remoteControl(YouTubeCommand.Seek, time); },
      setMuted: async (muted: boolean) => {
        muted ? this.remoteControl(YouTubeCommand.Mute) : this.remoteControl(YouTubeCommand.Unmute);
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
    return !this.cookies ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com';
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

  private remoteControl<T extends keyof YouTubeCommandArg>(command: T, arg?: YouTubeCommandArg[T]) {
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
      widget_referrer: window.location.href,
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
    this.hasCued = false;
    this.vLoadStart.emit();
  }

  private onEmbedLoaded() {
    // Seems like we have to wait a random small delay or else YT player isn't ready.
    window.setTimeout(() => this.embed.postMessage({ event: 'listening' }), 100);
  }

  private async findPosterURL() {
    if (posterCache.has(this.videoId)) return posterCache.get(this.videoId);

    const posterURL = (quality: string) => `https://i.ytimg.com/vi/${this.videoId}/${quality}.jpg`;

    /**
     * We are testing a that the image has a min-width of 121px because if the thumbnail does not
     * exist YouTube returns a blank/error image that is 120px wide.
     */
    return loadImage(posterURL('maxresdefault'), 121) // 1080p (no padding)
      .catch(() => loadImage(posterURL('sddefault'), 121)) // 640p (padded 4:3)
      .catch(() => loadImage(posterURL('hqdefault'), 121)) // 480p (padded 4:3)
      .then((img) => {
        const poster = img.src;
        posterCache.set(this.videoId, poster);
        return poster;
      });
  }

  private onCued() {
    if (this.hasCued) return;
    this.internalState = { ...this.defaultInternalState };
    this.dispatch('currentSrc', this.embedSrc);
    this.dispatch('mediaType', MediaType.Video);
    this.fetchPosterURL!.then((poster) => {
      this.dispatch('currentPoster', this.poster ?? poster);
      this.dispatch('playbackReady', true);
      // Re-attempt play.
      if (this.autoplay) this.remoteControl(YouTubeCommand.Play);
    });
    this.hasCued = true;
  }

  private onPlayerStateChange(state: YouTubePlayerState) {
    if (state === YouTubePlayerState.Unstarted) return;

    const isPlaying = (state === YouTubePlayerState.Playing);
    const isBuffering = (state === YouTubePlayerState.Buffering);

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
          window.setTimeout(() => { this.remoteControl(YouTubeCommand.Play); }, 150);
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
      const elapsedTime = (
        Date.now() / 1E3 - this.defaultInternalState.lastTimeUpdate
      ) * this.internalState.playbackRate;
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
    if (this.internalState.seeking && (buffered > this.internalState.currentTime)) {
      window.setTimeout(() => {
        this.internalState.seeking = false;
        this.dispatch('seeking', false);
      }, this.internalState.paused ? 100 : 0);
    }
  }

  private onEmbedMessage(event: CustomEvent<YouTubeMessage>) {
    const message = event.detail;
    const { info } = message;

    if (!info) return;

    if (isObject(info.videoData)) this.dispatch('mediaTitle', info.videoData!.title);

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
      this.onBufferedChange(info.videoLoadedFraction! * this.internalState.duration);
    }

    if (isNumber(info.volume)) this.dispatch('volume', info.volume!);

    if (isBoolean(info.muted)) this.dispatch('muted', info.muted!);

    if (isArray(info.availableQualityLevels)) {
      this.dispatch(
        'playbackQualities',
        info.availableQualityLevels!.map((q) => mapYouTubePlaybackQuality(q)) as string[],
      );
    }

    if (isString(info.playbackQuality)) {
      this.dispatch('playbackQuality', mapYouTubePlaybackQuality(info.playbackQuality!));
    }

    if (isNumber(info.playerState)) this.onPlayerStateChange(info.playerState!);
  }

  render() {
    return (
      <vime-embed
        embedSrc={this.embedSrc}
        mediaTitle={this.mediaTitle}
        origin={this.getOrigin()}
        params={this.buildParams()}
        decoder={decodeJSON}
        preconnections={this.getPreconnections()}
        onVEmbedLoaded={this.onEmbedLoaded.bind(this)}
        onVEmbedMessage={this.onEmbedMessage.bind(this)}
        onVEmbedSrcChange={this.onEmbedSrcChange.bind(this)}
        ref={(el: any) => { this.embed = el; }}
      />
    );
  }
}
