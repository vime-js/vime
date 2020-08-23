import {
  h, Component, State, Prop, Watch, Host, Event, EventEmitter,
} from '@stencil/core';
import { PlayerProps, PlayerProp } from '../../core/player/PlayerProp';
import { withPlayerContext } from '../../core/player/PlayerContext';

@Component({
  tag: 'vime-spinner',
  styleUrl: 'spinner.scss',
})
export class Spinner {
  @State() isHidden = true;

  @State() isActive = false;

  /**
   * @internal
   */
  @Prop() isVideoView: PlayerProps[PlayerProp.IsVideoView] = false;

  /**
   * Emitted when the spinner will be shown.
   */
  @Event({ bubbles: false }) vWillShow!: EventEmitter<void>;

  /**
   * Emitted when the spinner will be hidden.
   */
  @Event({ bubbles: false }) vWillHide!: EventEmitter<void>;

  @Watch('isVideoView')
  onVideoViewChange() {
    this.isHidden = !this.isVideoView;
    this.onVisiblityChange();
  }

  /**
   * @internal
   */
  @Prop() buffering: PlayerProps[PlayerProp.Buffering] = false;

  @Watch('buffering')
  onActiveChange() {
    this.isActive = this.buffering;
    this.onVisiblityChange();
  }

  private onVisiblityChange() {
    (!this.isHidden && this.isActive) ? this.vWillShow.emit() : this.vWillHide.emit();
  }

  render() {
    return (
      <Host
        class={{
          hidden: this.isHidden,
          active: this.isActive,
        }}
      >
        <div>Loading...</div>
      </Host>
    );
  }
}

withPlayerContext(Spinner, [
  PlayerProp.IsVideoView,
  PlayerProp.Buffering,
]);
