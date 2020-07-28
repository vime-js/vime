import {
  h, Component, State, Prop, Watch, Host,
} from '@stencil/core';
import { PlayerProps, PlayerProp } from '../../core/player/PlayerProp';
import { openPlayerWormhole } from '../../core/player/PlayerWormhole';

@Component({
  tag: 'vime-spinner',
  styleUrl: 'spinner.scss',
})
export class Spinner {
  @State() isEnabled = false;

  @State() isActive = false;

  /**
   * @internal
   */
  @Prop() isVideoView!: PlayerProps[PlayerProp.IsVideoView];

  /**
   * @internal
   */
  @Prop() buffering!: PlayerProps[PlayerProp.Buffering];

  @Watch('isVideoView')
  onEnabledChange() {
    this.isEnabled = this.isVideoView;
  }

  @Watch('buffering')
  onActiveChange() {
    this.isActive = this.buffering;
  }

  render() {
    return (
      <Host
        class={{
          enabled: this.isEnabled,
          active: this.isActive,
        }}
      >
        <div>Loading...</div>
      </Host>
    );
  }
}

openPlayerWormhole(Spinner, [
  PlayerProp.IsVideoView,
  PlayerProp.Buffering,
]);
