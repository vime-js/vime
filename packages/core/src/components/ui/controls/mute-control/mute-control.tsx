import { h, Component, Prop } from '@stencil/core';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { withPlayerContext } from '../../../core/player/PlayerContext';
import { Dispatcher, createDispatcher } from '../../../core/player/PlayerDispatcher';
import { TooltipDirection, TooltipPosition } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
import { isUndefined } from '../../../../utils/unit';

@Component({
  tag: 'vime-mute-control',
})
export class MuteControl implements KeyboardControl {
  private dispatch!: Dispatcher;

  /**
   * The URL to an SVG element or fragment.
   */
  @Prop() lowVolumeIcon = '#vime-volume-low';

  /**
   * The URL to an SVG element or fragment.
   */
  @Prop() highVolumeIcon = '#vime-volume-high';

  /**
   * The URL to an SVG element or fragment.
   */
  @Prop() mutedIcon = '#vime-volume-mute';

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

  /**
   * @inheritdoc
   */
  @Prop() keys?: string = 'm';

  /**
   * @internal
   */
  @Prop() volume: PlayerProps['volume'] = 50;

  /**
   * @internal
   */
  @Prop() muted: PlayerProps['muted'] = false;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps['i18n'] = {};

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
      <vime-control
        label={this.i18n.mute}
        pressed={this.muted}
        keys={this.keys}
        onClick={this.onClick.bind(this)}
      >
        <vime-icon href={this.getIcon()} />

        <vime-tooltip
          hidden={this.hideTooltip}
          position={this.tooltipPosition}
          direction={this.tooltipDirection}
        >
          {tooltipWithHint}
        </vime-tooltip>
      </vime-control>
    );
  }
}

withPlayerContext(MuteControl, [
  'muted',
  'volume',
  'i18n',
]);
