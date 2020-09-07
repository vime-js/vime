import {
  h, Component, Prop, Watch, forceUpdate,
} from '@stencil/core';
import { withPlayerContext } from '../../../core/player/PlayerContext';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { Disposal } from '../../../core/player/Disposal';
import { listen } from '../../../../utils/dom';
import { isUndefined } from '../../../../utils/unit';
import { Dispatcher, createDispatcher } from '../../../core/player/PlayerDispatcher';
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

  private dispatch!: Dispatcher;

  private player?: HTMLVimePlayerElement;

  private rateSubmenu: any;

  private qualitySubmenu: any;

  private captionsSubmenu: any;

  /**
   * Pins the settings to the defined position inside the video player. This has no effect when
   * the view is of type `audio`, it will always be `bottomRight`.
   */
  @Prop({
    reflect: true,
  }) pin: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' = 'bottomRight';

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps['i18n'] = {};

  /**
   * @internal
   */
  @Prop() playbackRate: PlayerProps['playbackRate'] = 1;

  /**
   * @internal
   */
  @Prop() playbackRates: PlayerProps['playbackRates'] = [1];

  /**
   * @internal
   */
  @Prop() playbackQuality?: PlayerProps['playbackQuality'];

  /**
   * @internal
   */
  @Prop() playbackQualities: PlayerProps['playbackQualities'] = [];

  /**
   * @internal
   */
  @Prop() isCaptionsActive: PlayerProps['isCaptionsActive'] = false;

  /**
   * @internal
   */
  @Prop() currentCaption?: PlayerProps['currentCaption'];

  /**
   * @internal
   */
  @Prop() textTracks?: PlayerProps['textTracks'];

  @Watch('textTracks')
  onTextTracksChange() {
    this.textTracksDisposal.empty();
    if (isUndefined(this.textTracks)) return;
    this.textTracksDisposal.add(listen(this.textTracks!, 'change', () => {
      setTimeout(() => forceUpdate(this), 300);
    }));
  }

  connectedCallback() {
    this.skipFirstRender = true;
    this.player = findRootPlayer(this);
    this.dispatch = createDispatcher(this);
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
    this.dispatch('playbackRate', parseFloat(radio.value));
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
    this.dispatch('playbackQuality', radio.value);
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
      await player.toggleCaptionsVisibility(false);
      return;
    }

    const track = Array.from(this.textTracks ?? [])[index];
    if (!isUndefined(track)) {
      if (!isUndefined(this.currentCaption)) this.currentCaption!.mode = 'disabled';
      track.mode = 'showing';
      await player.toggleCaptionsVisibility(true);
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
      <vime-settings pin={this.pin}>
        {this.rateSubmenu}
        {this.qualitySubmenu}
        {this.captionsSubmenu}
        <slot />
      </vime-settings>
    );
  }
}

withPlayerContext(DefaultSettings, [
  'i18n',
  'playbackRate',
  'playbackRates',
  'playbackQuality',
  'playbackQualities',
  'isCaptionsActive',
  'currentCaption',
  'textTracks',
]);
