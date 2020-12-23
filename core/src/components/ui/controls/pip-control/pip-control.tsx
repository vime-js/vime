import { h, Component, Prop, Watch, State, Host } from '@stencil/core';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { TooltipDirection, TooltipPosition } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
import { isUndefined } from '../../../../utils/unit';
import { withPlayerContext } from '../../../core/player/withPlayerContext';
import {
  getPlayerFromRegistry,
  withComponentRegistry,
} from '../../../core/player/withComponentRegistry';

@Component({
  tag: 'vm-pip-control',
  styleUrl: 'pip-control.css',
  shadow: true,
})
export class PiPControl implements KeyboardControl {
  @State() canSetPiP = false;

  /**
   * The name of the enter pip icon to resolve from the icon library.
   */
  @Prop() enterIcon = 'pip-enter';

  /**
   * The name of the exit pip icon to resolve from the icon library.
   */
  @Prop() exitIcon = 'pip-exit';

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
  @Prop() keys?: string = 'p';

  /** @internal */
  @Prop() isPiPActive: PlayerProps['isPiPActive'] = false;

  /** @internal */
  @Prop() i18n: PlayerProps['i18n'] = {};

  /** @internal */
  @Prop() playbackReady: PlayerProps['playbackReady'] = false;

  @Watch('playbackReady')
  async onPlaybackReadyChange() {
    const player = getPlayerFromRegistry(this);
    this.canSetPiP = (await player?.canSetPiP()) ?? false;
  }

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, ['isPiPActive', 'playbackReady', 'i18n']);
  }

  componentDidLoad() {
    this.onPlaybackReadyChange();
  }

  private onClick() {
    const player = getPlayerFromRegistry(this);
    !this.isPiPActive ? player?.enterPiP() : player?.exitPiP();
  }

  render() {
    const tooltip = this.isPiPActive ? this.i18n.exitPiP : this.i18n.enterPiP;
    const tooltipWithHint = !isUndefined(this.keys)
      ? `${tooltip} (${this.keys})`
      : tooltip;

    return (
      <Host hidden={!this.canSetPiP}>
        <vm-control
          label={this.i18n.pip}
          keys={this.keys}
          pressed={this.isPiPActive}
          hidden={!this.canSetPiP}
          onClick={this.onClick.bind(this)}
        >
          <vm-icon
            name={this.isPiPActive ? this.exitIcon : this.enterIcon}
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
