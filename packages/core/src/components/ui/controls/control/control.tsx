import {
  h, Component, Prop, State, Element,
  Event, EventEmitter, Watch, Method,
} from '@stencil/core';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { isNull, isUndefined } from '../../../../utils/unit';
import { Disposal } from '../../../../utils/Disposal';
import { listen } from '../../../../utils/dom';
import { KeyboardControl } from './KeyboardControl';
import { findPlayer } from '../../../core/player/findPlayer';
import { withPlayerContext } from '../../../core/player/withPlayerContext';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';

/**
 * @slot - Used to pass in the content of the control (text/icon/tooltip).
 */
@Component({
  tag: 'vm-control',
  styleUrl: 'control.css',
  shadow: true,
})
export class Control implements KeyboardControl {
  private button!: HTMLButtonElement;

  private keyboardDisposal = new Disposal();

  @Element() host!: HTMLVmControlElement;

  @State() describedBy?: string;

  @State() showTapHighlight = false;

  /** @inheritdoc */
  @Prop() keys?: string;

  @Watch('keys')
  async onKeysChange() {
    this.keyboardDisposal.empty();
    if (isUndefined(this.keys)) return;

    const player = await findPlayer(this);
    const codes = (this.keys! as string).split('/');

    this.keyboardDisposal.add(listen(player, 'keydown', (event: KeyboardEvent) => {
      if (codes.includes(event.key)) { this.button.click(); }
    }));
  }

  /**
   * The `id` attribute of the control.
   */
  @Prop() identifier?: string;

  /**
   * Whether the control should be displayed or not.
   */
  @Prop() hidden = false;

  /**
   * The `aria-label` property of the control.
   */
  @Prop() label!: string;

  /**
   * If the control has a popup menu, then this should be the `id` of said menu. Sets the
   * `aria-controls` property.
   */
  @Prop() menu?: string;

  /**
   * If the control has a popup menu, this indicates whether the menu is open or not. Sets the
   * `aria-expanded` property.
   */
  @Prop() expanded?: boolean;

  /**
   * If the control is a toggle, this indicated whether the control is in a "pressed" state or not.
   * Sets the `aria-pressed` property.
   */
  @Prop() pressed?: boolean;

  /** @internal */
  @Prop() isTouch: PlayerProps['isTouch'] = false;

  /**
   * Emitted when the user is interacting with the control by focusing, touching or hovering on it.
   */
  @Event() vmInteractionChange!: EventEmitter<boolean>;

  /**
   * Emitted when the control receives focus.
   */
  @Event() vmFocus!: EventEmitter<void>;

  /**
   * Emitted when the control loses focus.
   */
  @Event() vmBlur!: EventEmitter<void>;

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, ['isTouch']);
  }

  connectedCallback() {
    this.findTooltip();
    this.onKeysChange();
  }

  componentWillLoad() {
    this.findTooltip();
  }

  disconnectedCallback() {
    this.keyboardDisposal.empty();
  }

  /**
   * Focuses the control.
   */
  @Method()
  async focusControl() {
    this.button?.focus();
  }

  /**
   * Removes focus from the control.
   */
  @Method()
  async blurControl() {
    this.button?.blur();
  }

  private onTouchStart() {
    this.showTapHighlight = true;
  }

  private onTouchEnd() {
    setTimeout(() => { this.showTapHighlight = false; }, 100);
  }

  private findTooltip() {
    const tooltip = this.host.querySelector('vm-tooltip');
    if (!isNull(tooltip)) this.describedBy = tooltip!.id;
    return tooltip;
  }

  private onShowTooltip() {
    const tooltip = this.findTooltip();
    if (!isNull(tooltip)) tooltip!.active = true;
    this.vmInteractionChange.emit(true);
  }

  private onHideTooltip() {
    const tooltip = this.findTooltip();
    if (!isNull(tooltip)) tooltip!.active = false;
    this.button.blur();
    this.vmInteractionChange.emit(false);
  }

  private onFocus() {
    this.vmFocus.emit();
    this.onShowTooltip();
  }

  private onBlur() {
    this.vmBlur.emit();
    this.onHideTooltip();
  }

  private onMouseEnter() {
    this.onShowTooltip();
  }

  private onMouseLeave() {
    this.onHideTooltip();
  }

  render() {
    return (
      <button
        class={{
          hidden: this.hidden,
          notTouch: !this.isTouch,
          tapHighlight: this.showTapHighlight,
        }}
        id={this.identifier}
        type="button"
        aria-label={this.label}
        aria-haspopup={!isUndefined(this.menu) ? 'true' : undefined}
        aria-controls={this.menu}
          // eslint-disable-next-line no-nested-ternary
        aria-expanded={!isUndefined(this.menu) ? (this.expanded ? 'true' : 'false') : undefined}
          // eslint-disable-next-line no-nested-ternary
        aria-pressed={!isUndefined(this.pressed) ? (this.pressed ? 'true' : 'false') : undefined}
        aria-hidden={this.hidden ? 'true' : 'false'}
        aria-describedby={this.describedBy}
        onTouchStart={this.onTouchStart.bind(this)}
        onTouchEnd={this.onTouchEnd.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
        ref={(el: any) => { this.button = el; }}
      >
        <slot />
      </button>
    );
  }
}
