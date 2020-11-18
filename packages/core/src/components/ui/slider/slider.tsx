import {
  h, Component, Prop, Event, EventEmitter, Element,
} from '@stencil/core';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';

@Component({
  tag: 'vm-slider',
  styleUrl: 'slider.css',
  shadow: true,
})
export class Slider {
  @Element() host!: HTMLVmSliderElement;

  /**
   * A number that specifies the granularity that the value must adhere to.
   */
  @Prop() step = 1;

  /**
   * The lowest value in the range of permitted values.
   */
  @Prop() min = 0;

  /**
   * The greatest permitted value.
   */
  @Prop() max = 10;

  /**
   * The current value.
   */
  @Prop() value = 5;

  /**
   * Human-readable text alternative for the current value. Defaults to `value:max` percentage.
   */
  @Prop() valueText?: string;

  /**
   * A human-readable label for the purpose of the slider.
   */
  @Prop() label?: string;

  /**
   * Emitted when the value of the underlying `input` field changes.
   */
  @Event() vmValueChange!: EventEmitter<number>;

  /**
   * Emitted when the slider receives focus.
   */
  @Event() vmFocus!: EventEmitter<void>;

  /**
   * Emitted when the slider loses focus.
   */
  @Event() vmBlur!: EventEmitter<void>;

  constructor() {
    withComponentRegistry(this);
  }

  private getPercentage() {
    return `${(this.value / this.max) * 100}%`;
  }

  private onValueChange(event: Event) {
    const value = parseFloat((event.target as HTMLInputElement)?.value);
    this.vmValueChange.emit(value);
  }

  private calcTouchedValue(event: TouchEvent) {
    const input = event.target! as HTMLInputElement;
    const touch = event.changedTouches[0];
    const min = parseFloat(input.getAttribute('min')!);
    const max = parseFloat(input.getAttribute('max')!);
    const step = parseFloat(input.getAttribute('step')!);
    const delta = max - min;

    // Calculate percentage.
    let percent;
    const clientRect = input.getBoundingClientRect();

    const sliderThumbWidth = parseFloat(
      window.getComputedStyle(this.host).getPropertyValue('--vm-slider-thumb-width'),
    );

    const thumbWidth = ((100 / clientRect.width) * (sliderThumbWidth / 2)) / 100;

    percent = (100 / clientRect.width) * (touch.clientX - clientRect.left);

    // Don't allow outside bounds.
    percent = Math.max(0, Math.min(percent, 100));

    // Factor in the thumb offset.
    if (percent < 50) {
      percent -= (100 - percent * 2) * thumbWidth;
    } else if (percent > 50) {
      percent += (percent - 50) * 2 * thumbWidth;
    }

    const position = delta * (percent / 100);

    if (step >= 1) {
      return min + Math.round(position / step) * step;
    }

    /**
     * This part differs from original implementation to save space. Only supports 2 decimal
     * places (0.01) as the step.
     */
    return min + parseFloat(position.toFixed(2));
  }

  /**
   * Basically input[range="type"] on touch devices sucks (particularly iOS), so this helps make it
   * better.
   *
   * @see https://github.com/sampotts/rangetouch
   */
  private onTouch(event: TouchEvent) {
    const input = event.target! as HTMLInputElement;
    if (input.disabled) return;
    event.preventDefault();
    this.value = this.calcTouchedValue(event);
    this.vmValueChange.emit(this.value);
    input.dispatchEvent(
      new window.Event((event.type === 'touchend') ? 'change' : 'input', { bubbles: true }),
    );
  }

  render() {
    return (
      <div
        class="slider"
        style={{
          '--vm-value': this.getPercentage(),
        }}
      >
        <input
          type="range"
          step={this.step}
          min={this.min}
          max={this.max}
          value={this.value}
          autocomplete="off"
          aria-label={this.label}
          aria-valuemin={this.min}
          aria-valuemax={this.max}
          aria-valuenow={this.value}
          aria-valuetext={this.valueText ?? this.getPercentage()}
          aria-orientation="horizontal"
          onInput={this.onValueChange.bind(this)}
          onFocus={() => { this.vmFocus.emit(); }}
          onBlur={() => { this.vmBlur.emit(); }}
          onTouchStart={this.onTouch.bind(this)}
          onTouchMove={this.onTouch.bind(this)}
          onTouchEnd={this.onTouch.bind(this)}
        />
      </div>
    );
  }
}
