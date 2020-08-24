import {
  h, Host, Component, Prop,
} from '@stencil/core';
import { PlayerProps, PlayerProp } from '../../../core/player/PlayerProp';
import { withPlayerContext } from '../../../core/player/PlayerContext';
import { TooltipDirection } from '../../tooltip/types';
import { isUndefined } from '../../../../utils/unit';
import { KeyboardControl } from '../control/KeyboardControl';
import { findRootPlayer } from '../../../core/player/utils';

@Component({
  tag: 'vime-caption-control',
  styleUrl: 'caption-control.css',
})
export class CaptionControl implements KeyboardControl {
  /**
   * The URL to an SVG element or fragment to load.
   */
  @Prop() showIcon = '#vime-captions-on';

  /**
   * The URL to an SVG element or fragment to load.
   */
  @Prop() hideIcon = '#vime-captions-off';

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
  @Prop() keys?: string = 'c';

  /**
   * @internal
   */
  @Prop() currentCaption?: PlayerProps[PlayerProp.currentCaption];

  /**
   * @internal
   */
  @Prop() isCaptionsActive: PlayerProps[PlayerProp.isCaptionsActive] = false;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps[PlayerProp.i18n] = {};

  private onClick() {
    const player = findRootPlayer(this);
    player.toggleCaptionsVisiblity();
  }

  render() {
    const tooltip = this.isCaptionsActive ? this.i18n.disableCaptions : this.i18n.enableCaptions;
    const tooltipWithHint = !isUndefined(this.keys) ? `${tooltip} (${this.keys})` : tooltip;

    return (
      <Host
        class={{
          hidden: isUndefined(this.currentCaption),
        }}
      >
        <vime-control
          scale={this.scale}
          label={this.i18n.captions}
          keys={this.keys}
          hidden={isUndefined(this.currentCaption)}
          pressed={this.isCaptionsActive}
          onClick={this.onClick.bind(this)}
        >
          <vime-icon href={this.isCaptionsActive ? this.showIcon : this.hideIcon} />

          <vime-tooltip
            hidden={this.hideTooltip}
            direction={this.tooltipDirection}
          >
            {tooltipWithHint}
          </vime-tooltip>
        </vime-control>
      </Host>
    );
  }
}

withPlayerContext(CaptionControl, [
  PlayerProp.isCaptionsActive,
  PlayerProp.currentCaption,
  PlayerProp.i18n,
]);
