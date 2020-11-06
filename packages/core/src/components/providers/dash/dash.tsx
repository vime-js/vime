import {
  h, Method, Component, Prop, Watch, State, Event, EventEmitter, Listen,
} from '@stencil/core';
import { MediaFileProvider, MediaPreloadOption, MediaCrossOriginOption } from '../file/MediaFileProvider';
import { isString, isUndefined } from '../../../utils/unit';
import { dashRegex } from '../file/utils';
import { loadSDK } from '../../../utils/network';
import { MediaType } from '../../core/player/MediaType';
import { withPlayerContext } from '../../core/player/PlayerContext';
import { createProviderDispatcher, ProviderDispatcher } from '../ProviderDispatcher';

@Component({
  tag: 'vime-dash',
})
export class Dash implements MediaFileProvider<any> {
  private dash?: any;

  private dispatch!: ProviderDispatcher;

  private mediaEl?: HTMLVideoElement;

  private videoProvider!: HTMLVimeVideoElement;

  @State() hasAttached = false;

  /**
   * The URL of the `manifest.mpd` file to use.
   */
  @Prop() src!: string;

  @Watch('src')
  @Watch('hasAttached')
  onSrcChange() {
    if (!this.hasAttached) return;
    this.vLoadStart.emit();
    this.dash!.attachSource(this.src);
  }

  /**
   * The NPM package version of the `dashjs` library to download and use.
   */
  @Prop() version = 'latest';

  /**
   * The `dashjs` configuration.
   */
  @Prop({ attribute: 'config' }) config: Record<string, any> = {};

  /**
   * @internal
   */
  @Prop() autoplay!: boolean;

  /**
   * @inheritdoc
   */
  @Prop() crossOrigin?: MediaCrossOriginOption;

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

  constructor() {
    withPlayerContext(this, ['autoplay']);
  }

  connectedCallback() {
    this.dispatch = createProviderDispatcher(this);
    if (this.mediaEl) this.setupDash();
  }

  disconnectedCallback() {
    this.destroyDash();
  }

  private async setupDash() {
    try {
      const url = `https://cdn.jsdelivr.net/npm/dashjs@${this.version}/dist/dash.all.min.js`;
      // eslint-disable-next-line no-shadow
      const DashSDK = await loadSDK(url, 'dashjs');

      this.dash = DashSDK.MediaPlayer(this.config).create();
      this.dash!.initialize(this.mediaEl, null, this.autoplay);

      this.dash!.on(DashSDK.MediaPlayer.events.CAN_PLAY, () => {
        this.dispatch('mediaType', MediaType.Video);
        this.dispatch('currentSrc', this.src);
        this.dispatch('playbackReady', true);
      });

      this.dash!.on(DashSDK.MediaPlayer.events.ERROR, (e: any) => {
        this.dispatch('errors', [e]);
      });

      this.hasAttached = true;
    } catch (e) {
      this.dispatch('errors', [e]);
    }
  }

  private async destroyDash() {
    this.dash?.reset();
    this.hasAttached = false;
  }

  @Listen('vMediaElChange')
  async onMediaElChange(event: CustomEvent<HTMLVideoElement | undefined>) {
    this.destroyDash();
    if (isUndefined(event.detail)) return;
    this.mediaEl = event.detail;
    await this.setupDash();
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
      getInternalPlayer: async () => this.dash,
      canPlay: async (type: any) => (isString(type) && dashRegex.test(type))
        || canVideoProviderPlay(type),
    };
  }

  render() {
    return (
      <vime-video
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
      />
    );
  }
}
