import {
  h, Host, Component, Prop,
} from '@stencil/core';
import { withPlayerContext } from '../../core/player/PlayerContext';
import { PlayerProps } from '../../core/player/PlayerProps';
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
  @Prop() isVideoView: PlayerProps['isVideoView'] = false;

  /**
   * @internal
   */
  @Prop() playsinline: PlayerProps['playsinline'] = false;

  /**
   * @internal
   */
  @Prop() isFullscreenActive: PlayerProps['isFullscreenActive'] = false;

  constructor() {
    withPlayerContext(this, [
      'isVideoView',
      'playsinline',
      'isFullscreenActive',
    ]);
  }

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
