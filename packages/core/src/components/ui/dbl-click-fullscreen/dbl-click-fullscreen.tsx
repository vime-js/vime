import {
  h, Component, Host, Prop, Watch, State,
} from '@stencil/core';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withPlayerContext } from '../../core/player/PlayerContext';
import { IS_MOBILE } from '../../../utils/support';
import { findRootPlayer } from '../../core/player/utils';
import { findUIRoot } from '../ui/utils';

@Component({
  tag: 'vime-dbl-click-fullscreen',
  styleUrl: 'dbl-click-fullscreen.scss',
})
export class DblClickFullscreen {
  @State() canSetFullscreen = false;

  /**
   * By default this is disabled on mobile to not interfere with playback, set this to `true` to
   * enable it.
   */
  @Prop() useOnMobile = false;

  /**
   * @internal
   */
  @Prop() isFullscreenActive: PlayerProps['isFullscreenActive'] = true;

  /**
   * @internal
   */
  @Prop() isVideoView: PlayerProps['isVideoView'] = false;

  /**
   * @internal
   */
  @Prop() playbackReady: PlayerProps['playbackReady'] = false;

  @Watch('playbackReady')
  async onPlaybackReadyChange() {
    const player = findRootPlayer(this);
    this.canSetFullscreen = await player.canSetFullscreen();
  }

  constructor() {
    withPlayerContext(this, [
      'playbackReady',
      'isFullscreenActive',
      'isVideoView',
    ]);
  }

  private onTriggerClickToPlay() {
    const ui = findUIRoot(this);
    const clickToPlay = ui?.querySelector('vime-click-to-play');
    clickToPlay?.dispatchEvent(new Event('click'));
  }

  private onToggleFullscreen() {
    const player = findRootPlayer(this);
    this.isFullscreenActive ? player.exitFullscreen() : player.enterFullscreen();
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
      <Host
        class={{
          enabled: this.playbackReady
            && this.canSetFullscreen
            && this.isVideoView
            && (!IS_MOBILE || this.useOnMobile),
        }}
        onClick={this.onClick.bind(this)}
      />
    );
  }
}
