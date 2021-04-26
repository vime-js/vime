import { Component, h, Prop } from '@stencil/core';

import { PlayerProps } from '../../../core/player/PlayerProps';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../../core/player/withPlayerContext';

@Component({
  tag: 'vm-end-time',
  styleUrl: 'end-time.css',
  shadow: true,
})
export class EndTime {
  /** @internal */
  @Prop() duration: PlayerProps['duration'] = -1;

  /** @internal */
  @Prop() i18n: PlayerProps['i18n'] = {};

  /**
   * Whether the time should always show the hours unit, even if the time is less than
   * 1 hour (eg: `20:35` -> `00:20:35`).
   */
  @Prop() alwaysShowHours = false;

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, ['duration', 'i18n']);
  }

  render() {
    return (
      <vm-time
        label={this.i18n.duration}
        seconds={Math.max(0, this.duration)}
        alwaysShowHours={this.alwaysShowHours}
      />
    );
  }
}
