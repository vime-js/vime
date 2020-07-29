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

  /**
   * Whether the scrim is visible or not.
   */
  @Prop() active = false;

  @Watch('isVideoView')
  onEnabledChange() {
    this.isEnabled = this.isVideoView;
  }

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
