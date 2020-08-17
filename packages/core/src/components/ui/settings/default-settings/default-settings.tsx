import {
  h, Component, Prop, Watch, forceUpdate,
} from '@stencil/core';
import { openPlayerWormhole } from '../../../core/player/PlayerWormhole';
import { PlayerProp, PlayerProps } from '../../../core/player/PlayerProp';
import { Disposal } from '../../../core/player/Disposal';
import { listen } from '../../../../utils/dom';
import { isUndefined } from '../../../../utils/unit';
import { PlayerStateDispatcher, createPlayerStateDispatcher } from '../../../core/player/PlayerState';
import { findRootPlayer } from '../../../core/player/utils';

/**
 * @slot - Used to extend the settings with additional menu options (see `vime-submenu` or
 * `vime-menu-item`).
 */
@Component({
  tag: 'vime-default-settings',
})
export class DefaultSettings {
  private textTracksDisposal = new Disposal();

  private dispatch!: PlayerStateDispatcher;

  private player?: HTMLVimePlayerElement;

  private rateSubmenu: any;

  private qualitySubmenu: any;

  private captionsSubmenu: any;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps[PlayerProp.I18N] = {};

  /**
   * @internal
   */
  @Prop() playbackRate: PlayerProps[PlayerProp.PlaybackRate] = 1;

  /**
   * @internal
   */
  @Prop() playbackRates: PlayerProps[PlayerProp.PlaybackRates] = [1];

  /**
   * @internal
   */
  @Prop() playbackQuality?: PlayerProps[PlayerProp.PlaybackQuality];

  /**
   * @internal
   */
  @Prop() playbackQualities: PlayerProps[PlayerProp.PlaybackQualities] = [];

  /**
   * @internal
   */
  @Prop() isCaptionsActive: PlayerProps[PlayerProp.IsCaptionsActive] = false;

  /**
   * @internal
   */
  @Prop() currentCaption?: PlayerProps[PlayerProp.CurrentCaption];

  /**
   * @internal
   */
  @Prop() textTracks?: PlayerProps[PlayerProp.TextTracks];

  @Watch('textTracks')
  onTextTracksChange() {
    this.textTracksDisposal.empty();
    if (isUndefined(this.textTracks)) return;
    this.textTracksDisposal.add(listen(this.textTracks!, 'change', () => {
      setTimeout(() => forceUpdate(this), 300);
    }));
  }

  componentWillLoad() {
    this.skipFirstRender = true;
    this.player = findRootPlayer(this);
    this.dispatch = createPlayerStateDispatcher(this);
  }

  private skipFirstRender = true;

  componentWillRender() {
    if (this.skipFirstRender) {
      this.skipFirstRender = false;
      return undefined;
    }

    return Promise.all([
      this.buildPlaybackRateSubmenu(),
      this.buildPlaybackQualitySubmenu(),
      this.buildCaptionsSubmenu(),
    ]);
  }

  disconnectedCallback() {
    this.player = undefined;
    this.textTracksDisposal.empty();
  }

  private onPlaybackRateSelect(event: Event) {
    const radio = event.target as HTMLVimeMenuRadioElement;
    this.dispatch(PlayerProp.PlaybackRate, parseFloat(radio.value));
  }

  private async buildPlaybackRateSubmenu() {
    const canSetPlaybackRate = await this.player?.canSetPlaybackRate();

    if (this.playbackRates.length === 1 || !canSetPlaybackRate) {
      this.rateSubmenu = (
        <vime-menu-item label={this.i18n.playbackRate} hint={this.i18n.normal} />
      );
      return;
    }

    const formatRate = (rate: number) => ((rate === 1) ? this.i18n.normal : `${rate}`);

    const radios = this.playbackRates.map((rate) => (
      <vime-menu-radio
        label={formatRate(rate)}
        value={`${rate}`}
      />
    ));

    this.rateSubmenu = (
      <vime-submenu label={this.i18n.playbackRate} hint={formatRate(this.playbackRate)}>
        <vime-menu-radio-group
          value={`${this.playbackRate}`}
          onVCheck={this.onPlaybackRateSelect.bind(this)}
        >
          {radios}
        </vime-menu-radio-group>
      </vime-submenu>
    );
  }

  private onPlaybackQualitySelect(event: Event) {
    const radio = event.target as HTMLVimeMenuRadioElement;
    this.dispatch(PlayerProp.PlaybackQuality, radio.value);
  }

  private async buildPlaybackQualitySubmenu() {
    const canSetPlaybackQuality = await this.player?.canSetPlaybackQuality();

    if (this.playbackQualities.length === 0 || !canSetPlaybackQuality) {
      this.qualitySubmenu = (
        <vime-menu-item
          label={this.i18n.playbackQuality}
          hint={this.playbackQuality ?? this.i18n.auto}
        />
      );
      return;
    }

    // @TODO this doesn't account for audio qualities yet.
    const getBadge = (quality: string) => {
      const verticalPixels = parseInt(quality.slice(0, -1), 10);
      if (verticalPixels > 2160) return 'UHD';
      if (verticalPixels >= 1080) return 'HD';
      return undefined;
    };

    const radios = this.playbackQualities.map((quality) => (
      <vime-menu-radio
        label={quality}
        value={quality}
        badge={getBadge(quality)}
      />
    ));

    this.qualitySubmenu = (
      <vime-submenu label={this.i18n.playbackQuality} hint={this.playbackQuality}>
        <vime-menu-radio-group
          value={this.playbackQuality}
          onVCheck={this.onPlaybackQualitySelect.bind(this)}
        >
          {radios}
        </vime-menu-radio-group>
      </vime-submenu>
    );
  }

  private async onCaptionSelect(event: Event) {
    const radio = event.target as HTMLVimeMenuRadioElement;
    const index = parseInt(radio.value, 10);
    const player = findRootPlayer(this);

    if (index === -1) {
      await player.toggleCaptionsVisiblity(false);
      return;
    }

    const track = Array.from(this.textTracks ?? [])[index];
    if (!isUndefined(track)) {
      if (!isUndefined(this.currentCaption)) this.currentCaption!.mode = 'disabled';
      track.mode = 'showing';
      await player.toggleCaptionsVisiblity(true);
    }
  }

  private async buildCaptionsSubmenu() {
    const captions = Array.from(this.textTracks ?? [])
      .filter((track) => ['captions', 'subtitles'].includes(track.kind));

    if (captions.length === 0) {
      this.captionsSubmenu = (
        <vime-menu-item label={this.i18n.subtitlesOrCc} hint={this.i18n.none} />
      );
      return;
    }

    const getTrackValue = (
      track: TextTrack,
    ) => `${Array.from(this.textTracks!).findIndex((t) => t === track)}`;

    const radios = [(
      <vime-menu-radio
        label={this.i18n.off}
        value="-1"
      />
    )].concat(captions.map((track) => (
      <vime-menu-radio
        label={track.label}
        value={getTrackValue(track)}
      />
    )));

    const groupValue = (!this.isCaptionsActive || isUndefined(this.currentCaption))
      ? '-1'
      : getTrackValue(this.currentCaption!);

    this.captionsSubmenu = (
      <vime-submenu
        label={this.i18n.subtitlesOrCc}
        hint={(this.isCaptionsActive ? this.currentCaption?.label : undefined) ?? this.i18n.off}
      >
        <vime-menu-radio-group
          value={groupValue}
          onVCheck={this.onCaptionSelect.bind(this)}
        >
          {radios}
        </vime-menu-radio-group>
      </vime-submenu>
    );
  }

  render() {
    return (
      <vime-settings>
        {this.rateSubmenu}
        {this.qualitySubmenu}
        {this.captionsSubmenu}
        <slot />
      </vime-settings>
    );
  }
}

openPlayerWormhole(DefaultSettings, [
  PlayerProp.I18N,
  PlayerProp.PlaybackRate,
  PlayerProp.PlaybackRates,
  PlayerProp.PlaybackQuality,
  PlayerProp.PlaybackQualities,
  PlayerProp.IsCaptionsActive,
  PlayerProp.CurrentCaption,
  PlayerProp.TextTracks,
]);
