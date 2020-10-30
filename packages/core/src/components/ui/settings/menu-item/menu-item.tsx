/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/role-supports-aria-props */

import {
  h, Host, Component, Prop, State, Element,
} from '@stencil/core';
import { isUndefined, isNull } from '../../../../utils/unit';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { withPlayerContext } from '../../../core/player/PlayerContext';

@Component({
  tag: 'vime-menu-item',
  styleUrl: 'menu-item.scss',
})
export class MenuItem {
  @Element() el!: HTMLVimeMenuItemElement;

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
   * If the item has a popup menu, then this should be the `id` of said menu. Sets the
   * `aria-controls` property.
   */
  @Prop() menu?: string;

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
   * The URL to an SVG element or fragment to load.
   */
  @Prop() checkedIcon?: string = '#vime-checkmark';

  /**
   * @internal
   */
  @Prop() isTouch: PlayerProps['isTouch'] = false;

  constructor() {
    withPlayerContext(this, ['isTouch']);
  }

  private onClick() {
    if (isUndefined(this.menu)) return;
    const submenu = document.querySelector(`#${this.menu}`) as HTMLVimeMenuElement;
    if (!isNull(submenu)) submenu!.active = !this.expanded;
  }

  private onTouchStart() {
    this.showTapHighlight = true;
    setTimeout(() => { this.showTapHighlight = false; }, 100);
  }

  private onMouseLeave() {
    this.el.blur();
  }

  render() {
    const isCheckedDefined = !isUndefined(this.checked);
    const isMenuDefined = !isUndefined(this.menu);
    const hasExpanded = this.expanded ? 'true' : 'false';
    const isChecked = this.checked ? 'true' : 'false';
    const showCheckedIcon = isCheckedDefined && !isUndefined(this.checkedIcon);
    const showLeftNavArrow = isMenuDefined && this.expanded;
    const showRightNavArrow = isMenuDefined && !this.expanded;
    const showHint = !isUndefined(this.hint)
      && !isCheckedDefined
      && (!isMenuDefined || !this.expanded);
    const showBadge = !isUndefined(this.badge) && (!showHint && !showRightNavArrow);
    const hasSpacer = showHint || showBadge || showRightNavArrow;

    return (
      <Host
        class={{
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
        aria-controls={this.menu}
        aria-expanded={isMenuDefined ? hasExpanded : undefined}
        aria-checked={isCheckedDefined ? isChecked : undefined}
        onClick={this.onClick.bind(this)}
        onTouchStart={this.onTouchStart.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
      >
        {showCheckedIcon && <vime-icon href={this.checkedIcon!} />}
        {showLeftNavArrow && <span class="arrow left" />}
        {this.label}
        {hasSpacer && <span class="spacer" />}
        {showHint && <span class="hint">{this.hint}</span>}
        {showBadge && <span class="badge">{this.badge}</span>}
        {showRightNavArrow && <span class="arrow right" />}
      </Host>
    );
  }
}
