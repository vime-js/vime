import {
  h, Component, Prop, Event, EventEmitter,
} from '@stencil/core';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { withPlayerContext } from '../../../core/player/withPlayerContext';
import { Dispatcher, createDispatcher } from '../../../core/player/PlayerDispatcher';
import { TooltipDirection, TooltipPosition } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
import { isUndefined } from '../../../../utils/unit';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';

@Component({
  tag: 'vm-mute-control',
  shadow: true,
})
export class MuteControl implements KeyboardControl {
  private dispatch!: Dispatcher;

  /**
   * The name of the low volume icon to resolve from the icon library.
   */
  @Prop() lowVolumeIcon = 'volume-low';

  /**
   * The name of the high volume icon to resolve from the icon library.
   */
  @Prop() highVolumeIcon = 'volume-high';

  /**
   * The name of the muted volume icon to resolve from the icon library.
   */
  @Prop() mutedIcon = 'volume-mute';

  /**
   * The name of an icon library to use. Defaults to the library defined by the `icons` player
   * property.
   */
  @Prop() icons?: string;

  /**
   * Whether the tooltip is positioned above/below the control.
   */
  @Prop() tooltipPosition: TooltipPosition = 'top';

  /**
   * The direction in which the tooltip should grow.
   */
  @Prop() tooltipDirection: TooltipDirection;

  /**
   * Whether the tooltip should not be displayed.
   */
  @Prop() hideTooltip = false;

  /** @inheritdoc */
  @Prop() keys?: string = 'm';

  /** @internal */
  @Prop() volume: PlayerProps['volume'] = 50;

  /** @internal */
  @Prop() muted: PlayerProps['muted'] = false;

  /** @internal */
  @Prop() i18n: PlayerProps['i18n'] = {};

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
    withPlayerContext(this, ['muted', 'volume', 'i18n']);
  }

  connectedCallback() {
    this.dispatch = createDispatcher(this);
  }

  private getIcon() {
    const volumeIcon = (this.volume < 50) ? this.lowVolumeIcon : this.highVolumeIcon;
    return (this.muted || (this.volume === 0)) ? this.mutedIcon : volumeIcon;
  }

  private onClick() {
    this.dispatch('muted', !this.muted);
  }

  render() {
    const tooltip = this.muted ? this.i18n.unmute : this.i18n.mute;
    const tooltipWithHint = !isUndefined(this.keys) ? `${tooltip} (${this.keys})` : tooltip;

    return (
      <vm-control
        label={this.i18n.mute}
        pressed={this.muted}
        keys={this.keys}
        onClick={this.onClick.bind(this)}
      >
        <vm-icon name={this.getIcon()} library={this.icons} />

        <vm-tooltip
          hidden={this.hideTooltip}
          position={this.tooltipPosition}
          direction={this.tooltipDirection}
        >
          {tooltipWithHint}
        </vm-tooltip>
      </vm-control>
    );
  }
}
