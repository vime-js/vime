import {
  h, Component, Method, Prop, State, Watch, EventEmitter, Event,
} from '@stencil/core';
import { MediaProvider, openProviderWormhole } from '../MediaProvider';
import { decodeJSON, loadImage } from '../../../utils/network';
import { createPlayerStateDispatcher, PlayerStateDispatcher } from '../../core/player/PlayerState';
import { YouTubeCommand, YouTubeCommands } from './YouTubeCommands';
import { YouTubePlayerParams } from './YouTubePlayerParams';
import {
  isString, isNumber, isArray, isBoolean, isObject,
} from '../../../utils/unit';
import { PlayerProp } from '../../core/player/PlayerProp';
import { YouTubeMessage, YouTubePlayerState } from './YouTubeEvent';
import { mapYouTubePlaybackQuality } from './YouTubePlaybackQuality';
import { MediaType } from '../../core/player/MediaType';
import { ViewType } from '../../core/player/ViewType';

@Component({
  tag: 'vime-youtube',
  styleUrl: 'youtube.css',
})
export class YouTube implements MediaProvider<HTMLVimeEmbedElement> {
  private embed!: HTMLVimeEmbedElement;

  private dispatch!: PlayerStateDispatcher;

  private playerInfoDefaults: any = {};

  private playerState = {
    paused: true,
    duration: 0,
    seeking: false,
    playbackStarted: false,
    pauseOncePlaying: false,
    currentTime: 0,
    lastTimeUpdate: 0,
    playbackRate: 1,
    state: -1,
  };

  private initialMuted!: boolean;

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
    this.pendingPosterFetch = this.findPosterURL();
  }

  private pendingPosterFetch?: Promise<any>;

  private findPosterURL() {
    const posterURL = (quality: string) => `https://i.ytimg.com/vi/${this.videoId}/${quality}.jpg`;

    /**
     * We are testing a that the image has a min-width of 121px because if the thumbnail does not
     * exist YouTube returns a blank/error image that is 120px wide.
     */
    return loadImage(posterURL('maxresdefault'), 121) // 1080p (no padding)
      .catch(() => loadImage(posterURL('sddefault'), 121)) // 640p (padded 4:3)
      .catch(() => loadImage(posterURL('hqdefault'), 121)) // 480p (padded 4:3)
      .then((img) => img.src);
  }

  /**
   * Whether the fullscreen control should be shown.
   */
  @Prop() showFullscreenControl = true;

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
    this.initialMuted = this.muted;
    this.playerInfoDefaults = { ...this.playerState };
    this.dispatch = createPlayerStateDispatcher(this);
    this.onVideoIdChange();
    this.dispatch(PlayerProp.ViewType, ViewType.Video);
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

  private remoteControl<T extends keyof YouTubeCommands>(command: T, arg?: YouTubeCommands[T]) {
    return this.embed.postMessage({
      event: 'command',
      func: command,
      args: arg ? [arg] : undefined,
    });
  }

  private buildParams(): YouTubePlayerParams {
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
    this.vLoadStart.emit();
  }

  private onEmbedLoaded() {
    // Seems like we have to wait a random small delay or else YT player isn't ready.
    setTimeout(() => this.embed.postMessage({ event: 'listening' }), 100);
  }

  private onPlayerStateChange(state: YouTubePlayerState) {
    if (state === YouTubePlayerState.Unstarted) return;

    const isPlaying = (state === YouTubePlayerState.Playing);
    const isBuffering = (state === YouTubePlayerState.Buffering);

    this.dispatch(PlayerProp.Buffering, isBuffering);

    // Detect `play` events early.
    if (this.playerState.paused && (isBuffering || isPlaying)) {
      this.playerState.paused = false;
      this.dispatch(PlayerProp.Paused, false);
      if (!this.playerState.playbackStarted) this.dispatch(PlayerProp.PlaybackStarted, true);
      if (!this.playerState.playbackStarted && this.playerState.seeking) {
        this.playerState.pauseOncePlaying = true;
      }
      this.playerState.playbackStarted = true;
    }

    switch (state) {
      case YouTubePlayerState.Cued:
        this.playerState = { ...this.playerInfoDefaults };
        this.dispatch(PlayerProp.CurrentSrc, this.embedSrc);
        this.dispatch(PlayerProp.MediaType, MediaType.Video);
        this.pendingPosterFetch!.then((poster) => {
          this.dispatch(PlayerProp.CurrentPoster, poster);
          this.dispatch(PlayerProp.PlaybackReady, true);
        });
        break;
      case YouTubePlayerState.Playing:
        this.dispatch(PlayerProp.Playing, true);
        if (this.playerState.pauseOncePlaying) {
        // Command is ignored if fired immediately after playing.
          setTimeout(() => { this.remoteControl(YouTubeCommand.Pause); }, 150);
          this.playerState.pauseOncePlaying = false;
        }
        break;
      case YouTubePlayerState.Paused:
        this.playerState.paused = true;
        this.dispatch(PlayerProp.Paused, true);
        break;
      case YouTubePlayerState.Ended:
        this.dispatch(PlayerProp.PlaybackEnded, true);
        if (this.loop) {
          this.remoteControl(YouTubeCommand.Seek, 0);
          // Command is ignored if fired immediately after seeking.
          setTimeout(() => { this.remoteControl(YouTubeCommand.Play); }, 150);
        }
        break;
    }

    this.playerState.state = state;
  }

  private calcCurrentTime(time: number) {
    let currentTime = time;
    if (this.playerState.state === YouTubePlayerState.Playing) {
      const elapsedTime = (
        Date.now() / 1E3 - this.playerInfoDefaults.lastTimeUpdate
      ) * this.playerState.playbackRate;
      if (elapsedTime > 0) currentTime += Math.min(elapsedTime, 1);
    }
    return currentTime;
  }

  private onTimeChange(time: number) {
    const currentTime = this.calcCurrentTime(time);
    this.dispatch(PlayerProp.CurrentTime, currentTime);

    // This is the only way to detect `seeking`.
    if (Math.abs(this.playerState.currentTime - currentTime) > 1.5) {
      this.playerState.seeking = true;
      this.dispatch(PlayerProp.Seeking, true);
      if (this.playerState.paused) this.dispatch(PlayerProp.Buffering, true);
    }

    this.playerState.currentTime = currentTime;
  }

  private onBufferedChange(buffered: number) {
    this.dispatch(PlayerProp.Buffered, buffered);

    /**
     * This is the only way to detect `seeked`. Unfortunately while the player is `paused` `seeking`
     * and `seeked` will fire at the same time, there are no updates inbetween -_-. We need an
     * artifical delay between the two events.
     */
    if (this.playerState.seeking && (buffered > this.playerState.currentTime)) {
      setTimeout(() => {
        this.playerState.seeking = false;
        this.dispatch(PlayerProp.Seeking, false);
        if (this.playerState.paused) this.dispatch(PlayerProp.Buffering, false);
      }, this.playerState.paused ? 100 : 0);
    }
  }

  private onEmbedMessage(event: CustomEvent<YouTubeMessage>) {
    const message = event.detail;
    const { info } = message;

    if (!info) return;

    if (isObject(info.videoData)) this.dispatch(PlayerProp.MediaTitle, info.videoData!.title);

    if (isNumber(info.playerState)) this.onPlayerStateChange(info.playerState!);

    if (isNumber(info.duration)) {
      this.playerState.duration = info.duration!;
      this.dispatch(PlayerProp.Duration, info.duration!);
    }

    if (isArray(info.availablePlaybackRates)) {
      this.dispatch(PlayerProp.PlaybackRates, info.availablePlaybackRates!);
    }

    if (isNumber(info.playbackRate)) {
      this.playerState.playbackRate = info.playbackRate!;
      this.dispatch(PlayerProp.PlaybackRate, info.playbackRate!);
    }

    if (isNumber(info.currentTime)) this.onTimeChange(info.currentTime!);

    if (isNumber(info.currentTimeLastUpdated)) {
      this.playerState.lastTimeUpdate = info.currentTimeLastUpdated!;
    }

    if (isNumber(info.videoLoadedFraction)) {
      this.onBufferedChange(info.videoLoadedFraction! * this.playerState.duration);
    }

    if (isNumber(info.volume)) this.dispatch(PlayerProp.Volume, info.volume!);

    if (isBoolean(info.muted)) this.dispatch(PlayerProp.Muted, info.muted!);

    if (isArray(info.availableQualityLevels)) {
      this.dispatch(
        PlayerProp.PlaybackQualities,
        info.availableQualityLevels!.map((q) => mapYouTubePlaybackQuality(q)) as string[],
      );
    }

    if (isString(info.playbackQuality)) {
      this.dispatch(PlayerProp.PlaybackQuality, mapYouTubePlaybackQuality(info.playbackQuality!));
    }
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
        onEmbedLoaded={this.onEmbedLoaded.bind(this)}
        onEmbedMessage={this.onEmbedMessage.bind(this)}
        onEmbedSrcChange={this.onEmbedSrcChange.bind(this)}
        ref={(el: any) => { this.embed = el; }}
      />
    );
  }
}

openProviderWormhole(YouTube);
