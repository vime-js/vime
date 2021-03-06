import { Component, h, Prop } from '@stencil/core';

import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';

/**
 * The view that is displayed while the player is booting or media is loading. By default there
 * are animated dots that are shown below the `<slot />` to indicate to the user content is being
 * loaded. The default `<slot />` is your opportunity to brand the player with your logo.
 *
 * @slot - Used to pass in any content to be shown above the animated dots while the player
 * is booting or media is loading. Use this as an opportunity to brand your player, similar to
 * how Netflix shows their logo when content is loading.
 */
@Component({
  tag: 'vm-loading-screen',
  styleUrl: 'loading-screen.css',
  shadow: true,
})
export class LoadingScreen {
  /** @internal */
  @Prop() playbackReady = false;

  /**
   * Whether the loading dots are hidden or not.
   */
  @Prop() hideDots = false;

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, ['playbackReady']);
  }

  render() {
    return (
      <div
        class={{
          loadingScreen: true,
          inactive: this.playbackReady,
        }}
      >
        <slot />
        {!this.hideDots && <div class="dotPulse" />}
      </div>
    );
  }
}
