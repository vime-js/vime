import {
  h, Host, Component, Prop, Element,
} from '@stencil/core';
import { openPlayerWormhole } from '../../../core/player/PlayerWormhole';
import { PlayerProp, PlayerProps } from '../../../core/player/PlayerProp';
import { TooltipDirection } from '../../tooltip/types';
import { isUndefined } from '../../../../utils/unit';
import { findUIRoot } from '../../ui/utils';

let idCount = 0;

@Component({
  tag: 'vime-settings-control',
  styleUrl: 'settings-control.scss',
})
export class SettingsControl {
  private id!: string;

  @Element() el!: HTMLVimeSettingsControlElement;

  /**
   * The URL to an SVG element or fragment to load.
   */
  @Prop() icon = '#vime-settings';

  /**
   * The direction in which the tooltip should grow.
   */
  @Prop() tooltipDirection: TooltipDirection;

  /**
   * @internal
   */
  @Prop() menu?: string;

  /**
   * @internal
   */
  @Prop() expanded = false;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps[PlayerProp.I18N] = {};

  componentWillLoad() {
    idCount += 1;
    this.id = `vime-settings-control-${idCount}`;
    const settings = findUIRoot(this).querySelector('vime-settings');
    settings?.setController(this.id, this.el);
  }

  private hasSettings() {
    return !isUndefined(this.menu);
  }

  render() {
    return (
      <Host
        class={{
          hidden: !this.hasSettings(),
          active: this.hasSettings() && this.expanded,
        }}
      >
        <vime-control
          identifier={this.id}
          menu={this.menu}
          hidden={!this.hasSettings()}
          expanded={this.expanded}
          label={this.i18n.settings}
        >
          <vime-icon href={this.icon} />

          <vime-tooltip
            hidden={this.expanded}
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
