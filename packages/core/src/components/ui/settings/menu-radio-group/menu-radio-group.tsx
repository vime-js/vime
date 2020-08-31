import {
  h, Component, Element, Prop, Watch, Event, EventEmitter, Listen,
} from '@stencil/core';

/**
 * @slot - Used to pass in radio buttons (`vime-menu-radio`).
 */
@Component({
  tag: 'vime-menu-radio-group',
})
export class MenuRadioGroup {
  @Element() el!: HTMLVimeMenuRadioGroupElement;

  /**
   * The current value selected for this group.
   */
  @Prop({ mutable: true }) value?: string;

  @Watch('value')
  onValueChange() {
    this.findRadios().forEach((radio) => {
      // eslint-disable-next-line no-param-reassign
      radio.checked = (radio.value === this.value);
    });
  }

  /**
   * Emitted when a new radio button is selected for this group.
   */
  @Event() vCheck!: EventEmitter<void>;

  connectedCallback() {
    this.onValueChange();
  }

  @Listen('vCheck')
  onSelectionChange(event: Event) {
    const radio = event.target as HTMLVimeMenuRadioElement;
    this.value = radio.value;
  }

  private findRadios() {
    return this.el.querySelectorAll('vime-menu-radio');
  }

  render() {
    return (
      <slot />
    );
  }
}
