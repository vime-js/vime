import { Component, h, Host, Prop, State, Watch } from '@stencil/core';

import { isUndefined } from '../../../../utils/unit';
import { PlayerProps } from '../../../core/player/PlayerProps';
import {
  getPlayerFromRegistry,
  withComponentRegistry,
} from '../../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../../core/player/withPlayerContext';
import { TooltipDirection, TooltipPosition } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';

/**
 * A control for toggling fullscreen mode. This control is not displayed if fullscreen cannot be
 * requested (checked via the `canSetFullscreen()` player method).
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/src/components/ui/controls/fullscreen-control/fullscreen-control.png"
 *   alt="Vime fullscreen control component"
 * />
 */
@Component({
  tag: 'vm-fullscreen-control',
  styleUrl: 'fullscreen-control.css',
  shadow: true,
})
export class FullscreenControl implements KeyboardControl {
  @State() canSetFullscreen = false;

  /**
   * The name of the enter fullscreen icon to resolve from the icon library.
   */
  @Prop() enterIcon = 'fullscreen-enter';

  /**
   * The name of the exit fullscreen icon to resolve from the icon library.
   */
  @Prop() exitIcon = 'fullscreen-exit';

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
  @Prop() keys?: string = 'f';

  /** @internal */
  @Prop() isFullscreenActive: PlayerProps['isFullscreenActive'] = false;

  /** @internal */
  @Prop() i18n: PlayerProps['i18n'] = {};

  /** @internal */
  @Prop() playbackReady: PlayerProps['playbackReady'] = false;

  @Watch('playbackReady')
  async onPlaybackReadyChange() {
    const player = getPlayerFromRegistry(this);
    this.canSetFullscreen = (await player?.canSetFullscreen()) ?? false;
  }

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, ['isFullscreenActive', 'playbackReady', 'i18n']);
  }

  componentDidLoad() {
    this.onPlaybackReadyChange();
  }

  private onClick() {
    const player = getPlayerFromRegistry(this);
    !this.isFullscreenActive
      ? player?.enterFullscreen()
      : player?.exitFullscreen();
  }

  render() {
    const tooltip = this.isFullscreenActive
      ? this.i18n.exitFullscreen
      : this.i18n.enterFullscreen;
    const tooltipWithHint = !isUndefined(this.keys)
      ? `${tooltip} (${this.keys})`
      : tooltip;

    return (
      <Host hidden={!this.canSetFullscreen}>
        <vm-control
          label={this.i18n.fullscreen}
          keys={this.keys}
          pressed={this.isFullscreenActive}
          hidden={!this.canSetFullscreen}
          onClick={this.onClick.bind(this)}
        >
          <vm-icon
            name={this.isFullscreenActive ? this.exitIcon : this.enterIcon}
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
      </Host>
    );
  }
}
