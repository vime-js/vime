import {
  h, Host, Component, Prop, State, Watch,
} from '@stencil/core';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { withPlayerContext } from '../../../core/player/PlayerContext';
import { TooltipDirection } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
import { isUndefined } from '../../../../utils/unit';
import { findRootPlayer } from '../../../core/player/utils';

@Component({
  tag: 'vime-fullscreen-control',
  styleUrl: 'fullscreen-control.css',
})
export class FullscreenControl implements KeyboardControl {
  @State() canSetFullscreen = false;

  /**
   * The URL to an SVG element or fragment to display for entering fullscreen.
   */
  @Prop() enterIcon = '#vime-enter-fullscreen';

  /**
   * The URL to an SVG element or fragment to display for exiting fullscreen.
   */
  @Prop() exitIcon = '#vime-exit-fullscreen';

  /**
   * The direction in which the tooltip should grow.
   */
  @Prop() tooltipDirection: TooltipDirection;

  /**
   * Whether the tooltip should not be displayed.
   */
  @Prop() hideTooltip = false;

  /**
   * Scale the size of the control up/down by the amount given.
   */
  @Prop() scale = 1;

  /**
   * @inheritdoc
   */
  @Prop() keys?: string = 'f';

  /**
   * @internal
   */
  @Prop() isFullscreenActive: PlayerProps['isFullscreenActive'] = false;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps['i18n'] = {};

  /**
   * @internal
   */
  @Prop() playbackReady: PlayerProps['playbackReady'] = false;

  @Watch('playbackReady')
  async onPlaybackReadyChange() {
    const player = findRootPlayer(this);
    this.canSetFullscreen = await player.canSetFullscreen();
  }

  private onClick() {
    const player = findRootPlayer(this);
    !this.isFullscreenActive ? player.enterFullscreen() : player.exitFullscreen();
  }

  render() {
    const tooltip = this.isFullscreenActive ? this.i18n.exitFullscreen : this.i18n.enterFullscreen;
    const tooltipWithHint = !isUndefined(this.keys) ? `${tooltip} (${this.keys})` : tooltip;

    return (
      <Host
        class={{
          hidden: !this.canSetFullscreen,
        }}
      >
        <vime-control
          scale={this.scale}
          label={this.i18n.fullscreen}
          keys={this.keys}
          pressed={this.isFullscreenActive}
          hidden={!this.canSetFullscreen}
          onClick={this.onClick.bind(this)}
        >
          <vime-icon href={this.isFullscreenActive ? this.exitIcon : this.enterIcon} />

          <vime-tooltip
            hidden={this.hideTooltip}
            direction={this.tooltipDirection}
          >
            {tooltipWithHint}
          </vime-tooltip>
        </vime-control>
      </Host>
    );
  }
}

withPlayerContext(FullscreenControl, [
  'isFullscreenActive',
  'playbackReady',
  'i18n',
]);
