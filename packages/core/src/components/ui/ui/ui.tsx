import {
  h, Host, Component, Prop,
} from '@stencil/core';
import { withPlayerContext } from '../../core/player/PlayerContext';
import { PlayerProp, PlayerProps } from '../../core/player/PlayerProp';
import { IS_IOS } from '../../../utils/support';

/**
 * @slot - Used to pass in UI components for the player.
 */
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
        <div>
          {canShowCustomUI && <slot />}
        </div>
      </Host>
    );
  }
}

withPlayerContext(UI, [
  PlayerProp.IsVideoView,
  PlayerProp.Playsinline,
  PlayerProp.IsFullscreenActive,
]);
