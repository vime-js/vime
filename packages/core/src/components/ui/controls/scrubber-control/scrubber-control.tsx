import {
  h, Host, Component, Prop, State, Watch, Element, writeTask,
} from '@stencil/core';
import { openPlayerWormhole } from '../../../core/player/PlayerWormhole';
import { PlayerProp, PlayerProps } from '../../../core/player/PlayerProp';
import { formatTime } from '../../../../utils/formatters';
import { createPlayerStateDispatcher, PlayerStateDispatcher } from '../../../core/player/PlayerState';
import { Disposal } from '../../../core/player/Disposal';
import { listen } from '../../../../utils/dom';
import { findRootPlayer } from '../../../core/player/utils';

@Component({
  tag: 'vime-scrubber-control',
  styleUrl: 'scrubber-control.scss',
})
export class ScrubberControl {
  private slider!: HTMLVimeSliderElement;

  private tooltip!: HTMLVimeTooltipElement;

  private dispatch!: PlayerStateDispatcher;

  private keyboardDisposal = new Disposal();

  @Element() el!: HTMLVimeScrubberControlElement;

  @State() timestamp = '';

  @State() endTime = 0;

  /**
   * Whether the timestamp in the tooltip should show the hours unit, even if the time is less than
   * 1 hour (eg: `20:35` -> `00:20:35`).
   */
  @Prop() alwaysShowHours = false;

  /**
   * Whether the tooltip should not be displayed.
   */
  @Prop() hideTooltip = false;

  /**
   * @internal
   */
  @Prop() currentTime: PlayerProps[PlayerProp.CurrentTime] = 0;

  /**
   * @internal
   */
  @Prop() duration: PlayerProps[PlayerProp.Duration] = -1;

  /**
   * Prevents seeking forward/backward by using the Left/Right arrow keys.
   */
  @Prop() noKeyboard = false;

  @Watch('noKeyboard')
  onNoKeyboardChange() {
    this.keyboardDisposal.empty();
    if (this.noKeyboard) return;

    const player = findRootPlayer(this);

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key !== 'ArrowLeft') && (event.key !== 'ArrowRight')) return;
      event.preventDefault();
      const isLeftArrow = (event.key === 'ArrowLeft');
      const seekTo = isLeftArrow
        ? Math.max(0, this.currentTime - 5)
        : Math.min(this.duration, this.currentTime + 5);
      this.dispatch(PlayerProp.CurrentTime, seekTo);
    };

    this.keyboardDisposal.add(listen(player, 'keydown', onKeyDown));
  }

  @Watch('duration')
  onDurationChange() {
    // Avoid -1.
    this.endTime = Math.max(0, this.duration);
  }

  /**
   * @internal
   */
  @Prop() buffering: PlayerProps[PlayerProp.Buffering] = false;

  /**
   * @internal
   */
  @Prop() buffered: PlayerProps[PlayerProp.Buffered] = 0;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps[PlayerProp.I18N] = {};

  connectedCallback() {
    this.dispatch = createPlayerStateDispatcher(this);
    this.timestamp = formatTime(this.currentTime, this.alwaysShowHours);
    this.onNoKeyboardChange();
  }

  disconnectedCallback() {
    this.keyboardDisposal.empty();
  }

  private setTooltipPosition(value: number, percent: number) {
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const scrubberRect = this.el.getBoundingClientRect();
    const bounds = this.el.parentElement!.getBoundingClientRect();
    const leftOffset = scrubberRect.left - bounds.left;
    const rightOffset = bounds.right - scrubberRect.right;
    const leftLimit = bounds.left + leftOffset;
    const rightLimit = bounds.right - rightOffset;
    if (
      (tooltipRect.left + percent > leftLimit)
      && (tooltipRect.right - (100 - percent) < rightLimit)
    ) {
      writeTask(() => {
        this.tooltip.style.left = `${value}px`;
      });
    }
  }

  private onSeek(event: CustomEvent<number>) {
    this.dispatch(PlayerProp.CurrentTime, event.detail);
  }

  private onSeeking(event: MouseEvent) {
    if (this.duration < 0 || this.tooltip.hidden) return;

    if (event.type === 'mouseleave') {
      this.getSliderInput().blur();
      this.tooltip.active = false;
      return;
    }

    const rect = this.el.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, (100 / rect.width) * (event.pageX - rect.left)));
    this.timestamp = formatTime((this.duration / 100) * percent, this.alwaysShowHours);
    this.setTooltipPosition((percent / 100) * rect.width, percent);

    if (!this.tooltip.active) {
      this.getSliderInput().focus();
      this.tooltip.active = true;
    }
  }

  private getSliderInput() {
    return this.slider.querySelector('input')!;
  }

  render() {
    const sliderValueText = this.i18n.scrubberLabel
      .replace(/{currentTime}/, formatTime(this.currentTime))
      .replace(/{duration}/, formatTime(this.endTime));

    return (
      <Host
        onMouseEnter={this.onSeeking.bind(this)}
        onMouseLeave={this.onSeeking.bind(this)}
        onMouseMove={this.onSeeking.bind(this)}
        onTouchMove={() => { this.getSliderInput().focus(); }}
        onTouchEnd={() => { this.getSliderInput().blur(); }}
      >
        <vime-slider
          step={0.01}
          max={this.endTime}
          value={this.currentTime}
          label={this.i18n.scrubber}
          valueText={sliderValueText}
          onValueChange={this.onSeek.bind(this)}
          ref={(el: any) => { this.slider = el; }}
        />

        <progress
          class={{
            loading: this.buffering,
          }}
          // @ts-ignore
          min={0}
          max={this.endTime}
          value={this.buffered}
          aria-label={this.i18n.buffered}
          aria-valuemin="0"
          aria-valuemax={this.endTime}
          aria-valuenow={this.buffered}
          aria-valuetext={`${((this.endTime > 0) ? (this.buffered / this.endTime) : 0).toFixed(0)}%`}
        >
          % buffered
        </progress>

        <vime-tooltip
          hidden={this.hideTooltip}
          ref={(el: any) => { this.tooltip = el; }}
        >
          {this.timestamp}
        </vime-tooltip>
      </Host>
    );
  }
}

openPlayerWormhole(ScrubberControl, [
  PlayerProp.I18N,
  PlayerProp.CurrentTime,
  PlayerProp.Duration,
  PlayerProp.Buffering,
  PlayerProp.Buffered,
]);
