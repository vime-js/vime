import {
  h, Method, Component, Prop, Watch, State, Event, EventEmitter,
} from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { MediaFileProvider, MediaPreloadOption, MediaCrossOriginOption } from '../file/MediaFileProvider';
import { isString } from '../../../utils/unit';
import { PlayerStateDispatcher, createPlayerStateDispatcher } from '../../core/player/PlayerState';
import { dashRegex } from '../file/utils';
import { PlayerProp } from '../../core/player/PlayerProp';
import { loadSDK } from '../../../utils/network';
import { MediaType } from '../../core/player/MediaType';

@Component({
  tag: 'vime-dash',
})
export class Dash implements MediaFileProvider<any> {
  private dash?: any;

  private dispatch!: PlayerStateDispatcher;

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

  componentWillLoad() {
    this.dispatch = createPlayerStateDispatcher(this);
  }

  async componentDidLoad() {
    try {
      const url = `https://cdn.jsdelivr.net/npm/dashjs@${this.version}/dist/dash.all.min.js`;
      // eslint-disable-next-line no-shadow
      const Dash = await loadSDK(url, 'dashjs');
      const video = this.videoProvider.querySelector('video')!;

      this.dash = Dash.MediaPlayer(this.config).create();
      this.dash!.initialize(video, null, this.autoplay);

      this.dash!.on(Dash.MediaPlayer.events.CAN_PLAY, () => {
        this.dispatch(PlayerProp.MediaType, MediaType.Video);
        this.dispatch(PlayerProp.CurrentSrc, this.src);
        this.dispatch(PlayerProp.PlaybackReady, true);
      });

      this.dash!.on(Dash.MediaPlayer.events.ERROR, (e: any) => {
        this.dispatch(PlayerProp.Errors, [e]);
      });

      this.hasAttached = true;
    } catch (e) {
      this.dispatch(PlayerProp.Errors, [e]);
    }
  }

  disconnectedCallback() {
    this.dash?.reset();
    this.dash = undefined;
    this.hasAttached = false;
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

openWormhole(Dash, [
  PlayerProp.Autoplay,
]);
