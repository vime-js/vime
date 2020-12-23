import {
  h,
  Component,
  Prop,
  Element,
  Watch,
  State,
  Method,
} from '@stencil/core';
import { withPlayerContext } from '../../../core/player/withPlayerContext';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { TooltipDirection, TooltipPosition } from '../../tooltip/types';
import { isUndefined } from '../../../../utils/unit';
import {
  watchComponentRegistry,
  withComponentRegistry,
} from '../../../core/player/withComponentRegistry';

let idCount = 0;

@Component({
  tag: 'vm-settings-control',
  styleUrl: 'settings-control.css',
  shadow: true,
})
export class SettingsControl {
  private id!: string;

  private control?: HTMLVmControlElement;

  @Element() host!: HTMLVmSettingsControlElement;

  @State() vmSettings?: HTMLVmSettingsElement;

  @Watch('vmSettings')
  onComponentsChange() {
    if (!isUndefined(this.vmSettings)) {
      this.vmSettings.setController(this.host);
    }
  }

  /**
   * The name of the settings icon to resolve from the icon library.
   */
  @Prop() icon = 'settings';

  /**
   * The name of an icon library to use. Defaults to the library defined by the `icons` player
   * property.
   */
  @Prop() icons?: string;

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

  /** @internal */
  @Prop() i18n: PlayerProps['i18n'] = {};

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, ['i18n']);
  }

  connectedCallback() {
    idCount += 1;
    this.id = `vm-settings-control-${idCount}`;
    watchComponentRegistry(this, 'vm-settings', (regs) => {
      [this.vmSettings] = regs;
    });
  }

  /**
   * Focuses the control.
   */
  @Method()
  async focusControl() {
    this.control?.focusControl();
  }

  /**
   * Removes focus from the control.
   */
  @Method()
  async blurControl() {
    this.control?.blurControl();
  }

  render() {
    const hasSettings = !isUndefined(this.menu);

    return (
      <div
        class={{
          settingsControl: true,
          hidden: !hasSettings,
          active: hasSettings && this.expanded,
        }}
      >
        <vm-control
          identifier={this.id}
          menu={this.menu}
          hidden={!hasSettings}
          expanded={this.expanded}
          label={this.i18n.settings}
          ref={(control) => {
            this.control = control;
          }}
        >
          <vm-icon name={this.icon} library={this.icons} />

          <vm-tooltip
            hidden={this.expanded}
            position={this.tooltipPosition}
            direction={this.tooltipDirection}
          >
            {this.i18n.settings}
          </vm-tooltip>
        </vm-control>
      </div>
    );
  }
}
