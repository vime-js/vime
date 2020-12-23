import { h, Component, Prop } from '@stencil/core';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';

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
