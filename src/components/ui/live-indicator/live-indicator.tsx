import { Component, h, Prop } from '@stencil/core';

import { PlayerProps } from '../../core/player/PlayerProps';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';

/**
 * This can be used to indicate to the user that the current media is being streamed live.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/src/components/ui/live-indicator/live-indicator.png"
 *   alt="Vime live indicator component"
 * />
 */
@Component({
  tag: 'vm-live-indicator',
  styleUrl: 'live-indicator.css',
  shadow: true,
})
export class LiveIndicator {
  /** @internal */
  @Prop() isLive: PlayerProps['isLive'] = false;

  /** @internal */
  @Prop() i18n: PlayerProps['i18n'] = {};

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, ['isLive', 'i18n']);
  }

  render() {
    return (
      <div
        class={{
          liveIndicator: true,
          hidden: !this.isLive,
        }}
      >
        <div class="indicator" />
        {this.i18n.live}
      </div>
    );
  }
}
