import {
  h, Host, Component, Prop, Element,
} from '@stencil/core';
import { withPlayerContext } from '../../../core/player/PlayerContext';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { TooltipDirection, TooltipPosition } from '../../tooltip/types';
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
   * Whether the tooltip is positioned above/below the control.
   */
  @Prop() tooltipPosition: TooltipPosition = 'top';

  /**
   * The direction in which the tooltip should grow.
   */
  @Prop() tooltipDirection: TooltipDirection;

  /**
   * The DOM `id` of the settings menu this control is responsible for opening/closing.
   */
  @Prop() menu?: string;

  /**
   * Whether the settings menu this control manages is open.
   */
  @Prop() expanded = false;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps['i18n'] = {};

  connectedCallback() {
    idCount += 1;
    this.id = `vime-settings-control-${idCount}`;
    this.findSettings();
  }

  componentDidLoad() {
    this.findSettings();
  }

  private findSettings() {
    const settings = findUIRoot(this)?.querySelector('vime-settings');
    settings?.setController(this.id, this.el);
  }

  render() {
    const hasSettings = !isUndefined(this.menu);

    return (
      <Host
        class={{
          hidden: !hasSettings,
          active: hasSettings && this.expanded,
        }}
      >
        <vime-control
          identifier={this.id}
          menu={this.menu}
          hidden={!hasSettings}
          expanded={this.expanded}
          label={this.i18n.settings}
        >
          <vime-icon href={this.icon} />

          <vime-tooltip
            hidden={this.expanded}
            position={this.tooltipPosition}
            direction={this.tooltipDirection}
          >
            {this.i18n.settings}
          </vime-tooltip>
        </vime-control>
      </Host>
    );
  }
}

withPlayerContext(SettingsControl, [
  'i18n',
]);
