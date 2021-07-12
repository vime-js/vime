import { Component, h, Prop } from '@stencil/core';

import { IS_IOS } from '../../../utils/support';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';

/**
 * Simple container that holds a collection of user interface components.
 *
 * The only important role this component really has is, avoiding overlapping custom UI with the
 * native iOS media player UI. Therefore, custom UI is only displayed on iOS if the `playsinline`
 * prop is `true`, and the player is not in fullscreen mode.
 *
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
    const canShowCustomUI =
      !IS_IOS ||
      !this.isVideoView ||
      (this.playsinline && !this.isFullscreenActive);

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
