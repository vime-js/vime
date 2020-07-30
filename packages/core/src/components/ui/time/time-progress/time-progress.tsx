import {
  h, Host, Component, Prop,
} from '@stencil/core';

@Component({
  tag: 'vime-time-progress',
  styleUrl: 'time-progress.css',
})
export class TimeProgress {
  /**
   * The string used to separate the current time and end time.
   */
  @Prop() separator = '/';

  /**
   * Whether the times should always show the hours unit, even if the time is less than
   * 1 hour (eg: `20:35` -> `00:20:35`).
   */
  @Prop() alwaysShowHours = false;

  render() {
    return (
      <Host>
        <vime-current-time
          alwaysShowHours={this.alwaysShowHours}
        />
        <span>
          {this.separator}
        </span>
        <vime-end-time
          alwaysShowHours={this.alwaysShowHours}
        />
      </Host>
    );
  }
}
