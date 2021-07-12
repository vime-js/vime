import { Component, h, Prop } from '@stencil/core';

import { PlayerProps } from '../../../core/player/PlayerProps';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../../core/player/withPlayerContext';

/**
 * Formats and displays the current time of playback.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/src/components/ui/time/current-time/current-time.png"
 *   alt="Vime current time component"
 * />
 */
@Component({
  tag: 'vm-current-time',
  styleUrl: 'current-time.css',
  shadow: true,
})
export class CurrentTime {
  /** @internal */
  @Prop() currentTime: PlayerProps['currentTime'] = 0;

  /** @internal */
  @Prop() i18n: PlayerProps['i18n'] = {};

  /**
   * Whether the time should always show the hours unit, even if the time is less than
   * 1 hour (eg: `20:35` -> `00:20:35`).
   */
  @Prop() alwaysShowHours = false;

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, ['currentTime', 'i18n']);
  }

  render() {
    return (
      <vm-time
        label={this.i18n.currentTime}
        seconds={this.currentTime}
        alwaysShowHours={this.alwaysShowHours}
      />
    );
  }
}
