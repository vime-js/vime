import {
  h, Component, Host, Prop,
} from '@stencil/core';
import { createPlayerStateDispatcher, PlayerStateDispatcher } from '../../core/player/PlayerState';
import { PlayerProp, PlayerProps } from '../../core/player/PlayerProp';
import { openPlayerWormhole } from '../../core/player/PlayerWormhole';
import { IS_MOBILE } from '../../../utils/support';

@Component({
  tag: 'vime-click-to-play',
  styleUrl: 'click-to-play.scss',
})
export class ClickToPlay {
  private dispatch!: PlayerStateDispatcher;

  /**
   * By default this is disabled on mobile to not interfere with playback, set this to `true` to
   * enable it.
   */
  @Prop() useOnMobile = false;

  /**
   * @internal
   */
  @Prop() paused: PlayerProps[PlayerProp.Paused] = true;

  /**
   * @internal
   */
  @Prop() isVideoView: PlayerProps[PlayerProp.IsVideoView] = false;

  componentWillLoad() {
    this.dispatch = createPlayerStateDispatcher(this);
  }

  private onClick() {
    this.dispatch(PlayerProp.Paused, !this.paused);
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

openPlayerWormhole(ClickToPlay, [
  PlayerProp.Paused,
  PlayerProp.IsVideoView,
]);
