import { Component, Element, h, Prop, State, Watch } from '@stencil/core';

import { Disposal } from '../../../../utils/Disposal';
import { listen } from '../../../../utils/dom';
import { formatTime } from '../../../../utils/formatters';
import { isUndefined } from '../../../../utils/unit';
import { findPlayer } from '../../../core/player/findPlayer';
import {
  createDispatcher,
  Dispatcher,
} from '../../../core/player/PlayerDispatcher';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../../core/player/withPlayerContext';

@Component({
  tag: 'vm-scrubber-control',
  styleUrl: 'scrubber-control.css',
  shadow: true,
})
export class ScrubberControl {
  private slider!: HTMLVmSliderElement;

  private tooltip!: HTMLVmTooltipElement;

  private dispatch!: Dispatcher;

  private keyboardDisposal = new Disposal();

  @Element() host!: HTMLVmScrubberControlElement;

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

  /** @internal */
  @Prop() currentTime: PlayerProps['currentTime'] = 0;

  /** @internal */
  @Prop() duration: PlayerProps['duration'] = -1;

  /**
   * Prevents seeking forward/backward by using the Left/Right arrow keys.
   */
  @Prop() noKeyboard = false;

  @Watch('noKeyboard')
  async onNoKeyboardChange() {
    this.keyboardDisposal.empty();
    if (this.noKeyboard) return;

    const player = await findPlayer(this);

    if (isUndefined(player)) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const isLeftArrow = event.key === 'ArrowLeft';
      const seekTo = isLeftArrow
        ? Math.max(0, this.currentTime - 5)
        : Math.min(this.duration, this.currentTime + 5);
      this.dispatch('currentTime', seekTo);
    };

    this.keyboardDisposal.add(listen(player, 'keydown', onKeyDown));
  }

  @Watch('duration')
  onDurationChange() {
    // Avoid -1.
    this.endTime = Math.max(0, this.duration);
  }

  /** @internal */
  @Prop() buffering: PlayerProps['buffering'] = false;

  /** @internal */
  @Prop() buffered: PlayerProps['buffered'] = 0;

  /** @internal */
  @Prop() i18n: PlayerProps['i18n'] = {};

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, [
      'i18n',
      'currentTime',
      'duration',
      'buffering',
      'buffered',
    ]);
  }

  connectedCallback() {
    this.dispatch = createDispatcher(this);
    this.timestamp = formatTime(this.currentTime, this.alwaysShowHours);
    this.onNoKeyboardChange();
  }

  disconnectedCallback() {
    this.keyboardDisposal.empty();
  }

  private setTooltipPosition(value: number) {
    const tooltipRect = this.tooltip.shadowRoot
      ?.querySelector('.tooltip')
      ?.getBoundingClientRect() as DOMRect;

    const bounds = this.slider.getBoundingClientRect();
    const thumbWidth = parseFloat(
      window
        .getComputedStyle(this.slider)
        .getPropertyValue('--vm-slider-thumb-width'),
    );
    const leftLimit = tooltipRect.width / 2 - thumbWidth / 2;
    const rightLimit = bounds.width - tooltipRect.width / 2 - thumbWidth / 2;
    const xPos = Math.max(leftLimit, Math.min(value, rightLimit));
    (this.tooltip as any).style = `--vm-tooltip-left: ${xPos}px`;
  }

  private onSeek(event: CustomEvent<number>) {
    this.dispatch('currentTime', event.detail);
  }

  private onSeeking(event: MouseEvent) {
    if (this.duration < 0 || this.tooltip.hidden) return;

    if (event.type === 'mouseleave') {
      this.getSliderInput().blur();
      this.tooltip.active = false;
      return;
    }

    const rect = this.host.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(100, (100 / rect.width) * (event.pageX - rect.left)),
    );
    this.timestamp = formatTime(
      (this.duration / 100) * percent,
      this.alwaysShowHours,
    );
    this.setTooltipPosition((percent / 100) * rect.width);

    if (!this.tooltip.active) {
      this.getSliderInput().focus();
      this.tooltip.active = true;
    }
  }

  private getSliderInput() {
    return this.slider.shadowRoot?.querySelector('input') as HTMLInputElement;
  }

  render() {
    const sliderValueText = this.i18n.scrubberLabel
      .replace(/{currentTime}/, formatTime(this.currentTime))
      .replace(/{duration}/, formatTime(this.endTime));

    return (
      <div
        class="scrubber"
        onMouseEnter={this.onSeeking.bind(this)}
        onMouseLeave={this.onSeeking.bind(this)}
        onMouseMove={this.onSeeking.bind(this)}
        onTouchMove={() => {
          this.getSliderInput().focus();
        }}
        onTouchEnd={() => {
          this.getSliderInput().blur();
        }}
      >
        <vm-slider
          step={0.01}
          max={this.endTime}
          value={this.currentTime}
          label={this.i18n.scrubber}
          valueText={sliderValueText}
          onVmValueChange={this.onSeek.bind(this)}
          ref={(el: any) => {
            this.slider = el;
          }}
        />

        <progress
          class={{
            loading: this.buffering,
          }}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          min={0}
          max={this.endTime}
          value={this.buffered}
          aria-label={this.i18n.buffered}
          aria-valuemin="0"
          aria-valuemax={this.endTime}
          aria-valuenow={this.buffered}
          aria-valuetext={`${(this.endTime > 0
            ? this.buffered / this.endTime
            : 0
          ).toFixed(0)}%`}
        >
          % buffered
        </progress>

        <vm-tooltip
          hidden={this.hideTooltip}
          ref={(el: any) => {
            this.tooltip = el;
          }}
        >
          {this.timestamp}
        </vm-tooltip>
      </div>
    );
  }
}
