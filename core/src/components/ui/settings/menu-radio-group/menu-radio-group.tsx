import {
  h,
  Component,
  Element,
  Prop,
  Watch,
  Event,
  EventEmitter,
  Listen,
} from '@stencil/core';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';

/**
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
    this.findRadios()?.forEach((radio) => {
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
