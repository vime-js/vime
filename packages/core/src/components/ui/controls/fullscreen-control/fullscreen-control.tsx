import {
  h, Host, Component, Prop, State, Watch,
} from '@stencil/core';
import { PlayerProps, PlayerProp } from '../../../core/player/PlayerProp';
import { openPlayerWormhole } from '../../../core/player/PlayerWormhole';
import { PlayerStateDispatcher, createPlayerStateDispatcher } from '../../../core/player/PlayerState';
import { TooltipDirection } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
import { isUndefined } from '../../../../utils/unit';
import { findRootPlayer } from '../../../core/player/utils';

@Component({
  tag: 'vime-fullscreen-control',
  styleUrl: 'fullscreen-control.css',
})
export class FullscreenControl implements KeyboardControl {
  private dispatch!: PlayerStateDispatcher;

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
   * @inheritdoc
   */
  @Prop() keyCodes?: string = '70';

  /**
   * @inheritdoc
   */
  @Prop() keyboardHint?: string = '(f)';

  /**
   * @internal
   */
  @Prop() isFullscreenActive: PlayerProps[PlayerProp.IsFullscreenActive] = false;

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
    this.canSetFullscreen = await player.canSetFullscreen();
  }

  connectedCallback() {
    this.dispatch = createPlayerStateDispatcher(this);
  }

  private onClick() {
    this.dispatch(PlayerProp.IsFullscreenActive, !this.isFullscreenActive);
  }

  render() {
    const tooltip = this.isFullscreenActive ? this.i18n.exitFullscreen : this.i18n.enterFullscreen;
    const tooltipWithHint = (!isUndefined(this.keyCodes) && !isUndefined(this.keyboardHint))
      ? `${tooltip} ${this.keyboardHint}` : tooltip;

    return (
      <Host
        class={{
          hidden: !this.canSetFullscreen,
        }}
      >
        <vime-control
          label={this.i18n.fullscreen}
          keyCodes={this.keyCodes}
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

openPlayerWormhole(FullscreenControl, [
  PlayerProp.IsFullscreenActive,
  PlayerProp.PlaybackReady,
  PlayerProp.I18N,
]);
