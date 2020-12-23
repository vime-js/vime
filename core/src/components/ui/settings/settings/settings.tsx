import {
  h,
  Component,
  Prop,
  Watch,
  Method,
  Element,
  State,
} from '@stencil/core';
import { Disposal } from '../../../../utils/Disposal';
import { listen } from '../../../../utils/dom';
import { isUndefined } from '../../../../utils/unit';
import { SettingsController } from './SettingsController';
import {
  Dispatcher,
  createDispatcher,
} from '../../../core/player/PlayerDispatcher';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { withPlayerContext } from '../../../core/player/withPlayerContext';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
import { withControlsCollisionDetection } from '../../controls/controls/withControlsCollisionDetection';

let idCount = 0;

/**
 * @slot - Used to pass in the body of the settings menu, which usually contains submenus.
 */
@Component({
  tag: 'vm-settings',
  styleUrl: 'settings.css',
  shadow: true,
})
export class Settings {
  private id!: string;

  private menu!: HTMLVmMenuElement;

  private disposal = new Disposal();

  private controller?: SettingsController;

  private dispatch!: Dispatcher;

  @Element() host!: HTMLVmSettingsElement;

  @State() menuHeight = 0;

  /**
   * Pins the settings to the defined position inside the video player. This has no effect when
   * the view is of type `audio` (always `bottomRight`) and on mobile devices (always bottom sheet).
   */
  @Prop({
    reflect: true,
  })
  pin: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' = 'bottomRight';

  /**
   * Whether the settings menu is opened/closed.
   */
  @Prop({ mutable: true, reflect: true }) active = false;

  @Watch('active')
  onActiveChange() {
    this.dispatch('isSettingsActive', this.active);
    if (isUndefined(this.controller)) return;
    this.controller!.expanded = this.active;
  }

  /** @internal */
  @Prop() isMobile: PlayerProps['isMobile'] = false;

  /** @internal */
  @Prop() isAudioView: PlayerProps['isAudioView'] = false;

  constructor() {
    withComponentRegistry(this);
    withControlsCollisionDetection(this);
    withPlayerContext(this, ['isMobile', 'isAudioView']);
  }

  connectedCallback() {
    this.dispatch = createDispatcher(this);
    idCount += 1;
    this.id = `vm-settings-${idCount}`;
  }

  disconnectedCallback() {
    this.disposal.empty();
  }

  /**
   * Sets the controller responsible for opening/closing this settings menu.
   */
  @Method()
  async setController(controller: SettingsController) {
    this.controller = controller;
    this.controller.menu = this.id;
    this.disposal.empty();
    this.disposal.add(
      listen(this.controller, 'click', () => {
        this.active = !this.active;
      }),
    );
    this.disposal.add(
      listen(this.controller, 'keydown', (event: KeyboardEvent) => {
        if (event.key !== 'Enter') return;
        // We're looking for !active because the `click` event above will toggle it to active.
        if (!this.active) this.menu.focusMenu();
      }),
    );
  }

  private getPosition() {
    if (this.isAudioView) {
      return {
        right: '0',
        bottom: 'calc(var(--vm-controls-height, 0) + 4px)',
      };
    }

    // topLeft => { top: 0, left: 0 }
    const pos = this.pin.split(/(?=[L|R])/).map((s) => s.toLowerCase());
    return {
      [pos.includes('top') ? 'top' : 'bottom']: 'var(--vm-controls-height, 0)',
      [pos.includes('left') ? 'left' : 'right']: '8px',
    };
  }

  private onOpen(event: CustomEvent<HTMLVmMenuElement>) {
    if (event.detail?.identifier !== this.id) return;
    this.active = true;
  }

  private onClose(event: CustomEvent<HTMLVmMenuElement>) {
    if (event.detail?.identifier !== this.id) return;
    this.active = false;
  }

  private onHeightChange(event: CustomEvent<number>) {
    this.menuHeight = event.detail;
  }

  render() {
    return (
      <div
        style={{
          ...this.getPosition(),
        }}
        class={{
          settings: true,
          active: this.active,
          mobile: this.isMobile,
        }}
      >
        <div class="container" style={{ height: `${this.menuHeight}px` }}>
          <vm-menu
            identifier={this.id}
            active={this.active}
            controller={this.controller}
            onVmOpen={this.onOpen.bind(this)}
            onVmClose={this.onClose.bind(this)}
            onVmMenuHeightChange={this.onHeightChange.bind(this)}
            ref={(el: any) => {
              this.menu = el;
            }}
          >
            <slot />
          </vm-menu>
        </div>
      </div>
    );
  }
}
