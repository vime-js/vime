/* eslint-disable jsx-a11y/label-has-associated-control */

import {
  h, Component, Prop, Event, EventEmitter,
} from '@stencil/core';

@Component({
  tag: 'vime-menu-radio',
})
export class MenuRadio {
  /**
   * The title of the radio item displayed to the user.
   */
  @Prop() label!: string;

  /**
   * The value associated with this radio item.
   */
  @Prop() value!: string;

  /**
   * Whether the radio item is selected or not.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * This can provide additional context about the value. For example, if the option is for a set of
   * video qualities, the badge could describe whether the quality is UHD, HD etc.
   */
  @Prop() badge?: string;

  /**
   * The URL to an SVG element or fragment to load.
   */
  @Prop() checkedIcon?: string = '#vime-checkmark';

  /**
   * Emitted when the radio button is selected.
   */
  @Event() check!: EventEmitter<void>;

  private onClick() {
    this.checked = !this.checked;
    this.check.emit();
  }

  render() {
    return (
      <vime-menu-item
        label={this.label}
        checked={this.checked}
        badge={this.badge}
        checkedIcon={this.checkedIcon}
        onClick={this.onClick.bind(this)}
      />
    );
  }
}
