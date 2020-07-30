import {
  h, Host, Component, Prop, State, Element,
} from '@stencil/core';
import { openPlayerWormhole } from '../../../core/player/PlayerWormhole';
import { PlayerProp, PlayerProps } from '../../../core/player/PlayerProp';
import { TooltipDirection } from '../../tooltip/types';
import { isNull } from '../../../../utils/unit';

@Component({
  tag: 'vime-settings-control',
  styleUrl: 'settings-control.scss',
})
export class SettingsControl {
  @Element() el!: HTMLVimeSettingsControlElement;

  @State() hasNoSettings = true;

  @State() isMenuActive = false;

  /**
   * The URL to an SVG element or fragment to load.
   */
  @Prop() icon = '#vime-settings';

  /**
   * The direction in which the tooltip should grow.
   */
  @Prop() tooltipDirection: TooltipDirection;

  /**
   * Whether the tooltip should not be displayed.
   */
  @Prop() hideTooltip = false;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps[PlayerProp.I18N] = {};

  componentWillLoad() {
    const settings = this.findSettings();
    this.hasNoSettings = isNull(settings);
  }

  private findSettings() {
    // @TODO find settings menu.
    return null;
  }

  private onToggleMenu() {
    const settings = this.findSettings();
    if (isNull(settings)) return;
    console.log(this.isMenuActive);
    // @TODO wait for changes then focus menu?
  }

  render() {
    return (
      <Host
        class={{
          hidden: this.hasNoSettings,
        }}
      >
        <vime-control
          menu="apples"
          hidden={this.hasNoSettings}
          expanded={this.isMenuActive}
          label={this.i18n.settings}
          onClick={this.onToggleMenu.bind(this)}
        >
          <vime-icon href={this.icon} />

          <vime-tooltip
            hidden={this.hideTooltip}
            direction={this.tooltipDirection}
          >
            {this.i18n.settings}
          </vime-tooltip>
        </vime-control>
      </Host>
    );
  }
}

openPlayerWormhole(SettingsControl, [
  PlayerProp.I18N,
]);
