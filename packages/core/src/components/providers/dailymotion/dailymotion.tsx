import {
  h, Prop, Method, Component, Event, EventEmitter, State, Watch,
} from '@stencil/core';
import { MediaProvider, withProviderConnect, withProviderContext } from '../MediaProvider';
import { decodeQueryString } from '../../../utils/network';
import { isString } from '../../../utils/unit';
import { ViewType } from '../../core/player/ViewType';
import { DailymotionParams } from './DailymotionParams';
import { DailymotionCommand, DailymotionCommandArg } from './DailymotionCommand';
import { DailymotionMessage } from './DailymotionMessage';
import { DeferredPromise, deferredPromise } from '../../../utils/promise';
import { DailymotionEvent } from './DailymotionEvent';
import { MediaType } from '../../core/player/MediaType';
import { createProviderDispatcher, ProviderDispatcher } from '../ProviderDispatcher';
import { Logger } from '../../core/player/PlayerLogger';

@Component({
  tag: 'vime-dailymotion',
})
export class Dailymotion implements MediaProvider<HTMLVimeEmbedElement> {
  private embed!: HTMLVimeEmbedElement;

  private dispatch!: ProviderDispatcher;

  private initialMuted!: boolean;

  private defaultInternalState: any = {};

  private pendingVideoInfoFetch?: Promise<void>;

  private pendingMediaTitleFetch?: DeferredPromise<void>;

  private internalState = {
    currentTime: 0,
    volume: 0,
    muted: false,
    isAdsPlaying: false,
    playbackReady: false,
  };

  @State() embedSrc = '';

  @State() mediaTitle = '';

  /**
   * The Dailymotion resource ID of the video to load.
   */
  @Prop() videoId!: string;

  @Watch('videoId')
  onVideoIdChange() {
    this.embedSrc = `${this.getOrigin()}/embed/video/${this.videoId}?api=1`;
    this.internalState = { ...this.defaultInternalState };
    this.pendingVideoInfoFetch = this.fetchVideoInfo();
    this.pendingMediaTitleFetch = deferredPromise();
  }

  /**
   * Whether to automatically play the next video in the queue.
   */
  @Prop() shouldAutoplayQueue = false;

  /**
   * Whether to show the 'Up Next' queue.
   */
  @Prop() showUpNextQueue = false;

  /**
   * Whether to show buttons for sharing the video.
   */
  @Prop() showShareButtons = false;

  /**
   * Change the default highlight color used in the controls (hex value without the leading #).
   * Color set in the Partner HQ will override this prop.
   */
  @Prop() color?: string;

  /**
   * Forwards your syndication key to the player.
   */
  @Prop() syndication?: string;

  /**
   * Whether to display the Dailymotion logo.
   */
  @Prop() showDailymotionLogo = false;

  /**
   * Whether to show video information (title and owner) on the start screen.
   */
  @Prop() showVideoInfo = true;

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

  @Watch('controls')
  onControlsChange() {
    if (this.internalState.playbackReady) {
      this.remoteControl(DailymotionCommand.Controls, this.controls);
    }
  }

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
    this.internalState.muted = this.muted;
    this.defaultInternalState = { ...this.internalState };
  }

  disconnectedCallback() {
    this.pendingVideoInfoFetch = undefined;
    this.pendingMediaTitleFetch = undefined;
  }

  private getOrigin() {
    return 'https://www.dailymotion.com';
  }

  private getPreconnections() {
    return [
      this.getOrigin(),
      'https://static1.dmcdn.net',
    ];
  }

  private remoteControl<T extends DailymotionCommand>(command: T, arg?: DailymotionCommandArg[T]) {
    return this.embed.postMessage({
      command,
      parameters: arg ? [arg] : [],
    });
  }

  private buildParams(): DailymotionParams {
    return {
      autoplay: this.autoplay,
      mute: this.initialMuted,
      'queue-autoplay-next': this.shouldAutoplayQueue,
      'queue-enable': this.showUpNextQueue,
      'sharing-enable': this.showShareButtons,
      syndication: this.syndication,
      'ui-highlight': this.color,
      'ui-logo': this.showDailymotionLogo,
      'ui-start-screen-info': this.showVideoInfo,
    };
  }

  private fetchVideoInfo() {
    const apiEndpoint = 'https://api.dailymotion.com';
    return window
      .fetch(`${apiEndpoint}/video/${this.videoId}?fields=duration,thumbnail_1080_url`)
      .then((response) => response.json())
      .then((data) => {
        this.dispatch('currentPoster', data.thumbnail_1080_url);
        this.dispatch('duration', parseFloat(data.duration));
      });
  }

  private onEmbedSrcChange() {
    this.vLoadStart.emit();
  }

  private onEmbedMessage(event: CustomEvent<DailymotionMessage>) {
    const msg = event.detail;
    switch (msg.event) {
      case DailymotionEvent.PlaybackReady:
        this.onControlsChange();
        this.dispatch('currentSrc', this.embedSrc);
        this.dispatch('mediaType', MediaType.Video);
        Promise.all([
          this.pendingVideoInfoFetch,
          this.pendingMediaTitleFetch?.promise,
        ]).then(() => {
          this.dispatch('playbackReady', true);
        });
        break;
      case DailymotionEvent.VideoChange:
        this.dispatch('mediaTitle', msg.title!);
        this.pendingMediaTitleFetch?.resolve();
        break;
      case DailymotionEvent.Start:
        this.dispatch('paused', false);
        this.dispatch('playbackStarted', true);
        this.dispatch('buffering', true);
        break;
      case DailymotionEvent.VideoStart:
        // Commands don't go through until ads have finished, so we store them and then replay them
        // once the video starts.
        this.remoteControl(DailymotionCommand.Muted, this.internalState.muted);
        this.remoteControl(DailymotionCommand.Volume, this.internalState.volume);
        if (this.internalState.currentTime > 0) {
          this.remoteControl(DailymotionCommand.Seek, this.internalState.currentTime);
        }
        break;
      case DailymotionEvent.Play:
        this.dispatch('paused', false);
        break;
      case DailymotionEvent.Pause:
        this.dispatch('paused', true);
        this.dispatch('playing', false);
        this.dispatch('buffering', false);
        break;
      case DailymotionEvent.Playing:
        this.dispatch('playing', true);
        this.dispatch('buffering', false);
        break;
      case DailymotionEvent.VideoEnd:
        if (this.loop) {
          setTimeout(() => { this.remoteControl(DailymotionCommand.Play); }, 300);
        } else {
          this.dispatch('playbackEnded', true);
        }
        break;
      case DailymotionEvent.TimeUpdate:
        this.dispatch('currentTime', parseFloat(msg.time!));
        break;
      case DailymotionEvent.VolumeChange:
        this.dispatch('muted', msg.muted === 'true');
        this.dispatch('volume', Math.floor(parseFloat(msg.volume!) * 100));
        break;
      case DailymotionEvent.Seeking:
        this.dispatch('currentTime', parseFloat(msg.time!));
        this.dispatch('seeking', true);
        break;
      case DailymotionEvent.Seeked:
        this.dispatch('currentTime', parseFloat(msg.time!));
        this.dispatch('seeking', false);
        break;
      case DailymotionEvent.Waiting:
        this.dispatch('buffering', true);
        break;
      case DailymotionEvent.Progress:
        this.dispatch('buffered', parseFloat(msg.time!));
        break;
      case DailymotionEvent.DurationChange:
        this.dispatch('duration', parseFloat(msg.duration!));
        break;
      case DailymotionEvent.QualitiesAvailable:
        this.dispatch('playbackQualities', msg.qualities!.map((q: string) => `${q}p`));
        break;
      case DailymotionEvent.QualityChange:
        this.dispatch('playbackQuality', `${msg.quality}p`);
        break;
      case DailymotionEvent.FullscreenChange:
        this.dispatch('isFullscreenActive', msg.fullscreen === 'true');
        break;
      case DailymotionEvent.Error:
        this.dispatch('errors', [new Error(msg.error!)]);
        break;
    }
  }

  /**
   * @internal
   */
  @Method()
  async getAdapter() {
    const canPlayRegex = /(?:dai\.ly|dailymotion|dailymotion\.com)\/(?:video\/|embed\/|)(?:video\/|)((?:\w)+)/;

    return {
      getInternalPlayer: async () => this.embed,
      play: async () => { this.remoteControl(DailymotionCommand.Play); },
      pause: async () => { this.remoteControl(DailymotionCommand.Pause); },
      canPlay: async (type: any) => isString(type) && canPlayRegex.test(type),
      setCurrentTime: async (time: number) => {
        this.internalState.currentTime = time;
        this.remoteControl(DailymotionCommand.Seek, time);
      },
      setMuted: async (muted: boolean) => {
        this.internalState.muted = muted;
        this.remoteControl(DailymotionCommand.Muted, muted);
      },
      setVolume: async (volume: number) => {
        this.internalState.volume = (volume / 100);
        this.dispatch('volume', volume);
        this.remoteControl(DailymotionCommand.Volume, (volume / 100));
      },
      canSetPlaybackQuality: async () => true,
      setPlaybackQuality: async (quality: string) => {
        this.remoteControl(DailymotionCommand.Quality, quality.slice(0, -1));
      },
      canSetFullscreen: async () => true,
      enterFullscreen: async () => { this.remoteControl(DailymotionCommand.Fullscreen, true); },
      exitFullscreen: async () => { this.remoteControl(DailymotionCommand.Fullscreen, false); },
    };
  }

  render() {
    return (
      <vime-embed
        embedSrc={this.embedSrc}
        mediaTitle={this.mediaTitle}
        origin={this.getOrigin()}
        params={this.buildParams()}
        decoder={decodeQueryString}
        preconnections={this.getPreconnections()}
        onVEmbedMessage={this.onEmbedMessage.bind(this)}
        onVEmbedSrcChange={this.onEmbedSrcChange.bind(this)}
        ref={(el: any) => { this.embed = el; }}
      />
    );
  }
}
