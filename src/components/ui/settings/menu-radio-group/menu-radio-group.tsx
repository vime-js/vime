import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Prop,
  Watch,
} from '@stencil/core';

import { withComponentRegistry } from '../../../core/player/withComponentRegistry';

/**
 * This component is responsible for containing and managing menu items and submenus. The menu is
 * ARIA friendly by ensuring the correct ARIA properties are set, and enabling keyboard navigation
 * when it is focused.
 *
 * You can use this component if you'd like to build out a custom settings menu. If you're looking
 * to only customize the content of the settings see [`vime-settings`](settings.md), and if you
 * want an easier starting point see [`vime-default-settings`](default-settings.md).
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/src/components/ui/settings/menu/menu.png"
 *   alt="Vime settings menu component"
 * />
 *
 * @slot - Used to pass in radio buttons (`vm-menu-radio`).
 */
@Component({
  tag: 'vm-menu-radio-group',
  shadow: true,
})
export class MenuRadioGroup {
  @Element() host!: HTMLVmMenuRadioGroupElement;

  /**
   * The current value selected for this group.
   */
  @Prop({ mutable: true }) value?: string;

  @Watch('value')
  onValueChange() {
    this.findRadios()?.forEach(radio => {
      radio.checked = radio.value === this.value;
    });
  }

  /**
   * Emitted when a new radio button is selected for this group.
   */
  @Event() vmCheck!: EventEmitter<void>;

  constructor() {
    withComponentRegistry(this);
  }

  connectedCallback() {
    this.onValueChange();
  }

  componentDidLoad() {
    this.onValueChange();
  }

  @Listen('vmCheck')
  onSelectionChange(event: Event) {
    const radio = event.target as HTMLVmMenuRadioElement;
    this.value = radio.value;
  }

  private findRadios() {
    return this.host
      .shadowRoot!.querySelector('slot')
      ?.assignedElements() as HTMLVmMenuRadioElement[];
  }

  render() {
    return <slot />;
  }
}
