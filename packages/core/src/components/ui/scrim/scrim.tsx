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
  @State() isHidden = true;

  /**
   * @internal
   */
  @Prop() isVideoView: PlayerProps[PlayerProp.IsVideoView] = false;

  @Watch('isVideoView')
  onVideoViewChange() {
    this.isHidden = !this.isVideoView;
  }

  /**
   * Whether the scrim is visible or not.
   */
  @Prop() active = false;

  /**
   * Emitted when the scrim will be shown.
   */
  @Event({ bubbles: false }) willShow!: EventEmitter<void>;

  /**
   * Emitted when the scrim will be hidden.
   */
  @Event({ bubbles: false }) willHide!: EventEmitter<void>;

  @Watch('active')
  @Watch('isHidden')
  onVisibilityChange() {
    (!this.isHidden && this.active) ? this.willShow.emit() : this.willHide.emit();
  }

  render() {
    return (
      <Host
        class={{
          hidden: this.isHidden,
          active: this.active,
        }}
      >
        <div />
      </Host>
    );
  }
}

openPlayerWormhole(Scrim, [PlayerProp.IsVideoView]);
