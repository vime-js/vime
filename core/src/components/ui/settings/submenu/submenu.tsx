import {
  h,
  Component,
  Prop,
  EventEmitter,
  Event,
  Method,
  State,
  Element,
  writeTask,
} from '@stencil/core';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';

let idCount = 0;

/**
 * @slot - Used to pass in the body of the submenu which is usually a set of choices in the form
 * of a radio group (`vm-menu-radio-group`).
 */
@Component({
  tag: 'vm-submenu',
  shadow: true,
})
export class Submenu {
  private id!: string;

  @Element() host!: HTMLVmSubmenuElement;

  @State() menu?: HTMLVmMenuElement;

  @State() controller?: HTMLVmMenuItemElement;

  /**
   * The title of the submenu.
   */
  @Prop() label!: string;

  /**
   * This can provide additional context about the current state of the submenu. For example, the
   * hint could be the currently selected option if the submenu contains a radio group.
   */
  @Prop() hint?: string;

  /**
   * The direction the submenu should slide in from.
   */
  @Prop() slideInDirection?: 'left' | 'right' = 'right';

  /**
   * Whether the submenu is open/closed.
   */
  @Prop({ mutable: true, reflect: true }) active = false;

  /**
   * Emitted when the submenu is open/active.
   */
  @Event() vmOpenSubmenu!: EventEmitter<HTMLVmSubmenuElement>;

  /**
   * Emitted when the submenu has closed/is not active.
   */
  @Event() vmCloseSubmenu!: EventEmitter<HTMLVmSubmenuElement>;

  constructor() {
    withComponentRegistry(this);
  }

  connectedCallback() {
    this.genId();
  }

  /**
   * Returns the controller (`vm-menu-item`) for this submenu.
   */
  @Method()
  async getController() {
    return this.controller;
  }

  /**
   * Returns the menu (`vm-menu`) for this submenu.
   */
  @Method()
  async getMenu() {
    return this.menu;
  }

  /**
   * Returns the height of the submenu controller.
   */
  @Method()
  async getControllerHeight() {
    return this.controller?.getHeight() ?? 0;
  }

  private getControllerHeightSync() {
    const el = this.controller?.shadowRoot!.querySelector("[role='menuitem']")!;
    return el ? parseFloat(window.getComputedStyle(el).height) : 0;
  }

  private onMenuOpen() {
    this.active = true;
    this.vmOpenSubmenu.emit(this.host);
  }

  private onMenuClose() {
    this.active = false;
    this.vmCloseSubmenu.emit(this.host);
  }

  private genId() {
    idCount += 1;
    this.id = `vm-submenu-${idCount}`;
  }

  private getControllerId() {
    return `${this.id}-controller`;
  }

  render() {
    return (
      <div>
        <vm-menu-item
          identifier={this.getControllerId()}
          menu={this.menu}
          label={this.label}
          hint={this.hint}
          expanded={this.active}
          ref={(el) => {
            writeTask(() => {
              this.controller = el;
            });
          }}
        />
        <vm-menu
          identifier={this.id}
          controller={this.controller}
          active={this.active}
          slideInDirection={this.slideInDirection}
          onVmOpen={this.onMenuOpen.bind(this)}
          onVmClose={this.onMenuClose.bind(this)}
          ref={(el) => {
            writeTask(() => {
              this.menu = el;
            });
          }}
          style={{ top: `${this.getControllerHeightSync() + 1}px` }}
        >
          <slot />
        </vm-menu>
      </div>
    );
  }
}
