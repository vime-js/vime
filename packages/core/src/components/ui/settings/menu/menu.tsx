import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Method,
  Prop,
  State,
  Watch,
  writeTask,
} from '@stencil/core';

import { isUndefined } from '../../../../utils/unit';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
import { menuItemHunter } from './menuItemHunter';

/**
 * A multi-purpose interactable element inside a menu. The behaviour and style of the item depends
 * on the props set.
 *
 * - **Default:** By default, the menu item only contains a label and optional hint/badge text that is
 * displayed on the right-hand side of the item.
 *
 * - **Navigation:** If the `menu` prop is set, the item behaves as a navigational control and displays
 * arrows to indicate whether clicking the control will navigate forwards/backwards.
 *
 * - **Radio:** If the `checked` prop is set, the item behaves as a radio button and displays a
 * checkmark icon to indicate whether it is checked or not.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/src/components/ui/settings/menu-item/menu-item.png"
 *   alt="Vime settings menu item component"
 * />
 *
 * @slot - Used to pass in the body of the menu which usually contains menu items, radio groups
 * and/or submenus.
 */
@Component({
  tag: 'vm-menu',
  styleUrl: 'menu.css',
  shadow: true,
})
export class Menu {
  private menu?: HTMLDivElement;

  private hasDisconnected = false;

  container?: HTMLDivElement;

  @Element() host!: HTMLVmMenuElement;

  @State() activeMenuItem?: HTMLVmMenuItemElement;

  @Watch('activeMenuItem')
  onActiveMenuitemChange() {
    this.vmActiveMenuItemChange.emit(this.activeMenuItem);
  }

  @State() activeSubmenu?: HTMLVmSubmenuElement;

  @Watch('activeSubmenu')
  onActiveSubmenuChange() {
    this.vmActiveSubmenuChange.emit(this.activeSubmenu);
  }

  /**
   * Whether the menu is open/visible.
   */
  @Prop({ mutable: true, reflect: true }) active = false;

  @Watch('active')
  onActiveChange() {
    if (this.hasDisconnected) return;
    this.active ? this.vmOpen.emit(this.host) : this.vmClose.emit(this.host);
    if (this.controller?.tagName.toLowerCase() === 'vm-menu-item') {
      (this.controller as HTMLVmMenuItemElement).expanded = true;
    }
  }

  /**
   * The `id` attribute of the menu.
   */
  @Prop() identifier!: string;

  /**
   * Reference to the controller DOM element that is responsible for opening/closing this menu.
   */
  @Prop() controller?: HTMLElement;

  /**
   * The direction the menu should slide in from.
   */
  @Prop() slideInDirection?: 'left' | 'right';

  /**
   * Emitted when the menu is open/active.
   */
  @Event() vmOpen!: EventEmitter<HTMLVmMenuElement>;

  /**
   * Emitted when the menu has closed/is not active.
   */
  @Event() vmClose!: EventEmitter<HTMLVmMenuElement>;

  /**
   * Emitted when the menu is focused.
   */
  @Event() vmFocus!: EventEmitter<void>;

  /**
   * Emitted when the menu loses focus.
   */
  @Event() vmBlur!: EventEmitter<void>;

  /**
   * Emitted when the active submenu changes.
   */
  @Event() vmActiveSubmenuChange!: EventEmitter<
    HTMLVmSubmenuElement | undefined
  >;

  /**
   * Emitted when the currently focused menu item changes.
   */
  @Event() vmActiveMenuItemChange!: EventEmitter<
    HTMLVmMenuItemElement | undefined
  >;

  /**
   * Emitted when the height of the menu changes.
   */
  @Event({ bubbles: false }) vmMenuHeightChange!: EventEmitter<number>;

  constructor() {
    withComponentRegistry(this);
  }

  connectedCallback() {
    this.hasDisconnected = false;
  }

  componentDidRender() {
    writeTask(() => {
      if (!this.hasDisconnected) this.calculateHeight();
    });
  }

  disconnectedCallback() {
    this.controller = undefined;
    this.hasDisconnected = true;
  }

  /**
   * Focuses the menu.
   */
  @Method()
  async focusMenu() {
    this.menu?.focus();
  }

  /**
   * Removes focus from the menu.
   */
  @Method()
  async blurMenu() {
    this.menu?.blur();
  }

  /**
   * Returns the currently focused menu item.
   */
  @Method()
  async getActiveMenuItem() {
    return this.activeMenuItem;
  }

  /**
   * Sets the currently focused menu item.
   */
  @Method()
  async setActiveMenuItem(item?: HTMLVmMenuItemElement) {
    item?.focusItem();
    this.activeMenuItem = item;
  }

  /**
   * Calculates the height of the settings menu based on its children.
   */
  @Method()
  async calculateHeight() {
    let height = 0;

    if (this.activeSubmenu) {
      const submenu = await this.activeSubmenu.getMenu();
      height = (await submenu?.calculateHeight()) ?? 0;
      height += await this.activeSubmenu.getControllerHeight();
    } else {
      const children = (this.container
        ?.firstChild as HTMLSlotElement).assignedElements({ flatten: true });

      children?.forEach(child => {
        height += parseFloat(window.getComputedStyle(child).height);
      });
    }

    this.vmMenuHeightChange.emit(height);
    return height;
  }

  @Listen('vmOpenSubmenu')
  onOpenSubmenu(event: CustomEvent<HTMLVmSubmenuElement>) {
    event.stopPropagation();
    if (!isUndefined(this.activeSubmenu)) this.activeSubmenu.active = false;
    this.activeSubmenu = event.detail;
    this.getChildren().forEach(child => {
      if (child !== this.activeSubmenu) {
        child.style.opacity = '0';
        child.style.visibility = 'hidden';
      }
    });
    writeTask(() => {
      this.activeSubmenu!.active = true;
    });
  }

  @Listen('vmCloseSubmenu')
  onCloseSubmenu(event?: Event) {
    event?.stopPropagation();
    if (!isUndefined(this.activeSubmenu)) this.activeSubmenu.active = false;
    this.getChildren().forEach(child => {
      if (child !== this.activeSubmenu) {
        child.style.opacity = '';
        child.style.visibility = '';
      }
    });
    writeTask(() => {
      this.activeSubmenu = undefined;
    });
  }

  @Listen('click', { target: 'window' })
  onWindowClick() {
    this.onCloseSubmenu();
    this.onClose();
  }

  @Listen('keydown', { target: 'window' })
  onWindowKeyDown(event: KeyboardEvent) {
    if (this.active && event.key === 'Escape') {
      this.onCloseSubmenu();
      this.onClose();
      this.focusController();
    }
  }

  private getChildren() {
    const assignedElements = this.host
      .shadowRoot!.querySelector('slot')
      ?.assignedElements({ flatten: true });

    return (assignedElements ?? []) as HTMLElement[];
  }

  private getMenuItems() {
    const assignedElements = this.host
      .shadowRoot!.querySelector('slot')
      ?.assignedElements({ flatten: true });
    return menuItemHunter(assignedElements);
  }

  private focusController() {
    if (!isUndefined((this.controller as HTMLVmMenuItemElement)?.focusItem)) {
      (this.controller as HTMLVmMenuItemElement)?.focusItem();
    } else if (
      !isUndefined((this.controller as HTMLVmControlElement)?.focusControl)
    ) {
      (this.controller as HTMLVmControlElement)?.focusControl();
    } else {
      this.controller?.focus();
    }
  }

  private triggerMenuItem() {
    if (isUndefined(this.activeMenuItem)) return;
    this.activeMenuItem.click();
    // If it controls a menu then focus it essentially opening it.
    this.activeMenuItem!.menu?.focusMenu();
  }

  private onClose() {
    this.activeMenuItem = undefined;
    this.active = false;
  }

  private onClick(event: Event) {
    // Stop the event from propagating while playing with menu so that when it is clicked outside
    // the menu we can close it in the `onWindowClick` handler above.
    event.stopPropagation();
  }

  private onFocus() {
    this.active = true;
    [this.activeMenuItem] = this.getMenuItems();
    this.activeMenuItem?.focusItem();
    this.vmFocus.emit();
  }

  private onBlur() {
    this.vmBlur.emit();
  }

  private foucsMenuItem(items: HTMLVmMenuItemElement[], index: number) {
    if (index < 0) index = items.length - 1;
    if (index > items.length - 1) index = 0;
    this.activeMenuItem = items[index];
    this.activeMenuItem.focusItem();
  }

  private onKeyDown(event: KeyboardEvent) {
    if (!this.active) return;
    event.preventDefault();
    event.stopPropagation();

    const items = this.getMenuItems();
    let index = items.findIndex(item => item === this.activeMenuItem);

    switch (event.key) {
      case 'Escape':
        this.onClose();
        this.focusController();
        break;
      case 'ArrowDown':
      case 'Tab':
        this.foucsMenuItem(items, (index += 1));
        break;
      case 'ArrowUp':
        this.foucsMenuItem(items, (index -= 1));
        break;
      case 'ArrowLeft':
        this.onClose();
        this.focusController();
        break;
      case 'ArrowRight':
      case 'Enter':
      case ' ':
        this.triggerMenuItem();
        break;
      case 'Home':
      case 'PageUp':
        this.foucsMenuItem(items, 0);
        break;
      case 'End':
      case 'PageDown':
        this.foucsMenuItem(items, items.length - 1);
        break;
    }
  }

  render() {
    return (
      <div
        id={this.identifier}
        class={{
          menu: true,
          slideIn: !isUndefined(this.slideInDirection),
          slideInFromLeft: this.slideInDirection === 'left',
          slideInFromRight: this.slideInDirection === 'right',
        }}
        role="menu"
        tabindex="-1"
        aria-labelledby={
          (this.controller as HTMLVmMenuItemElement)?.identifier ??
          this.controller?.id
        }
        aria-hidden={!this.active ? 'true' : 'false'}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onClick={this.onClick.bind(this)}
        onKeyDown={this.onKeyDown.bind(this)}
        ref={el => {
          this.menu = el;
        }}
      >
        <div
          class="container"
          ref={el => {
            this.container = el;
          }}
        >
          <slot />
        </div>
      </div>
    );
  }
}
