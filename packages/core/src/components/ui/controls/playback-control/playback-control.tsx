import { Component, h, Prop } from '@stencil/core';

import { isUndefined } from '../../../../utils/unit';
import {
  createDispatcher,
  Dispatcher,
} from '../../../core/player/PlayerDispatcher';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../../core/player/withPlayerContext';
import { TooltipDirection, TooltipPosition } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';

/**
 * A control for toggling the playback state (play/pause) of the current media.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/playback-control/playback-control.png"
 *   alt="Vime playback control component"
 * />
 */
@Component({
  tag: 'vm-playback-control',
  shadow: true,
})
export class PlaybackControl implements KeyboardControl {
  private dispatch!: Dispatcher;

  /**
   * The name of the play icon to resolve from the icon library.
   */
  @Prop() playIcon = 'play';

  /**
   * The name of the pause icon to resolve from the icon library.
   */
  @Prop() pauseIcon = 'pause';

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
  @Prop() keys?: string = 'k';

  /** @internal */
  @Prop() paused: PlayerProps['paused'] = true;

  /** @internal */
  @Prop() i18n: PlayerProps['i18n'] = {};

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, ['paused', 'i18n']);
  }

  connectedCallback() {
    this.dispatch = createDispatcher(this);
  }

  private onClick() {
    this.dispatch('paused', !this.paused);
  }

  render() {
    const tooltip = this.paused ? this.i18n.play : this.i18n.pause;
    const tooltipWithHint = !isUndefined(this.keys)
      ? `${tooltip} (${this.keys})`
      : tooltip;

    return (
      <vm-control
        label={this.i18n.playback}
        keys={this.keys}
        pressed={!this.paused}
        onClick={this.onClick.bind(this)}
      >
        <vm-icon
          name={this.paused ? this.playIcon : this.pauseIcon}
          library={this.icons}
        />

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
