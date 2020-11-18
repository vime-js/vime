import { h, Component, Prop } from '@stencil/core';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import { PlayerProps } from '../../core/player/PlayerProps';
import { IS_IOS } from '../../../utils/support';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';

/**
 * @slot - Used to pass in UI components for the player.
 */
@Component({
  tag: 'vm-ui',
  styleUrl: 'ui.css',
  shadow: true,
})
export class UI {
  /** @internal */
  @Prop() isVideoView: PlayerProps['isVideoView'] = false;

  /** @internal */
  @Prop() playsinline: PlayerProps['playsinline'] = false;

  /** @internal */
  @Prop() isFullscreenActive: PlayerProps['isFullscreenActive'] = false;

  constructor() {
    withComponentRegistry(this);
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
      <div
        class={{
          ui: true,
          hidden: !canShowCustomUI,
          video: this.isVideoView,
        }}
      >
        {canShowCustomUI && <slot />}
      </div>
    );
  }
}
