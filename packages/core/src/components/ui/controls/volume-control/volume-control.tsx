import {
  h, Host, Component, Prop, State, Watch,
} from '@stencil/core';
import { withPlayerContext } from '../../../core/player/PlayerContext';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { Dispatcher, createDispatcher } from '../../../core/player/PlayerDispatcher';
import { TooltipDirection, TooltipPosition } from '../../tooltip/types';
import { Disposal } from '../../../core/player/Disposal';
import { listen } from '../../../../utils/dom';
import { findRootPlayer } from '../../../core/player/utils';

@Component({
  tag: 'vime-volume-control',
  styleUrl: 'volume-control.scss',
})
export class VolumeControl {
  private dispatch!: Dispatcher;

  private keyboardDisposal = new Disposal();

  private prevMuted = false;

  private hideSliderTimeout?: number;

  @State() currentVolume = 50;

  @State() isSliderActive = false;

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
   * Whether the tooltip should be hidden.
   */
  @Prop() hideTooltip = false;

  /**
   * A pipe (`/`) separated string of JS keyboard keys, that when caught in a `keydown` event, will
   * toggle the muted state of the player.
   */
  @Prop() muteKeys?: string = 'm';

  /**
   * Prevents the volume being changed using the Up/Down arrow keys.
   */
  @Prop() noKeyboard = false;

  @Watch('noKeyboard')
  onNoKeyboardChange() {
    this.keyboardDisposal.empty();
    if (this.noKeyboard) return;
    const player = findRootPlayer(this);
    this.keyboardDisposal.add(listen(player, 'keydown', (event: KeyboardEvent) => {
      if ((event.key !== 'ArrowUp') && (event.key !== 'ArrowDown')) return;
      const isUpArrow = (event.key === 'ArrowUp');
      const newVolume = isUpArrow ? Math.min(100, this.volume + 5) : Math.max(0, this.volume - 5);
      this.dispatch('volume', parseInt(`${newVolume}`, 10));
    }));
  }

  /**
   * @internal
   */
  @Prop() muted: PlayerProps['muted'] = false;

  /**
   * @internal
   */
  @Prop() volume: PlayerProps['volume'] = 50;

  @Watch('muted')
  @Watch('volume')
  onPlayerVolumeChange() {
    this.currentVolume = this.muted ? 0 : this.volume;

    if (!this.muted && this.prevMuted && this.volume === 0) {
      this.dispatch('volume', 30);
    }

    this.prevMuted = this.muted;
  }

  /**
   * @internal
   */
  @Prop() isMobile: PlayerProps['isMobile'] = false;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps['i18n'] = {};

  connectedCallback() {
    this.prevMuted = this.muted;
    this.dispatch = createDispatcher(this);
    this.onNoKeyboardChange();
  }

  disconnectedCallback() {
    this.keyboardDisposal.empty();
  }

  private onShowSlider() {
    clearTimeout(this.hideSliderTimeout);
    this.isSliderActive = true;
  }

  private onHideSlider() {
    this.hideSliderTimeout = setTimeout(() => {
      this.isSliderActive = false;
    }, 100) as any;
  }

  private onVolumeChange(event: CustomEvent<number>) {
    const newVolume = event.detail;
    this.currentVolume = newVolume;
    this.dispatch('volume', newVolume);
    this.dispatch('muted', newVolume === 0);
  }

  private onKeyDown(event: KeyboardEvent) {
    if ((event.key !== 'ArrowLeft') && (event.key !== 'ArrowRight')) return;
    event.stopPropagation();
  }

  render() {
    return (
      <Host
        onMouseEnter={this.onShowSlider.bind(this)}
        onMouseLeave={this.onHideSlider.bind(this)}
      >
        <vime-mute-control
          keys={this.muteKeys}
          lowVolumeIcon={this.lowVolumeIcon}
          highVolumeIcon={this.highVolumeIcon}
          mutedIcon={this.mutedIcon}
          tooltipPosition={this.tooltipPosition}
          tooltipDirection={this.tooltipDirection}
          hideTooltip={this.hideTooltip}
          onFocus={this.onShowSlider.bind(this)}
          onBlur={this.onHideSlider.bind(this)}
        />
        <vime-slider
          class={{
            hidden: this.isMobile,
            active: this.isSliderActive,
          }}
          step={5}
          max={100}
          value={this.currentVolume}
          label={this.i18n.volume}
          onKeyDown={this.onKeyDown.bind(this)}
          onFocus={this.onShowSlider.bind(this)}
          onBlur={this.onHideSlider.bind(this)}
          onVValueChange={this.onVolumeChange.bind(this)}
        />
      </Host>
    );
  }
}

withPlayerContext(VolumeControl, [
  'volume',
  'muted',
  'isMobile',
  'i18n',
]);
