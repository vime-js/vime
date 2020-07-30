import {
  h, Component, Host, Prop,
} from '@stencil/core';
import { createPlayerStateDispatcher, PlayerStateDispatcher } from '../../core/player/PlayerState';
import { PlayerProp, PlayerProps } from '../../core/player/PlayerProp';
import { openPlayerWormhole } from '../../core/player/PlayerWormhole';

@Component({
  tag: 'vime-click-to-play',
  styleUrl: 'click-to-play.scss',
})
export class ClickToPlay {
  private dispatch!: PlayerStateDispatcher;

  /**
   * @internal
   */
  @Prop() paused!: PlayerProps[PlayerProp.Paused];

  /**
   * @internal
   */
  @Prop() isVideoView!: PlayerProps[PlayerProp.IsVideoView];

  connectedCallback() {
    this.dispatch = createPlayerStateDispatcher(this);
  }

  private onClick() {
    this.dispatch(PlayerProp.Paused, !this.paused);
  }

  render() {
    return (
      <Host
        class={{
          enabled: this.isVideoView,
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
