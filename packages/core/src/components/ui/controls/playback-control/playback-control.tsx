import { h, Component, Prop } from '@stencil/core';
import { PlayerProps, PlayerProp } from '../../../core/player/PlayerProp';
import { withPlayerContext } from '../../../core/player/PlayerContext';
import { PlayerDispatcher, createPlayerDispatcher } from '../../../core/player/PlayerDispatcher';
import { TooltipDirection } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
import { isUndefined } from '../../../../utils/unit';

@Component({
  tag: 'vime-playback-control',
})
export class PlaybackControl implements KeyboardControl {
  private dispatch!: PlayerDispatcher;

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
  @Prop() keys?: string = 'k';

  /**
   * @internal
   */
  @Prop() paused: PlayerProps[PlayerProp.paused] = true;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps[PlayerProp.i18n] = {};

  componentWillLoad() {
    this.dispatch = createPlayerDispatcher(this);
  }

  private onClick() {
    this.dispatch(PlayerProp.paused, !this.paused);
  }

  render() {
    const tooltip = this.paused ? this.i18n.play : this.i18n.pause;
    const tooltipWithHint = !isUndefined(this.keys) ? `${tooltip} (${this.keys})` : tooltip;

    return (
      <vime-control
        scale={this.scale}
        label={this.i18n.playback}
        keys={this.keys}
        pressed={!this.paused}
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

withPlayerContext(PlaybackControl, [
  PlayerProp.paused,
  PlayerProp.i18n,
]);
