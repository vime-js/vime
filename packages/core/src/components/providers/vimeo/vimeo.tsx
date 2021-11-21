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

import { decodeJSON } from '../../../utils/network';
import { DeferredPromise, deferredPromise } from '../../../utils/promise';
import { isNumber, isString, isUndefined } from '../../../utils/unit';
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
import { VimeoCommand, VimeoCommandArg } from './VimeoCommand';
import {
  VimeoDataEvent,
  VimeoDataEventPayload,
  VimeoEvent,
} from './VimeoEvent';
import { VimeoMessage } from './VimeoMessage';
import { VimeoParams } from './VimeoParams';

interface VideoInfo {
  width: number;
  height: number;
  poster: string;
}

const videoInfoCache = new Map<string, VideoInfo>();

/**
 * Enables loading, playing and controlling videos from [Vimeo](https://www.vimeo.com).
 *
 * > You don't interact with this component for passing player properties, controlling playback,
 * listening to player events and so on, that is all done through the `vime-player` component.
 */
@Component({
  tag: 'vm-vimeo',
  styleUrl: 'vimeo.css',
  shadow: true,
})
export class Vimeo implements MediaProvider<HTMLVmEmbedElement> {
  private embed!: HTMLVmEmbedElement;

  private dispatch!: ProviderDispatcher;

  private initialMuted!: boolean;

  private fetchVideoInfo?: Promise<VideoInfo | undefined>;

  private pendingDurationCall?: DeferredPromise<number>;

  private pendingMediaTitleCall?: DeferredPromise<string>;

  private defaultInternalState: any = {};

  private volume = 50;

  private hasLoaded = false;

  private pendingPlayRequest?: any;

  private internalState = {
    paused: true,
    playing: false,
    seeking: false,
    currentTime: 0,
    buffered: 0,
    playbackStarted: false,
    playRequest: false,
  };

  @State() embedSrc = '';

  @State() mediaTitle = '';

  /**
   * The Vimeo resource ID of the video to load.
   */
  @Prop() videoId!: string;

  @Watch('videoId')
  onVideoIdChange() {
    this.cancelTimeUpdates();

    if (!this.videoId) {
      this.embedSrc = '';
      return;
    }

    this.embedSrc = `${this.getOrigin()}/video/${this.videoId}`;
    this.pendingDurationCall = deferredPromise();
    this.pendingMediaTitleCall = deferredPromise();
    this.fetchVideoInfo = this.getVideoInfo();
  }

  /**
   * Whether to display the video owner's name.
   */
  @Prop() byline = true;

  /**
   * The hexadecimal color value of the playback controls. The embed settings of the video
   * might override this value.
   */
  @Prop() color?: string;

  /**
   * Whether to display the video owner's portrait.
   */
  @Prop() portrait = true;

  /**
   * Turns off automatically determining the aspect ratio of the current video.
   */
  @Prop() noAutoAspectRatio = false;

  /**
   * The absolute URL of a custom poster to be used for the current video.
   */
  @Prop() poster?: string;

  /**
   * Whether cookies should be enabled on the embed.
   */
  @Prop() cookies = true;

  @Watch('poster')
  onCustomPosterChange() {
    this.dispatch('currentPoster', this.poster);
  }

  /** @internal */
  @Prop() language = 'en';

  /** @internal */
  @Prop() aspectRatio = '16:9';

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

  /**
   * Emitted when an error has occurred.
   */
  @Event() vmError!: EventEmitter<any>;

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

  componentDidLoad() {
    this.initialMuted = this.muted;
  }

  disconnectedCallback() {
    this.cancelTimeUpdates();
    this.pendingPlayRequest = undefined;
  }

  private getOrigin() {
    return 'https://player.vimeo.com';
  }

  private getPreconnections() {
    return [
      this.getOrigin(),
      'https://i.vimeocdn.com',
      'https://f.vimeocdn.com',
      'https://fresnel.vimeocdn.com',
    ];
  }

  private remoteControl<T extends keyof VimeoCommandArg>(
    command: T,
    arg?: VimeoCommandArg[T],
  ) {
    return this.embed.postMessage({
      method: command,
      value: arg,
    });
  }

  private buildParams(): VimeoParams {
    return {
      byline: this.byline,
      color: this.color,
      portrait: this.portrait,
      autopause: false,
      transparent: false,
      autoplay: this.autoplay,
      muted: this.initialMuted,
      playsinline: this.playsinline,
      dnt: !this.cookies,
    };
  }

  private async getVideoInfo() {
    if (videoInfoCache.has(this.videoId))
      return videoInfoCache.get(this.videoId);

    return window
      .fetch(`https://vimeo.com/api/oembed.json?url=${this.embedSrc}`)
      .then(response => response.json())
      .then(data => {
        const thumnailRegex = /vimeocdn.com\/video\/(.*)?_/;
        const thumbnailId = data?.thumbnail_url?.match(thumnailRegex)[1];
        const poster = `https://i.vimeocdn.com/video/${thumbnailId}_1920x1080.jpg`;
        const info = { poster, width: data?.width, height: data?.height };
        videoInfoCache.set(this.videoId, info);
        return info;
      });
  }

  private onTimeChange(time: number) {
    if (this.internalState.currentTime === time) return;

    this.dispatch('currentTime', time);

    // This is how we detect `seeking` early.
    if (Math.abs(this.internalState.currentTime - time) > 1.5) {
      this.internalState.seeking = true;
      this.dispatch('seeking', true);

      if (this.internalState.playing && this.internalState.buffered < time) {
        this.dispatch('buffering', true);
      }

      // Player doesn't resume playback once seeked.
      window.clearTimeout(this.pendingPlayRequest);
      if (!this.internalState.paused) {
        this.internalState.playRequest = true;
      }

      this.remoteControl(
        this.internalState.playbackStarted
          ? VimeoCommand.Pause
          : VimeoCommand.Play,
      );
    }

    this.internalState.currentTime = time;
  }

  private timeRAF?: number;

  private cancelTimeUpdates() {
    if (isNumber(this.timeRAF)) window.cancelAnimationFrame(this.timeRAF!);
  }

  private requestTimeUpdates() {
    this.remoteControl(VimeoCommand.GetCurrentTime);
    this.timeRAF = window.requestAnimationFrame(() => {
      this.requestTimeUpdates();
    });
  }

  private onSeeked() {
    if (!this.internalState.seeking) return;

    this.dispatch('seeking', false);
    this.internalState.seeking = false;

    if (this.internalState.playRequest) {
      window.setTimeout(() => {
        this.remoteControl(VimeoCommand.Play);
      }, 150);
    }
  }

  private onVimeoMethod<T extends keyof VimeoCommandArg>(
    method: T,
    arg: VimeoCommandArg[T],
  ) {
    switch (method) {
      case VimeoCommand.GetCurrentTime:
        if (!this.internalState.seeking) this.onTimeChange(arg as number);
        break;
      case VimeoCommand.GetDuration:
        this.pendingDurationCall?.resolve(arg as number);
        break;
      case VimeoCommand.GetVideoTitle:
        this.pendingMediaTitleCall?.resolve(arg as string);
        break;
    }
  }

  private onLoaded() {
    if (this.hasLoaded) return;
    this.pendingPlayRequest = undefined;
    this.internalState = { ...this.defaultInternalState };
    this.dispatch('currentSrc', this.embedSrc);
    this.dispatch('mediaType', MediaType.Video);
    this.remoteControl(VimeoCommand.GetDuration);
    this.remoteControl(VimeoCommand.GetVideoTitle);
    Promise.all([
      this.fetchVideoInfo,
      this.pendingDurationCall?.promise,
      this.pendingMediaTitleCall?.promise,
    ]).then(([info, duration, mediaTitle]) => {
      this.requestTimeUpdates();
      this.dispatch('aspectRatio', `${info?.width ?? 16}:${info?.height ?? 9}`);
      this.dispatch('currentPoster', this.poster ?? info?.poster);
      this.dispatch('duration', duration ?? -1);
      this.dispatch('mediaTitle', mediaTitle);
      this.dispatch('playbackReady', true);
    });
    this.hasLoaded = true;
  }

  private onVimeoEvent<T extends keyof VimeoDataEventPayload>(
    event: T,
    payload: VimeoDataEventPayload[T],
  ) {
    switch (event) {
      case VimeoDataEvent.Ready:
        Object.values(VimeoEvent).forEach(e => {
          this.remoteControl(VimeoCommand.AddEventListener, e);
        });
        break;
      case VimeoDataEvent.Loaded:
        this.onLoaded();
        break;
      case VimeoDataEvent.Play:
        // Incase of autoplay which might skip `Loaded` event.
        this.onLoaded();
        this.internalState.paused = false;
        this.dispatch('paused', false);
        break;
      case VimeoDataEvent.PlayProgress:
        if (!this.internalState.playing) {
          this.dispatch('playing', true);
          this.internalState.playing = true;
          this.internalState.playbackStarted = true;
          this.pendingPlayRequest = window.setTimeout(() => {
            this.internalState.playRequest = false;
            this.pendingPlayRequest = undefined;
          }, 1000);
        }
        this.dispatch('buffering', false);
        this.onSeeked();
        break;
      case VimeoDataEvent.Pause:
        this.internalState.paused = true;
        this.internalState.playing = false;
        this.dispatch('paused', true);
        this.dispatch('buffering', false);
        break;
      case VimeoDataEvent.LoadProgress:
        this.internalState.buffered = payload.seconds;
        this.dispatch('buffered', payload.seconds);
        break;
      case VimeoDataEvent.BufferStart:
        this.dispatch('buffering', true);
        // Attempt to detect `play` events early.
        if (this.internalState.paused) {
          this.internalState.paused = false;
          this.dispatch('paused', false);
          this.dispatch('playbackStarted', true);
        }
        break;
      case VimeoDataEvent.BufferEnd:
        this.dispatch('buffering', false);
        if (this.internalState.paused) this.onSeeked();
        break;
      case VimeoDataEvent.VolumeChange:
        if (payload.volume > 0) {
          const newVolume = Math.floor(payload.volume * 100);
          this.dispatch('muted', false);
          if (this.volume !== newVolume) {
            this.volume = newVolume;
            this.dispatch('volume', this.volume);
          }
        } else {
          this.dispatch('muted', true);
        }
        break;
      case VimeoDataEvent.DurationChange:
        this.dispatch('duration', payload.duration);
        break;
      case VimeoDataEvent.PlaybackRateChange:
        this.dispatch('playbackRate', payload.playbackRate);
        break;
      case VimeoDataEvent.FullscreenChange:
        this.dispatch('isFullscreenActive', payload.fullscreen);
        break;
      case VimeoDataEvent.Finish:
        if (this.loop) {
          this.remoteControl(VimeoCommand.SetCurrentTime, 0);
          setTimeout(() => {
            this.remoteControl(VimeoCommand.Play);
          }, 200);
        } else {
          this.dispatch('playbackEnded', true);
        }
        break;
      case VimeoDataEvent.Error:
        this.vmError.emit(payload);
        break;
    }
  }

  private onEmbedSrcChange() {
    this.hasLoaded = false;
    this.vmLoadStart.emit();
    this.dispatch('viewType', ViewType.Video);
  }

  private onEmbedMessage(event: CustomEvent<VimeoMessage>) {
    const message = event.detail;
    if (!isUndefined(message.event))
      this.onVimeoEvent(message.event!, message.data);
    if (!isUndefined(message.method))
      this.onVimeoMethod(message.method!, message.value);
  }

  private adjustPosition() {
    if (this.controls) {
      return {};
    }

    const [aw, ah] = this.aspectRatio.split(':').map(r => parseInt(r, 10));
    const height = 240;
    const padding = (100 / aw) * ah;
    const offset = (height - padding) / (height / 50);
    return {
      paddingBottom: `${height}%`,
      transform: `translateY(-${offset + 0.02}%)`,
    };
  }

  /** @internal */
  @Method()
  async getAdapter() {
    const canPlayRegex = /vimeo(?:\.com|)\/([0-9]{9,})/;
    const fileRegex = /vimeo\.com\/external\/[0-9]+\..+/;

    return {
      getInternalPlayer: async () => this.embed,
      play: async () => {
        this.remoteControl(VimeoCommand.Play);
      },
      pause: async () => {
        this.remoteControl(VimeoCommand.Pause);
      },
      canPlay: async (type: any) =>
        isString(type) && !fileRegex.test(type) && canPlayRegex.test(type),
      setCurrentTime: async (time: number) => {
        if (time !== this.internalState.currentTime) {
          this.remoteControl(VimeoCommand.SetCurrentTime, time);
        }
      },
      setMuted: async (muted: boolean) => {
        if (!muted) this.volume = this.volume > 0 ? this.volume : 30;
        this.remoteControl(
          VimeoCommand.SetVolume,
          muted ? 0 : this.volume / 100,
        );
      },
      setVolume: async (volume: number) => {
        if (!this.muted) {
          this.remoteControl(VimeoCommand.SetVolume, volume / 100);
        } else {
          // Confirm volume was set.
          this.dispatch('volume', volume);
        }
      },
      // @TODO how to check if Vimeo pro?
      canSetPlaybackRate: async () => false,
      setPlaybackRate: async (rate: number) => {
        this.remoteControl(VimeoCommand.SetPlaybackRate, rate);
      },
    };
  }

  render() {
    return (
      <vm-embed
        class={{ hideControls: !this.controls }}
        style={this.adjustPosition()}
        embedSrc={this.embedSrc}
        mediaTitle={this.mediaTitle}
        origin={this.getOrigin()}
        params={this.buildParams()}
        decoder={decodeJSON}
        preconnections={this.getPreconnections()}
        onVmEmbedMessage={this.onEmbedMessage.bind(this)}
        onVmEmbedSrcChange={this.onEmbedSrcChange.bind(this)}
        ref={(el: any) => {
          this.embed = el;
        }}
      />
    );
  }
}
