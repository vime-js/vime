import { h, Component, Prop } from '@stencil/core';
import { PlayerProps, PlayerProp } from '../../../core/player/PlayerProp';
import { openPlayerWormhole } from '../../../core/player/PlayerWormhole';
import { PlayerStateDispatcher, createPlayerStateDispatcher } from '../../../core/player/PlayerState';
import { TooltipDirection } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
import { isUndefined } from '../../../../utils/unit';

@Component({
  tag: 'vime-playback-control',
})
export class PlaybackControl implements KeyboardControl {
  private dispatch!: PlayerStateDispatcher;

  /**
   * The URL to an SVG element or fragment to load.
   */
  @Prop() playIcon = '#vime-play';

  /**
   * The URL to an SVG element or fragment to load.
   */
  @Prop() pauseIcon = '#vime-pause';

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
  @Prop() keyCodes?: string = '75';

  /**
   * @inheritdoc
   */
  @Prop() keyboardHint?: string = '(k)';

  /**
   * @internal
   */
  @Prop() paused: PlayerProps[PlayerProp.Paused] = true;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps[PlayerProp.I18N] = {};

  connectedCallback() {
    this.dispatch = createPlayerStateDispatcher(this);
  }

  private onClick() {
    this.dispatch(PlayerProp.Paused, !this.paused);
  }

  render() {
    const tooltip = this.paused ? this.i18n.play : this.i18n.pause;
    const tooltipWithHint = (!isUndefined(this.keyCodes) && !isUndefined(this.keyboardHint))
      ? `${tooltip} ${this.keyboardHint}` : tooltip;

    return (
      <vime-control
        scale={this.scale}
        label={this.i18n.playback}
        keyCodes={this.keyCodes}
        onClick={this.onClick.bind(this)}
      >
        <vime-icon href={this.paused ? this.playIcon : this.pauseIcon} />

        <vime-tooltip
          hidden={this.hideTooltip}
          direction={this.tooltipDirection}
        >
          {tooltipWithHint}
        </vime-tooltip>
      </vime-control>
    );
  }
}

openPlayerWormhole(PlaybackControl, [
  PlayerProp.Paused,
  PlayerProp.I18N,
]);
