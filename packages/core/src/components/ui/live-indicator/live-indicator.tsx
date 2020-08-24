import {
  h, Host, Component, Prop,
} from '@stencil/core';
import { PlayerProps, PlayerProp } from '../../core/player/PlayerProp';
import { withPlayerContext } from '../../core/player/PlayerContext';

@Component({
  tag: 'vime-live-indicator',
  styleUrl: 'live-indicator.scss',
})
export class LiveIndicator {
  /**
   * @internal
   */
  @Prop() isLive: PlayerProps[PlayerProp.isLive] = false;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps[PlayerProp.i18n] = {};

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
  PlayerProp.isLive,
  PlayerProp.i18n,
]);
