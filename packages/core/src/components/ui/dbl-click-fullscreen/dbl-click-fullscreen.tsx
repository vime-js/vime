import { Component, h, Prop, State, Watch } from '@stencil/core';

import { isUndefined } from '../../../utils/unit';
import { findPlayer } from '../../core/player/findPlayer';
import { PlayerProps } from '../../core/player/PlayerProps';
import {
  getComponentFromRegistry,
  withComponentRegistry,
} from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';

/**
 * Enables toggling fullscreen mode by double clicking the player.
 */
@Component({
  tag: 'vm-dbl-click-fullscreen',
  styleUrl: 'dbl-click-fullscreen.css',
  shadow: true,
})
export class DblClickFullscreen {
  @State() canSetFullscreen = false;

  /**
   * By default this is disabled on mobile to not interfere with playback, set this to `true` to
   * enable it.
   */
  @Prop() useOnMobile = false;

  /** @internal */
  @Prop() isFullscreenActive: PlayerProps['isFullscreenActive'] = true;

  /** @internal */
  @Prop() isVideoView: PlayerProps['isVideoView'] = false;

  /** @internal */
  @Prop() playbackReady: PlayerProps['playbackReady'] = false;

  /** @internal */
  @Prop() isMobile: PlayerProps['isMobile'] = false;

  @Watch('playbackReady')
  async onPlaybackReadyChange() {
    const player = await findPlayer(this);
    if (isUndefined(player)) return;
    this.canSetFullscreen = await player.canSetFullscreen();
  }

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, [
      'playbackReady',
      'isFullscreenActive',
      'isVideoView',
      'isMobile',
    ]);
  }

  private async onTriggerClickToPlay() {
    const [clickToPlay] = getComponentFromRegistry(this, 'vm-click-to-play');
    await clickToPlay?.forceClick();
  }

  private async onToggleFullscreen() {
    const player = await findPlayer(this);
    if (isUndefined(player)) return;
    this.isFullscreenActive
      ? player.exitFullscreen()
      : player.enterFullscreen();
  }

  private clicks = 0;

  private onClick() {
    this.clicks += 1;

    if (this.clicks === 1) {
      setTimeout(() => {
        if (this.clicks === 1) {
          this.onTriggerClickToPlay();
        } else {
          this.onToggleFullscreen();
        }

        this.clicks = 0;
      }, 300);
    }
  }

  render() {
    return (
      <div
        class={{
          dblClickFullscreen: true,
          enabled:
            this.playbackReady &&
            this.canSetFullscreen &&
            this.isVideoView &&
            (!this.isMobile || this.useOnMobile),
        }}
        onClick={this.onClick.bind(this)}
      />
    );
  }
}
