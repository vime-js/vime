import {
  h, Host, Component, Prop,
} from '@stencil/core';
import { PlayerProps, PlayerProp } from '../../../core/player/PlayerProp';
import { openPlayerWormhole } from '../../../core/player/PlayerWormhole';
import { PlayerStateDispatcher, createPlayerStateDispatcher } from '../../../core/player/PlayerState';
import { TooltipDirection } from '../../tooltip/types';
import { isUndefined } from '../../../../utils/unit';
import { KeyboardControl } from '../control/KeyboardControl';

@Component({
  tag: 'vime-caption-control',
  styleUrl: 'caption-control.css',
})
export class CaptionControl implements KeyboardControl {
  private dispatch!: PlayerStateDispatcher;

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
  @Prop() keyCodes?: string = '67';

  /**
   * @inheritdoc
   */
  @Prop() keyboardHint?: string = '(c)';

  /**
   * @internal
   */
  @Prop() currentCaption?: PlayerProps[PlayerProp.CurrentCaption];

  /**
   * @internal
   */
  @Prop() isCaptionsActive: PlayerProps[PlayerProp.IsCaptionsActive] = false;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps[PlayerProp.I18N] = {};

  connectedCallback() {
    this.dispatch = createPlayerStateDispatcher(this);
  }

  private onClick() {
    this.dispatch(PlayerProp.IsCaptionsActive, !this.isCaptionsActive);
  }

  render() {
    const tooltip = this.isCaptionsActive ? this.i18n.disableCaptions : this.i18n.enableCaptions;
    const tooltipWithHint = (!isUndefined(this.keyCodes) && !isUndefined(this.keyboardHint))
      ? `${tooltip} ${this.keyboardHint}` : tooltip;

    return (
      <Host
        class={{
          hidden: isUndefined(this.currentCaption),
        }}
      >
        <vime-control
          scale={this.scale}
          label={this.i18n.captions}
          keyCodes={this.keyCodes}
          hidden={isUndefined(this.currentCaption)}
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

openPlayerWormhole(CaptionControl, [
  PlayerProp.IsCaptionsActive,
  PlayerProp.CurrentCaption,
  PlayerProp.I18N,
]);
