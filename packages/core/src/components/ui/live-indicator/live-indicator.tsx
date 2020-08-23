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
  @Prop() isLive: PlayerProps[PlayerProp.IsLive] = false;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps[PlayerProp.I18N] = {};

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
  PlayerProp.IsLive,
  PlayerProp.I18N,
]);
