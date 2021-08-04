import { Component, h, Prop } from '@stencil/core';

import { formatTime } from '../../../../utils/formatters';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';

/**
 * Formats and displays the progression of playback as `currentTime (separator) endTime`.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/time/time-progress/time-progress.png"
 *   alt="Vime time progress component"
 * />
 */
@Component({
  tag: 'vm-time',
  styleUrl: 'time.css',
  shadow: true,
})
export class Time {
  /**
   * The `aria-label` property of the time.
   */
  @Prop() label!: string;

  /**
   * The length of time in seconds.
   */
  @Prop() seconds = 0;

  /**
   * Whether the time should always show the hours unit, even if the time is less than
   * 1 hour (eg: `20:35` -> `00:20:35`).
   */
  @Prop() alwaysShowHours = false;

  constructor() {
    withComponentRegistry(this);
  }

  render() {
    return (
      <div class="time" aria-label={this.label}>
        {formatTime(Math.max(0, this.seconds), this.alwaysShowHours)}
      </div>
    );
  }
}
