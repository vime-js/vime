import {
  h, Host, Component, Prop, Watch, State,
} from '@stencil/core';
import { PlayerProps, PlayerProp } from '../../../core/player/PlayerProp';
import { openPlayerWormhole } from '../../../core/player/PlayerWormhole';
import { PlayerStateDispatcher, createPlayerStateDispatcher } from '../../../core/player/PlayerState';
import { TooltipDirection } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
import { isUndefined } from '../../../../utils/unit';
import { findRootPlayer } from '../../../core/player/utils';

@Component({
  tag: 'vime-pip-control',
  styleUrl: 'pip-control.css',
})
export class PiPControl implements KeyboardControl {
  private dispatch!: PlayerStateDispatcher;

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
  @Prop() keyCodes?: string = '80';

  /**
   * @inheritdoc
   */
  @Prop() keyboardHint?: string = '(p)';

  /**
   * @internal
   */
  @Prop() isPiPActive: PlayerProps[PlayerProp.IsPiPActive] = false;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps[PlayerProp.I18N] = {};

  /**
   * @internal
   */
  @Prop() playbackReady: PlayerProps[PlayerProp.PlaybackReady] = false;

  @Watch('playbackReady')
  async onPlaybackReadyChange() {
    const player = findRootPlayer(this);
    this.canSetPiP = await player.canSetPiP();
  }

  connectedCallback() {
    this.dispatch = createPlayerStateDispatcher(this);
  }

  private onClick() {
    this.dispatch(PlayerProp.IsPiPActive, !this.isPiPActive);
  }

  render() {
    const tooltip = this.isPiPActive ? this.i18n.exitPiP : this.i18n.enterPiP;
    const tooltipWithHint = (!isUndefined(this.keyCodes) && !isUndefined(this.keyboardHint))
      ? `${tooltip} ${this.keyboardHint}` : tooltip;

    return (
      <Host
        class={{
          hidden: !this.canSetPiP,
        }}
      >
        <vime-control
          label={this.i18n.pip}
          keyCodes={this.keyCodes}
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

openPlayerWormhole(PiPControl, [
  PlayerProp.IsPiPActive,
  PlayerProp.PlaybackReady,
  PlayerProp.I18N,
]);
