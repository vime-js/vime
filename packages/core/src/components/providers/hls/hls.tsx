import {
  h, Method, Component, Prop, State, Event, EventEmitter, Listen,
} from '@stencil/core';
import { MediaFileProvider, MediaPreloadOption, MediaCrossOriginOption } from '../file/MediaFileProvider';
import {
  isNullOrUndefined, isString, isUndefined,
} from '../../../utils/unit';
import { loadSDK } from '../../../utils/network';
import { hlsRegex, hlsTypeRegex } from '../file/utils';
import { MediaType } from '../../core/player/MediaType';
import { createProviderDispatcher, ProviderDispatcher } from '../ProviderDispatcher';
import { withProviderConnect } from '../ProviderConnect';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withPlayerContext } from '../../core/player/withPlayerContext';

/**
 * @slot - Pass `<source>` elements to the underlying HTML5 media player.
 */
@Component({
  tag: 'vm-hls',
})
export class HLS implements MediaFileProvider {
  private hls?: any;

  private videoProvider!: HTMLVmVideoElement;

  private mediaEl?: HTMLVideoElement;

  private dispatch!: ProviderDispatcher;

  @State() hasAttached = false;

  /**
   * The NPM package version of the `hls.js` library to download and use if HLS is not natively
   * supported.
   */
  @Prop() version = 'latest';

  /**
   * The URL where the `hls.js` library source can be found. If this property is used, then the
   * `version` property is ignored.
   */
  @Prop() libSrc?: string;

  /**
   * The `hls.js` configuration.
   */
  @Prop({ attribute: 'config' }) config?: any;

  /** @inheritdoc */
  @Prop() crossOrigin?: MediaCrossOriginOption;

  /** @inheritdoc */
  @Prop() preload?: MediaPreloadOption = 'metadata';

  /** @inheritdoc */
  @Prop() poster?: string;

  /** @inheritdoc */
  @Prop() controlsList?: string;

  /** @inheritdoc */
  @Prop({ attribute: 'auto-pip' }) autoPiP?: boolean;

  /** @inheritdoc */
  @Prop({ attribute: 'disable-pip' }) disablePiP?: boolean;

  /** @inheritdoc */
  @Prop() disableRemotePlayback?: boolean;

  /** @internal */
  @Prop() playbackReady = false;

  /**
   * The title of the current media.
   */
  @Prop() mediaTitle?: string;

  /** @internal */
  @Event() vmLoadStart!: EventEmitter<void>;

  /**
   * Emitted when an error has occurred.
   */
  @Event() vmError!: EventEmitter<any>;

  constructor() {
    withComponentRegistry(this);
    withProviderConnect(this);
    withPlayerContext(this, ['playbackReady']);
  }

  connectedCallback() {
    this.dispatch = createProviderDispatcher(this);
    if (this.mediaEl) this.setupHls();
  }

  disconnectedCallback() {
    this.destroyHls();
  }

  get src(): string | undefined {
    if (isNullOrUndefined(this.videoProvider)) return undefined;
    const sources = this.videoProvider.querySelectorAll('source');
    const currSource = Array.from(sources)
      .find((source) => hlsRegex.test(source.src) || hlsTypeRegex.test(source.type));
    return currSource?.src;
  }

  private async setupHls() {
    if (!isUndefined(this.hls)) return;

    try {
      const url = this.libSrc || `https://cdn.jsdelivr.net/npm/hls.js@${this.version}/dist/hls.min.js`;
      const Hls = await loadSDK(url, 'Hls');

      if (!Hls.isSupported()) {
        this.vmError.emit('hls.js is not supported');
        return;
      }

      this.hls = new Hls(this.config);

      this.hls!.on(Hls.Events.MEDIA_ATTACHED, () => {
        this.hasAttached = true;
        this.onSrcChange();
      });

      this.hls!.on(Hls.Events.AUDIO_TRACKS_UPDATED, () => {
        this.dispatch('audioTracks', this.hls.audioTracks);
        this.dispatch('currentAudioTrack', this.hls.audioTrack);
      });

      this.hls!.on(Hls.Events.AUDIO_TRACK_SWITCHED, () => {
        this.dispatch('currentAudioTrack', this.hls.audioTrack);
      });

      this.hls!.on(Hls.Events.ERROR, (event: any, data: any) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              this.hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              this.hls.recoverMediaError();
              break;
            default:
              this.destroyHls();
              break;
          }
        }

        this.vmError.emit({ event, data });
      });

      this.hls!.on(Hls.Events.MANIFEST_PARSED, () => {
        this.dispatch('mediaType', MediaType.Video);
        this.dispatch('currentSrc', this.src);
        this.dispatchLevels();
      });

      this.hls!.on(Hls.Events.LEVEL_LOADED, (_: any, data: any) => {
        if (!this.playbackReady) {
          this.dispatch('duration', data.details.totalduration);
          this.dispatch('playbackReady', true);
        }
      });

      this.hls!.attachMedia(this.mediaEl);
    } catch (e) {
      this.vmError.emit(e);
    }
  }

  private dispatchLevels() {
    if (!this.hls.levels || this.hls.levels.length === 0) return;

    this.dispatch('playbackQualities', [
      'Auto',
      ...this.hls.levels.map(this.levelToPlaybackQuality),
    ]);

    this.dispatch('playbackQuality', 'Auto');
  }

  private levelToPlaybackQuality(level: any) {
    return (level === -1) ? 'Auto' : `${level.height}p`;
  }

  private findLevelIndexFromQuality(quality: PlayerProps['playbackQuality']) {
    return this.hls.levels
      .findIndex((level: any) => this.levelToPlaybackQuality(level) === quality);
  }

  private destroyHls() {
    this.hls?.destroy();
    this.hasAttached = false;
  }

  @Listen('vmMediaElChange')
  async onMediaElChange(event: CustomEvent<HTMLVideoElement | undefined>) {
    this.destroyHls();
    if (isUndefined(event.detail)) return;
    this.mediaEl = event.detail;
    // Need a small delay incase the media element changes rapidly and Hls.js can't reattach.
    setTimeout(async () => { await this.setupHls(); }, 50);
  }

  @Listen('vmSrcSetChange')
  private async onSrcChange() {
    if (this.hasAttached && this.hls.url !== this.src) {
      this.vmLoadStart.emit();
      this.hls!.loadSource(this.src);
    }
  }

  /** @internal */
  @Method()
  async getAdapter() {
    const adapter = (await this.videoProvider?.getAdapter()) ?? {};
    const canVideoProviderPlay = adapter.canPlay;
    return {
      ...adapter,
      getInternalPlayer: async () => this.hls,
      canPlay: async (type: any) => (isString(type) && hlsRegex.test(type))
        || (canVideoProviderPlay?.(type) ?? false),
      canSetPlaybackQuality: async () => this.hls?.levels?.length > 0,
      setPlaybackQuality: async (quality: string) => {
        if (!isUndefined(this.hls)) {
          this.hls.currentLevel = this.findLevelIndexFromQuality(quality);
          // Update the provider cache.
          this.dispatch('playbackQuality', quality);
        }
      },
      setCurrentAudioTrack: async (trackId: number) => {
        if (!isUndefined(this.hls)) {
          this.hls.audioTrack = trackId;
        }
      },
    };
  }

  render() {
    return (
      <vm-video
        willAttach
        crossOrigin={this.crossOrigin}
        preload={this.preload}
        poster={this.poster}
        controlsList={this.controlsList}
        autoPiP={this.autoPiP}
        disablePiP={this.disablePiP}
        disableRemotePlayback={this.disableRemotePlayback}
        mediaTitle={this.mediaTitle}
        ref={(el: any) => { this.videoProvider = el; }}
      >
        <slot />
      </vm-video>
    );
  }
}
