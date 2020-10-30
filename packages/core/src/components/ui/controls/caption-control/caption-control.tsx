import {
  h, Host, Component, Prop,
} from '@stencil/core';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { TooltipDirection, TooltipPosition } from '../../tooltip/types';
import { isUndefined } from '../../../../utils/unit';
import { KeyboardControl } from '../control/KeyboardControl';
import { findRootPlayer } from '../../../core/player/utils';
import { withPlayerContext } from '../../../core/player/PlayerContext';

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
   * Whether the tooltip is positioned above/below the control.
   */
  @Prop() tooltipPosition: TooltipPosition = 'top';

  /**
   * The direction in which the tooltip should grow.
   */
  @Prop() tooltipDirection: TooltipDirection;

  /**
   * Whether the tooltip should not be displayed.
   */
  @Prop() hideTooltip = false;

  /**
   * @inheritdoc
   */
  @Prop() keys?: string = 'c';

  /**
   * @internal
   */
  @Prop() currentCaption?: PlayerProps['currentCaption'];

  /**
   * @internal
   */
  @Prop() isCaptionsActive: PlayerProps['isCaptionsActive'] = false;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps['i18n'] = {};

  constructor() {
    withPlayerContext(this, [
      'isCaptionsActive',
      'currentCaption',
      'i18n',
    ]);
  }

  private onClick() {
    const player = findRootPlayer(this);
    player.toggleCaptionsVisibility();
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
          label={this.i18n.captions}
          keys={this.keys}
          hidden={isUndefined(this.currentCaption)}
          pressed={this.isCaptionsActive}
          onClick={this.onClick.bind(this)}
        >
          <vime-icon href={this.isCaptionsActive ? this.showIcon : this.hideIcon} />

          <vime-tooltip
            hidden={this.hideTooltip}
            position={this.tooltipPosition}
            direction={this.tooltipDirection}
          >
            {tooltipWithHint}
          </vime-tooltip>
        </vime-control>
      </Host>
    );
  }
}
