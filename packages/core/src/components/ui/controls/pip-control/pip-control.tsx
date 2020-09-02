import {
  h, Host, Component, Prop, Watch, State,
} from '@stencil/core';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { withPlayerContext } from '../../../core/player/PlayerContext';
import { TooltipDirection } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
import { isUndefined } from '../../../../utils/unit';
import { findRootPlayer } from '../../../core/player/utils';

@Component({
  tag: 'vime-pip-control',
  styleUrl: 'pip-control.css',
})
export class PiPControl implements KeyboardControl {
  @State() canSetPiP = false;

  /**
   * The URL to an SVG element or fragment to display for entering PiP.
   */
  @Prop() enterIcon = '#vime-enter-pip';

  /**
   * The URL to an SVG element or fragment to display for exiting PiP.
   */
  @Prop() exitIcon = '#vime-exit-pip';

  /**
   * The direction in which the tooltip should grow.
   */
  @Prop() tooltipDirection: TooltipDirection;

  /**
   * Whether the tooltip should not be displayed.
   */
  @Prop() hideTooltip = false;

  /**
   * @inheritdoc
   */
  @Prop() keys?: string = 'p';

  /**
   * @internal
   */
  @Prop() isPiPActive: PlayerProps['isPiPActive'] = false;

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
    this.canSetPiP = await player.canSetPiP();
  }

  private onClick() {
    const player = findRootPlayer(this);
    !this.isPiPActive ? player.enterPiP() : player.exitPiP();
  }

  render() {
    const tooltip = this.isPiPActive ? this.i18n.exitPiP : this.i18n.enterPiP;
    const tooltipWithHint = !isUndefined(this.keys) ? `${tooltip} (${this.keys})` : tooltip;

    return (
      <Host
        class={{
          hidden: !this.canSetPiP,
        }}
      >
        <vime-control
          label={this.i18n.pip}
          keys={this.keys}
          pressed={this.isPiPActive}
          hidden={!this.canSetPiP}
          onClick={this.onClick.bind(this)}
        >
          <vime-icon href={this.isPiPActive ? this.exitIcon : this.enterIcon} />

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

withPlayerContext(PiPControl, [
  'isPiPActive',
  'playbackReady',
  'i18n',
]);
