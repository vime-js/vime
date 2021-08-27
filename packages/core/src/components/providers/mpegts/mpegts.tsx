import {
  Component,
  Event,
  EventEmitter,
  h,
  Listen,
  Method,
  Prop,
  State,
} from '@stencil/core';

import { loadSDK } from '../../../utils/network';
import { isUndefined } from '../../../utils/unit';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import {
  MediaCrossOriginOption,
  MediaFileProvider,
  MediaPreloadOption,
} from '../file/MediaFileProvider';
import { withProviderConnect } from '../ProviderConnect';
import { createProviderDispatcher, ProviderDispatcher } from '../ProviderDispatcher';

/**
 * Enables loading, playing and controlling mpegts, m2ts or flv based media.
 *
 * > You don't interact with this component for passing player properties, controlling playback,
 * listening to player events and so on, that is all done through the `vime-player` component.
 */
@Component({
  tag: 'vm-mpegts',
})
export class MPEGTS implements MediaFileProvider {
  private mpegtsPlayer?: any;

  private videoProvider!: HTMLVmVideoElement;

  private mediaEl?: HTMLVideoElement;

  private dispatch!: ProviderDispatcher;

  @State() hasAttached = false;

  /**
   * The NPM package version of the `mpegts.js` library to download
   * supported.
   */
  @Prop() version = 'latest';

  /**
   * The URL where the `mpegts.js` library source can be found. If this property is used, then the
   * `version` property is ignored.
   */
  @Prop() libSrc?: string;

  /**
   * Indicates media URL, can be starts with 'https(s)' or 'ws(s)' (WebSocket)
   */
  @Prop({ attribute: 'src' }) src?: string;

  /**
  * Indicates whether the data source is a live stream
  */
  @Prop({ attribute: 'isLive' }) isLive?: boolean;

  /**
   * Indicates media type, 'mse', 'mpegts', 'm2ts', 'flv' or 'mp4'
   */
  @Prop({ attribute: 'type' }) type?: string;

  /**
   * The `mpegts.js` mediaDataSource configuration.
   */
  @Prop({ attribute: 'config' }) config?: any;

  /**
   * The `mpegts.js` optional configuration.
   */
  @Prop({ attribute: 'optional-config' }) optionalConfig?: any;


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
    if (this.mediaEl) this.setupMpegts();
  }

  disconnectedCallback() {
    this.destroyMpegts();
  }

  private async setupMpegts() {
    if (!isUndefined(this.mpegtsPlayer)) return;

    try {
      const url =
        this.libSrc ||
        `https://cdn.jsdelivr.net/npm/mpegts.js@${this.version}/dist/mpegts.js`;

      const Mpegts = (await loadSDK(url, 'mpegts')) as any;

      if (!Mpegts.getFeatureList().mseLivePlayback) {
        this.vmError.emit('mpegts.js is not supported');
        return;
      }

      this.config = this.config || {}
      this.optionalConfig = this.optionalConfig || {}

      this.config.url = this.src;
      this.config.isLive = this.isLive;
      this.config.type = this.type;


      this.mpegtsPlayer = new Mpegts.createPlayer(this.config, this.optionalConfig);

      this.mpegtsPlayer.on(Mpegts.Events.MEDIA_INFO, (event: any) => {
        if (!this.playbackReady) {
          if(event.duration) {
            this.dispatch('duration', event.duration);
          }
          this.dispatch('playbackReady', true);
        }
        this.hasAttached = true;
      });

      this.mpegtsPlayer.on(Mpegts.Events.ERROR, (event: any, data: any) => {
        this.vmError.emit({ event, data });
      });
      this.mpegtsPlayer.attachMediaElement(this.mediaEl);
      this.mpegtsPlayer.load();
    } catch (e) {
      this.vmError.emit(e);
    }
  }

  private destroyMpegts() {
    if (this.mpegtsPlayer) {
      this.mpegtsPlayer.detachMediaElement();
      this.mpegtsPlayer.destroy();
    }
    this.hasAttached = false;
  }

  @Listen('vmMediaElChange')
  async onMediaElChange(event: CustomEvent<HTMLVideoElement | undefined>) {
    this.destroyMpegts();
    if (isUndefined(event.detail)) return;
    this.mediaEl = event.detail;
    // Need a small delay incase the media element changes rapidly and mpegts.js can't reattach.
    setTimeout(async () => {
      await this.setupMpegts();
    }, 50);
  }

  /** @internal */
  @Method()
  async getAdapter() {
    const adapter = (await this.videoProvider?.getAdapter()) ?? {};
    return {
      ...adapter,
      getInternalPlayer: async () => this.mpegtsPlayer,
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
        ref={(el: any) => {
          this.videoProvider = el;
        }}
      ></vm-video>
    );
  }
}
