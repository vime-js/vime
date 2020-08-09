import {
  h, Method, Component, Prop, State, Event, EventEmitter,
} from '@stencil/core';
import { MediaFileProvider, MediaPreloadOption } from '../file/MediaFileProvider';
import { isString, isUndefined } from '../../../utils/unit';
import { loadSDK } from '../../../utils/network';
import { PlayerProp } from '../../core/player/PlayerProp';
import { PlayerStateDispatcher, createPlayerStateDispatcher } from '../../core/player/PlayerState';
import { canPlayHLSNatively } from '../../../utils/support';
import { hlsRegex, hlsTypeRegex } from '../file/utils';
import { MediaType } from '../../core/player/MediaType';

/**
 * @slot - Pass `<source>` and  `<track>` elements to the underlying HTML5 media player.
 */
@Component({
  tag: 'vime-hls',
})
export class HLS implements MediaFileProvider<Hls | undefined> {
  private hls?: Hls;

  private dispatch!: PlayerStateDispatcher;

  private videoProvider!: HTMLVimeVideoElement;

  @State() hasAttached = false;

  /**
   * The NPM package version of the `hls.js` library to download and use if HLS is not natively
   * supported.
   */
  @Prop() version = 'latest';

  /**
   * The `hls.js` configuration.
   */
  @Prop({ attribute: 'config' }) config?: Hls.Config;

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
   * The title of the current media.
   */
  @Prop() mediaTitle?: string;

  /**
   * @internal
   */
  @Event() vLoadStart!: EventEmitter<void>;

  connectedCallback() {
    this.dispatch = createPlayerStateDispatcher(this);
  }

  async componentDidLoad() {
    if (canPlayHLSNatively()) return;

    try {
      const url = `https://cdn.jsdelivr.net/npm/hls.js@${this.version}`;
      const Hls = await loadSDK<Hls>(url, 'Hls');
      const video = this.videoProvider.querySelector('video')!;

      if (!Hls.isSupported()) {
        this.dispatch(PlayerProp.Errors, [new Error('hls.js is not supported')]);
        return;
      }

      this.hls = new Hls(this.config);

      this.hls!.on('hlsMediaAttached', () => {
        this.hasAttached = true;
        this.onSrcChange();
      });

      this.hls!.on('hlsError', (e, data) => { this.dispatch(PlayerProp.Errors, [{ e, data }]); });

      this.hls!.on('hlsManifestParsed', () => {
        this.dispatch(PlayerProp.MediaType, MediaType.Video);
        this.dispatch(PlayerProp.CurrentSrc, this.src);
        this.dispatch(PlayerProp.PlaybackReady, true);
      });

      this.hls!.attachMedia(video);
    } catch (e) {
      this.dispatch(PlayerProp.Errors, [e]);
    }
  }

  componentWillRender() {
    this.onSrcChange();
  }

  disconnectedCallback() {
    this.hls?.destroy();
    this.hls = undefined;
    this.hasAttached = false;
    this.prevSrc = undefined;
  }

  get src(): string | undefined {
    if (isUndefined(this.videoProvider)) return undefined;
    const sources = this.videoProvider.querySelectorAll('source');
    const currSource = Array.from(sources)
      .find((source) => hlsRegex.test(source.src) || hlsTypeRegex.test(source.type));
    return currSource?.src;
  }

  private prevSrc?: string;

  private onSrcChange() {
    if (canPlayHLSNatively()) return;
    if ((this.src !== this.prevSrc) && this.hasAttached) {
      this.vLoadStart.emit();
      if (!isUndefined(this.src)) this.hls!.loadSource(this.src!);
      this.prevSrc = this.src;
    }
  }

  /**
   * @internal
   */
  @Method()
  async getAdapter() {
    const adapter = await this.videoProvider.getAdapter();
    const canVideoProviderPlay = adapter.canPlay;
    return {
      ...adapter,
      getInternalPlayer: async () => this.hls,
      canPlay: async (type: any) => (isString(type) && hlsRegex.test(type))
        || canVideoProviderPlay(type),
    };
  }

  render() {
    return (
      <vime-video
        willAttach={!canPlayHLSNatively()}
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
      </vime-video>
    );
  }
}
