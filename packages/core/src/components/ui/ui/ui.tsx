import {
  h, Host, Component, Prop,
} from '@stencil/core';
import { openPlayerWormhole } from '../../core/player/PlayerWormhole';
import { PlayerProp, PlayerProps } from '../../core/player/PlayerProp';
import { IS_IOS } from '../../../utils/support';

@Component({
  tag: 'vime-ui',
  styleUrl: 'ui.scss',
})
export class UI {
  /**
   * @internal
   */
  @Prop() isVideoView: PlayerProps[PlayerProp.IsVideoView] = false;

  /**
   * @internal
   */
  @Prop() playsinline: PlayerProps[PlayerProp.Playsinline] = false;

  /**
   * @internal
   */
  @Prop() isFullscreenActive: PlayerProps[PlayerProp.IsFullscreenActive] = false;

  render() {
    const canShowCustomUI = !IS_IOS
      || !this.isVideoView
      || (this.playsinline && !this.isFullscreenActive);

    return (
      <Host
        class={{
          hidden: !canShowCustomUI,
          video: this.isVideoView,
        }}
      >
        {canShowCustomUI && <slot />}
      </Host>
    );
  }
}

openPlayerWormhole(UI, [
  PlayerProp.IsVideoView,
  PlayerProp.Playsinline,
  PlayerProp.IsFullscreenActive,
]);
