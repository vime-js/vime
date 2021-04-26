import { Component, h, Prop, State, Watch } from '@stencil/core';

import { Disposal } from '../../../../utils/Disposal';
import { isUndefined } from '../../../../utils/unit';
import { findPlayer } from '../../../core/player/findPlayer';
import {
  createDispatcher,
  Dispatcher,
} from '../../../core/player/PlayerDispatcher';
import { PlayerProps } from '../../../core/player/PlayerProps';
import {
  getPlayerFromRegistry,
  withComponentRegistry,
} from '../../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../../core/player/withPlayerContext';

/**
 * @slot - Used to extend the settings with additional menu options (see `vm-submenu` or
 * `vm-menu-item`).
 */
@Component({
  tag: 'vm-default-settings',
  shadow: true,
  styleUrl: 'default-settings.css',
})
export class DefaultSettings {
  private textTracksDisposal = new Disposal();

  private dispatch!: Dispatcher;

  @State() canSetPlaybackRate = false;

  @State() canSetPlaybackQuality = false;

  @State() canSetTextTrack = false;

  @State() canSetAudioTrack = false;

  /**
   * Pins the settings to the defined position inside the video player. This has no effect when
   * the view is of type `audio`, it will always be `bottomRight`.
   */
  @Prop({
    reflect: true,
  })
  pin: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' = 'bottomRight';

  /** @internal */
  @Prop() i18n: PlayerProps['i18n'] = {};

  /** @internal */
  @Prop() playbackReady: PlayerProps['playbackReady'] = false;

  @Watch('playbackReady')
  async onPlaybackReady() {
    const player = await findPlayer(this);
    if (isUndefined(player)) return;
    this.canSetPlaybackQuality = await player.canSetPlaybackQuality();
    this.canSetPlaybackRate = await player.canSetPlaybackRate();
  }

  /** @internal */
  @Prop() playbackRate: PlayerProps['playbackRate'] = 1;

  /** @internal */
  @Prop() playbackRates: PlayerProps['playbackRates'] = [1];

  /** @internal */
  @Prop() isVideoView: PlayerProps['isAudioView'] = false;

  /** @internal */
  @Prop() playbackQuality?: PlayerProps['playbackQuality'];

  /** @internal */
  @Prop() playbackQualities: PlayerProps['playbackQualities'] = [];

  /** @internal */
  @Prop() textTracks: PlayerProps['textTracks'] = [];

  /** @internal */
  @Prop() currentTextTrack = -1;

  /** @internal */
  @Prop() audioTracks: PlayerProps['audioTracks'] = [];

  @Watch('audioTracks')
  @Watch('playbackReady')
  async onAudioTracksChange() {
    const player = getPlayerFromRegistry(this);
    this.canSetAudioTrack = (await player?.canSetAudioTrack()) ?? false;
  }

  /** @internal */
  @Prop() currentAudioTrack = -1;

  /** @internal */
  @Prop() isTextTrackVisible = true;

  @Watch('textTracks')
  @Watch('playbackReady')
  async onTextTracksChange() {
    const player = getPlayerFromRegistry(this);
    this.canSetTextTrack = (await player?.canSetTextTrack()) ?? false;
  }

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, [
      'i18n',
      'playbackReady',
      'playbackRate',
      'playbackRates',
      'playbackQuality',
      'playbackQualities',
      'isVideoView',
      'textTracks',
      'currentTextTrack',
      'isTextTrackVisible',
      'audioTracks',
      'currentAudioTrack',
    ]);
  }

  connectedCallback() {
    this.dispatch = createDispatcher(this);
  }

  componentDidLoad() {
    this.onTextTracksChange();
  }

  disconnectedCallback() {
    this.textTracksDisposal.empty();
  }

  private onPlaybackRateSelect(event: Event) {
    const radio = event.target as HTMLVmMenuRadioElement;
    this.dispatch('playbackRate', parseFloat(radio.value));
  }

  private buildPlaybackRateSubmenu() {
    if (this.playbackRates.length <= 1 || !this.canSetPlaybackRate) {
      return (
        <vm-menu-item label={this.i18n.playbackRate} hint={this.i18n.normal} />
      );
    }

    const formatRate = (rate: number) =>
      rate === 1 ? this.i18n.normal : `${rate}`;

    return (
      <vm-submenu
        label={this.i18n.playbackRate}
        hint={formatRate(this.playbackRate)}
      >
        <vm-menu-radio-group
          value={`${this.playbackRate}`}
          onVmCheck={this.onPlaybackRateSelect.bind(this)}
        >
          {this.playbackRates.map(rate => (
            <vm-menu-radio label={formatRate(rate)} value={`${rate}`} />
          ))}
        </vm-menu-radio-group>
      </vm-submenu>
    );
  }

  private onPlaybackQualitySelect(event: Event) {
    const radio = event.target as HTMLVmMenuRadioElement;
    this.dispatch('playbackQuality', radio.value);
  }

  private buildPlaybackQualitySubmenu() {
    if (this.playbackQualities.length <= 1 || !this.canSetPlaybackQuality) {
      return (
        <vm-menu-item
          label={this.i18n.playbackQuality}
          hint={this.playbackQuality ?? this.i18n.auto}
        />
      );
    }

    // @TODO this doesn't account for audio qualities yet.
    const getBadge = (quality: string) => {
      const verticalPixels = parseInt(quality.slice(0, -1), 10);
      if (verticalPixels >= 2160) return 'UHD';
      if (verticalPixels >= 1080) return 'HD';
      return undefined;
    };

    return (
      <vm-submenu label={this.i18n.playbackQuality} hint={this.playbackQuality}>
        <vm-menu-radio-group
          value={this.playbackQuality}
          onVmCheck={this.onPlaybackQualitySelect.bind(this)}
        >
          {this.playbackQualities.map(quality => (
            <vm-menu-radio
              label={quality}
              value={quality}
              badge={getBadge(quality)}
            />
          ))}
        </vm-menu-radio-group>
      </vm-submenu>
    );
  }

  private onTextTrackSelect(event: Event) {
    const radio = event.target as HTMLVmMenuRadioElement;
    const trackId = parseInt(radio.value, 10);
    const player = getPlayerFromRegistry(this);

    if (trackId === -1) {
      player?.setTextTrackVisibility(false);
      return;
    }

    player?.setTextTrackVisibility(true);
    player?.setCurrentTextTrack(trackId);
  }

  private buildTextTracksSubmenu() {
    if (this.textTracks.length <= 1 || !this.canSetTextTrack) {
      return (
        <vm-menu-item
          label={this.i18n.subtitlesOrCc}
          hint={this.textTracks[this.currentTextTrack]?.label ?? this.i18n.none}
        />
      );
    }

    return (
      <vm-submenu
        label={this.i18n.subtitlesOrCc}
        hint={
          this.isTextTrackVisible
            ? this.textTracks[this.currentTextTrack]?.label
            : this.i18n.off
        }
      >
        <vm-menu-radio-group
          value={`${!this.isTextTrackVisible ? -1 : this.currentTextTrack}`}
          onVmCheck={this.onTextTrackSelect.bind(this)}
        >
          {[<vm-menu-radio label={this.i18n.off} value="-1" />].concat(
            this.textTracks.map((track, i) => (
              <vm-menu-radio label={track.label} value={`${i}`} />
            )),
          )}
        </vm-menu-radio-group>
      </vm-submenu>
    );
  }

  private onAudioTrackSelect(event: Event) {
    const radio = event.target as HTMLVmMenuRadioElement;
    const trackId = parseInt(radio.value, 10);
    const player = getPlayerFromRegistry(this);
    player?.setCurrentAudioTrack(trackId);
  }

  private buildAudioTracksMenu() {
    if (this.audioTracks.length <= 1 || !this.canSetAudioTrack) {
      return (
        <vm-menu-item
          label={this.i18n.audio}
          hint={
            this.audioTracks[this.currentAudioTrack]?.label ?? this.i18n.default
          }
        />
      );
    }

    return (
      <vm-submenu
        label={this.i18n.audio}
        hint={this.audioTracks[this.currentAudioTrack]?.label}
      >
        <vm-menu-radio-group
          value={`${this.currentAudioTrack}`}
          onVmCheck={this.onAudioTrackSelect.bind(this)}
        >
          {this.audioTracks.map((track, i) => (
            <vm-menu-radio label={track.label} value={`${i}`} />
          ))}
        </vm-menu-radio-group>
      </vm-submenu>
    );
  }

  render() {
    return (
      <vm-settings pin={this.pin}>
        {this.buildAudioTracksMenu()}
        {this.buildPlaybackRateSubmenu()}
        {this.buildPlaybackQualitySubmenu()}
        {this.isVideoView && this.buildTextTracksSubmenu()}
        <slot />
      </vm-settings>
    );
  }
}
