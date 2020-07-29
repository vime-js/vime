import {
  h, Component, Host, State, Watch, Prop,
} from '@stencil/core';
import { PlayerProps, PlayerProp } from '../../core/player/PlayerProp';
import { openPlayerWormhole } from '../../core/player/PlayerWormhole';

@Component({
  tag: 'vime-scrim',
  styleUrl: 'scrim.scss',
})
export class Scrim {
  @State() isEnabled = false;

  /**
   * @internal
   */
  @Prop() isVideoView!: PlayerProps[PlayerProp.IsVideoView];

  @Watch('isVideoView')
  onVideoViewChange() {
    this.isEnabled = this.isVideoView;
  }

  /**
   * Whether the scrim is visible or not.
   */
  @Prop() active = false;

  render() {
    return (
      <Host
        class={{
          enabled: this.isEnabled,
          active: this.active,
        }}
      />
    );
  }
}

openPlayerWormhole(Scrim, [PlayerProp.IsVideoView]);
