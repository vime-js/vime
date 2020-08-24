import {
  h, Component, Host, Prop,
} from '@stencil/core';
import { createPlayerDispatcher, PlayerDispatcher } from '../../core/player/PlayerDispatcher';
import { PlayerProp, PlayerProps } from '../../core/player/PlayerProp';
import { withPlayerContext } from '../../core/player/PlayerContext';
import { IS_MOBILE } from '../../../utils/support';

@Component({
  tag: 'vime-click-to-play',
  styleUrl: 'click-to-play.scss',
})
export class ClickToPlay {
  private dispatch!: PlayerDispatcher;

  /**
   * By default this is disabled on mobile to not interfere with playback, set this to `true` to
   * enable it.
   */
  @Prop() useOnMobile = false;

  /**
   * @internal
   */
  @Prop() paused: PlayerProps[PlayerProp.paused] = true;

  /**
   * @internal
   */
  @Prop() isVideoView: PlayerProps[PlayerProp.isVideoView] = false;

  componentWillLoad() {
    this.dispatch = createPlayerDispatcher(this);
  }

  private onClick() {
    this.dispatch(PlayerProp.paused, !this.paused);
  }

  render() {
    return (
      <Host
        class={{
          enabled: this.isVideoView && (!IS_MOBILE || this.useOnMobile),
        }}
        onClick={this.onClick.bind(this)}
      />
    );
  }
}

withPlayerContext(ClickToPlay, [
  PlayerProp.paused,
  PlayerProp.isVideoView,
]);
