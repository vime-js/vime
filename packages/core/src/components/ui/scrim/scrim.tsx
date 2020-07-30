import {
  h, Component, Host, State, Watch, Prop, Event, EventEmitter,
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

  /**
   * Emitted when the scrim will be shown.
   */
  @Event({ bubbles: false }) show!: EventEmitter<void>;

  /**
   * Emitted when the scrim will be hidden.
   */
  @Event({ bubbles: false }) hide!: EventEmitter<void>;

  @Watch('active')
  @Watch('isEnabled')
  onVisibilityChange() {
    (this.isEnabled && this.active) ? this.show.emit() : this.hide.emit();
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
