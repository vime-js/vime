import {
  h, Method, Component, Prop, Watch, State, Event, EventEmitter, Listen,
} from '@stencil/core';
import { MediaFileProvider, MediaPreloadOption, MediaCrossOriginOption } from '../file/MediaFileProvider';
import { isString, isUndefined } from '../../../utils/unit';
import { dashRegex } from '../file/utils';
import { loadSDK } from '../../../utils/network';
import { MediaType } from '../../core/player/MediaType';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import { createProviderDispatcher, ProviderDispatcher } from '../ProviderDispatcher';
import { withProviderConnect } from '../ProviderConnect';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { PlayerProps } from '../../core/player/PlayerProps';
import { Disposal } from '../../../utils/Disposal';
import { listen } from '../../../utils/dom';

@Component({
  tag: 'vm-dash',
  styleUrl: 'dash.css',
  shadow: true,
})
export class Dash implements MediaFileProvider<any> {
  private dash?: any;

  private dispatch!: ProviderDispatcher;

  private mediaEl?: HTMLVideoElement;

  private videoProvider!: HTMLVmVideoElement;

  private textTracksDisposal = new Disposal();

  @State() hasAttached = false;

  /**
   * The URL of the `manifest.mpd` file to use.
   */
  @Prop() src!: string;

  @Watch('src')
  @Watch('hasAttached')
  onSrcChange() {
    if (!this.hasAttached) return;
    this.vmLoadStart.emit();
    this.dash!.attachSource(this.src);
  }

  /**
   * The NPM package version of the `dashjs` library to download and use.
   */
  @Prop() version = 'latest';

    /**
   * The URL where the `dashjs` library source can be found. If this property is used, then the
   * `version` property is ignored.
   */
  @Prop() libSrc?: string;

  /**
   * The `dashjs` configuration.
   */
  @Prop({ attribute: 'config' }) config: Record<string, any> = {};

  /** @internal */
  @Prop() autoplay = false;

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

  /**
   * The title of the current media.
   */
  @Prop() mediaTitle?: string;

  /**
   * Are text tracks enabled by default.
   */
  @Prop() enableTextTracksByDefault = true;

  /** @internal */
  @Prop() shouldRenderNativeTextTracks = true;

  @Watch('shouldRenderNativeTextTracks')
  onShouldRenderNativeTextTracks() {
    if (this.shouldRenderNativeTextTracks) {
      this.textTracksDisposal.empty();
    } else {
      this.hideCurrentTextTrack();
    }

    this.dash?.enableForcedTextStreaming(!this.shouldRenderNativeTextTracks);
  }

  /** @internal */
  @Prop() isTextTrackVisible = true;

  /** @internal */
  @Prop() currentTextTrack = -1;

  @Watch('isTextTrackVisible')
  @Watch('currentTextTrack')
  onTextTrackChange() {
    if (!this.shouldRenderNativeTextTracks || isUndefined(this.dash)) return;

    this.dash.setTextTrack(!this.isTextTrackVisible ? -1 : this.currentTextTrack);

    if (!this.isTextTrackVisible) {
      const track = Array.from(this.mediaEl?.textTracks ?? [])[this.currentTextTrack];
      if (track?.mode === 'hidden') this.dispatch('currentTextTrack', -1);
    }
  }

  /** @internal */
  @Event() vmLoadStart!: EventEmitter<void>;

  /**
   * Emitted when an error has occurred.
   */
  @Event() vmError!: EventEmitter<any>;

  constructor() {
    withComponentRegistry(this);
    withProviderConnect(this);
    withPlayerContext(this, [
      'autoplay',
      'shouldRenderNativeTextTracks',
      'isTextTrackVisible',
      'currentTextTrack',
    ]);
  }

  connectedCallback() {
    this.dispatch = createProviderDispatcher(this);
    if (this.mediaEl) this.setupDash();
  }

  disconnectedCallback() {
    this.textTracksDisposal.empty();
    this.destroyDash();
  }

  private async setupDash() {
    try {
      const url = this.libSrc || `https://cdn.jsdelivr.net/npm/dashjs@${this.version}/dist/dash.all.min.js`;
      // eslint-disable-next-line no-shadow
      const DashSDK = await loadSDK(url, 'dashjs');

      this.dash = DashSDK.MediaPlayer(this.config).create();
      this.dash!.initialize(this.mediaEl, null, this.autoplay);
      this.dash!.setTextDefaultEnabled(this.enableTextTracksByDefault);
      this.dash!.enableForcedTextStreaming(!this.shouldRenderNativeTextTracks);

      this.dash!.on(DashSDK.MediaPlayer.events.PLAYBACK_METADATA_LOADED, () => {
        this.dispatch('mediaType', MediaType.Video);
        this.dispatch('currentSrc', this.src);
        this.dispatchLevels();
        this.listenToTextTracksForChanges();
        this.dispatch('playbackReady', true);
      });

      this.dash!.on(DashSDK.MediaPlayer.events.TRACK_CHANGE_RENDERED, () => {
        if (!this.shouldRenderNativeTextTracks) this.hideCurrentTextTrack();
      });

      this.dash!.on(DashSDK.MediaPlayer.events.ERROR, (e: any) => {
        this.vmError.emit(e);
      });

      this.hasAttached = true;
    } catch (e) {
      this.vmError.emit(e);
    }
  }

  private async destroyDash() {
    this.dash?.reset();
    this.hasAttached = false;
  }

  @Listen('vmMediaElChange')
  async onMediaElChange(event: CustomEvent<HTMLVideoElement | undefined>) {
    this.destroyDash();
    if (isUndefined(event.detail)) return;
    this.mediaEl = event.detail;
    await this.setupDash();
  }

  private levelToPlaybackQuality(level: any) {
    return (level === -1) ? 'Auto' : `${level.height}p`;
  }

  private findLevelIndexFromQuality(quality: PlayerProps['playbackQuality']) {
    return this.dash
      .getBitrateInfoListFor('video')
      .findIndex((level: any) => this.levelToPlaybackQuality(level) === quality);
  }

  private dispatchLevels() {
    try {
      const levels = this.dash.getBitrateInfoListFor('video');

      if (levels?.length > 0) {
        this.dispatch('playbackQualities', [
          'Auto',
          ...levels.map(this.levelToPlaybackQuality),
        ]);

        this.dispatch('playbackQuality', 'Auto');
      }
    } catch (e) {
      this.vmError.emit(e);
    }
  }

  private listenToTextTracksForChanges() {
    this.textTracksDisposal.empty();
    if (isUndefined(this.mediaEl) || this.shouldRenderNativeTextTracks) return;

    // Init current track.
    const currentTrack = (this.dash?.getCurrentTrackFor('text')?.index - 1) ?? -1;
    this.currentTextTrack = currentTrack;
    this.dispatch('currentTextTrack', currentTrack);

    this.textTracksDisposal.add(
      listen(this.mediaEl.textTracks, 'change', this.onTextTracksChange.bind(this)),
    );
  }

  private getTextTracks() {
    return Array.from(this.mediaEl?.textTracks ?? []);
  }

  private hideCurrentTextTrack() {
    const textTracks = this.getTextTracks();
    if (textTracks[this.currentTextTrack] && this.isTextTrackVisible) {
      textTracks[this.currentTextTrack].mode = 'hidden';
    }
  }

  private onTextTracksChange() {
    this.hideCurrentTextTrack();
    this.dispatch('textTracks', this.getTextTracks());
    this.dispatch('isTextTrackVisible', this.isTextTrackVisible);
    this.dispatch('currentTextTrack', this.currentTextTrack);
  }

  /** @internal */
  @Method()
  async getAdapter() {
    const adapter = (await this.videoProvider?.getAdapter()) ?? {};
    const canVideoProviderPlay = adapter.canPlay;
    return {
      ...adapter,
      getInternalPlayer: async () => this.dash,
      canPlay: async (type: any) => (isString(type) && dashRegex.test(type))
        || (canVideoProviderPlay?.(type) ?? false),
      canSetPlaybackQuality: async () => {
        try {
          return this.dash?.getBitrateInfoListFor('video')?.length > 0;
        } catch (e) {
          this.vmError.emit(e);
          return false;
        }
      },
      setPlaybackQuality: async (quality: string) => {
        if (!isUndefined(this.dash)) {
          const index = this.findLevelIndexFromQuality(quality);

          this.dash.updateSettings({
            streaming: {
              abr: {
                autoSwitchBitrate: {
                  video: (index === -1),
                },
              },
            },
          });

          if (index >= 0) this.dash.setQualityFor('video', index);

          // Update the provider cache.
          this.dispatch('playbackQuality', quality);
        }
      },
      setCurrentTextTrack: async (trackId: number) => {
        if (this.shouldRenderNativeTextTracks) {
          adapter.setCurrentTextTrack(trackId);
        } else {
          this.currentTextTrack = trackId;
          this.dash?.setTextTrack(trackId);
          this.onTextTracksChange();
        }
      },
      setTextTrackVisibility: async (isVisible: boolean) => {
        if (this.shouldRenderNativeTextTracks) {
          adapter.setTextTrackVisibility(isVisible);
        } else {
          this.isTextTrackVisible = isVisible;
          this.dash?.enableText(isVisible);
          this.onTextTracksChange();
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
        hasCustomTextManager={!this.shouldRenderNativeTextTracks}
        disableRemotePlayback={this.disableRemotePlayback}
        mediaTitle={this.mediaTitle}
        ref={(el: any) => { this.videoProvider = el; }}
      />
    );
  }
}
