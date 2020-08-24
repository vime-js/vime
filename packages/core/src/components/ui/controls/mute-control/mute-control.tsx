import { h, Component, Prop } from '@stencil/core';
import { PlayerProps, PlayerProp } from '../../../core/player/PlayerProp';
import { withPlayerContext } from '../../../core/player/PlayerContext';
import { PlayerDispatcher, createPlayerDispatcher } from '../../../core/player/PlayerDispatcher';
import { TooltipDirection } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
import { isUndefined } from '../../../../utils/unit';

@Component({
  tag: 'vime-mute-control',
})
export class MuteControl implements KeyboardControl {
  private dispatch!: PlayerDispatcher;

  /**
   * The URL to an SVG element or fragment.
   */
  @Prop() lowVolumeIcon = '#vime-volume-low';

  /**
   * The URL to an SVG element or fragment.
   */
  @Prop() highVolumeIcon = '#vime-volume-high';

  /**
   * The URL to an SVG element or fragment.
   */
  @Prop() mutedIcon = '#vime-volume-mute';

  /**
   * The direction in which the tooltip should grow.
   */
  @Prop() tooltipDirection: TooltipDirection;

  /**
   * Whether the tooltip should not be displayed.
   */
  @Prop() hideTooltip = false;

  /**
   * Scale the size of the control up/down by the amount given.
   */
  @Prop() scale = 1;

  /**
   * @inheritdoc
   */
  @Prop() keys?: string = 'm';

  /**
   * @internal
   */
  @Prop() volume: PlayerProps[PlayerProp.volume] = 50;

  /**
   * @internal
   */
  @Prop() muted: PlayerProps[PlayerProp.muted] = false;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps[PlayerProp.i18n] = {};

  componentWillLoad() {
    this.dispatch = createPlayerDispatcher(this);
  }

  private getIcon() {
    const volumeIcon = (this.volume < 50) ? this.lowVolumeIcon : this.highVolumeIcon;
    return (this.muted || (this.volume === 0)) ? this.mutedIcon : volumeIcon;
  }

  private onClick() {
    this.dispatch(PlayerProp.muted, !this.muted);
  }

  render() {
    const tooltip = this.muted ? this.i18n.unmute : this.i18n.mute;
    const tooltipWithHint = !isUndefined(this.keys) ? `${tooltip} (${this.keys})` : tooltip;

    return (
      <vime-control
        scale={this.scale}
        label={this.i18n.mute}
        pressed={this.muted}
        keys={this.keys}
        onClick={this.onClick.bind(this)}
      >
        <vime-icon href={this.getIcon()} />

        <vime-tooltip
          hidden={this.hideTooltip}
          direction={this.tooltipDirection}
        >
          {tooltipWithHint}
        </vime-tooltip>
      </vime-control>
    );
  }
}

withPlayerContext(MuteControl, [
  PlayerProp.muted,
  PlayerProp.volume,
  PlayerProp.i18n,
]);
