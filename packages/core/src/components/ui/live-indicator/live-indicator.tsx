import {
  h, Host, Component, Prop,
} from '@stencil/core';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withPlayerContext } from '../../core/player/PlayerContext';

@Component({
  tag: 'vime-live-indicator',
  styleUrl: 'live-indicator.scss',
})
export class LiveIndicator {
  /**
   * @internal
   */
  @Prop() isLive: PlayerProps['isLive'] = false;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps['i18n'] = {};

  render() {
    return (
      <Host
        class={{
          hidden: !this.isLive,
        }}
      >
        <div class="indicator" />
        {this.i18n.live}
      </Host>
    );
  }
}

withPlayerContext(LiveIndicator, [
  'isLive',
  'i18n',
]);
