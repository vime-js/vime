import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Method,
  Prop,
  State,
} from '@stencil/core';

import { isNil, isUndefined } from '../../../../utils/unit';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../../core/player/withPlayerContext';

@Component({
  tag: 'vm-menu-item',
  styleUrl: 'menu-item.css',
  shadow: true,
})
export class MenuItem {
  private menuItem?: HTMLDivElement;

  @Element() host!: HTMLVmMenuItemElement;

  @State() showTapHighlight = false;

  /**
   * The `id` attribute of the item.
   */
  @Prop() identifier?: string;

  /**
   * Whether the item is displayed or not.
   */
  @Prop() hidden = false;

  /**
   * The label/title of the item.
   */
  @Prop() label!: string;

  /**
   * If the item has a popup menu, then this should be a reference to it.
   */
  @Prop() menu?: HTMLVmMenuElement;

  /**
   * If the item has a popup menu, this indicates whether the menu is open or not. Sets the
   * `aria-expanded` property.
   */
  @Prop() expanded?: boolean;

  /**
   * If this item is to behave as a radio button, then this property determines whether the
   * radio is selected or not. Sets the `aria-checked` property.
   */
  @Prop() checked?: boolean;

  /**
   * This can provide additional context about some underlying state of the item. For example, if
   * the menu item opens/closes a submenu with options, the hint could be the currently selected
   * option.
   */
  @Prop() hint?: string;

  /**
   * This can provide additional context about the value of a menu item. For example, if the item
   * is a radio button for a set of video qualities, the badge could describe whether the quality
   * is UHD, HD etc.
   */
  @Prop() badge?: string;

  /**
   * The name of the checkmark icon to resolve from the icon library.
   */
  @Prop() checkIcon?: string = 'check';

  /**
   * The name of an icon library to use. Defaults to the library defined by the `icons` player
   * property.
   */
  @Prop() icons?: string;

  /** @internal */
  @Prop() isTouch: PlayerProps['isTouch'] = false;

  /**
   * Emitted when the item is focused.
   */
  @Event() vmFocus!: EventEmitter<void>;

  /**
   * Emitted when the item loses focus.
   */
  @Event() vmBlur!: EventEmitter<void>;

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, ['isTouch']);
  }

  /**
   * Focuses the menu item.
   */
  @Method()
  async focusItem() {
    this.menuItem?.focus();
  }

  /**
   * Removes focus from the menu item.
   */
  @Method()
  async blurItem() {
    this.menuItem?.blur();
  }

  /**
   * Returns the height of the menu item.
   */
  @Method()
  async getHeight() {
    return parseFloat(
      this.menuItem ? window.getComputedStyle(this.menuItem).height : '0',
    );
  }

  private onClick() {
    if (!isNil(this.menu)) this.menu.active = !this.expanded;
  }

  private onFocus() {
    this.vmFocus.emit();
  }

  private onBlur() {
    this.vmBlur.emit();
  }

  private onTouchStart() {
    this.showTapHighlight = true;
  }

  private onTouchEnd() {
    setTimeout(() => {
      this.showTapHighlight = false;
    }, 100);
  }

  private onMouseLeave() {
    this.menuItem?.blur();
  }

  render() {
    const isCheckedDefined = !isUndefined(this.checked);
    const isMenuDefined = !isUndefined(this.menu);
    const hasExpanded = this.expanded ? 'true' : 'false';
    const isChecked = this.checked ? 'true' : 'false';
    const showCheckedIcon = isCheckedDefined && !isUndefined(this.checkIcon);
    const showLeftNavArrow = isMenuDefined && this.expanded;
    const showRightNavArrow = isMenuDefined && !this.expanded;
    const showHint =
      !isUndefined(this.hint) &&
      !isCheckedDefined &&
      (!isMenuDefined || !this.expanded);
    const showBadge =
      !isUndefined(this.badge) && !showHint && !showRightNavArrow;
    const hasSpacer = showHint || showRightNavArrow;

    return (
      <div
        class={{
          menuItem: true,
          notTouch: !this.isTouch,
          tapHighlight: this.showTapHighlight,
          showDivider: isMenuDefined && (this.expanded ?? false),
        }}
        id={this.identifier}
        role={isCheckedDefined ? 'menuitemradio' : 'menuitem'}
        tabindex="0"
        aria-label={this.label}
        aria-hidden={this.hidden ? 'true' : 'false'}
        aria-haspopup={isMenuDefined ? 'true' : undefined}
        aria-controls={this.menu?.identifier ?? this.menu?.id}
        aria-expanded={isMenuDefined ? hasExpanded : undefined}
        aria-checked={isCheckedDefined ? isChecked : undefined}
        onClick={this.onClick.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onTouchStart={this.onTouchStart.bind(this)}
        onTouchEnd={this.onTouchEnd.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
        ref={el => {
          this.menuItem = el;
        }}
      >
        {showCheckedIcon && (
          <vm-icon name={this.checkIcon!} library={this.icons} />
        )}
        {showLeftNavArrow && <span class="arrow left" />}
        {this.label}
        {hasSpacer && <span class="spacer" />}
        {showHint && <span class="hint">{this.hint}</span>}
        {showBadge && <span class="badge">{this.badge}</span>}
        {showRightNavArrow && <span class="arrow right" />}
      </div>
    );
  }
}
