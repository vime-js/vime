import {
  h, Component, State, Prop, Watch, Host, Event, EventEmitter,
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
   * Emitted when the spinner will be shown.
   */
  @Event({ bubbles: false }) show!: EventEmitter<void>;

  /**
   * Emitted when the spinner will be hidden.
   */
  @Event({ bubbles: false }) hide!: EventEmitter<void>;

  @Watch('isVideoView')
  onVideoViewChange() {
    this.isEnabled = this.isVideoView;
    this.onVisiblityChange();
  }

  /**
   * @internal
   */
  @Prop() buffering!: PlayerProps[PlayerProp.Buffering];

  @Watch('buffering')
  onActiveChange() {
    this.isActive = this.buffering;
    this.onVisiblityChange();
  }

  private onVisiblityChange() {
    (this.isEnabled && this.isActive) ? this.show.emit() : this.hide.emit();
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
