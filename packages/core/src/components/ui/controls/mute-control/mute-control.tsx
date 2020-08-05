import { h, Component, Prop } from '@stencil/core';
import { PlayerProps, PlayerProp } from '../../../core/player/PlayerProp';
import { openPlayerWormhole } from '../../../core/player/PlayerWormhole';
import { PlayerStateDispatcher, createPlayerStateDispatcher } from '../../../core/player/PlayerState';
import { TooltipDirection } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
import { isUndefined } from '../../../../utils/unit';

@Component({
  tag: 'vime-mute-control',
})
export class MuteControl implements KeyboardControl {
  private dispatch!: PlayerStateDispatcher;

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
  @Prop() keyCodes?: string = '77';

  /**
   * @inheritdoc
   */
  @Prop() keyboardHint?: string = '(m)';

  /**
   * @internal
   */
  @Prop() volume: PlayerProps[PlayerProp.Volume] = 50;

  /**
   * @internal
   */
  @Prop() muted: PlayerProps[PlayerProp.Muted] = false;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps[PlayerProp.I18N] = {};

  connectedCallback() {
    this.dispatch = createPlayerStateDispatcher(this);
  }

  private getIcon() {
    const volumeIcon = (this.volume < 50) ? this.lowVolumeIcon : this.highVolumeIcon;
    return (this.muted || (this.volume === 0)) ? this.mutedIcon : volumeIcon;
  }

  private onClick() {
    this.dispatch(PlayerProp.Muted, !this.muted);
  }

  render() {
    const tooltip = this.muted ? this.i18n.unmute : this.i18n.mute;
    const tooltipWithHint = (!isUndefined(this.keyCodes) && !isUndefined(this.keyboardHint))
      ? `${tooltip} ${this.keyboardHint}` : tooltip;

    return (
      <vime-control
        scale={this.scale}
        label={this.i18n.mute}
        keyCodes={this.keyCodes}
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

openPlayerWormhole(MuteControl, [
  PlayerProp.Muted,
  PlayerProp.Volume,
  PlayerProp.I18N,
]);
