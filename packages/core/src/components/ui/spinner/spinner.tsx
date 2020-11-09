import {
  h, Component, State, Prop, Watch, Host, Event, EventEmitter,
} from '@stencil/core';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withPlayerContext } from '../../core/player/PlayerContext';
import { Provider } from '../../providers/Provider';

@Component({
  tag: 'vime-spinner',
  styleUrl: 'spinner.scss',
})
export class Spinner {
  private blacklist = [Provider.YouTube];

  @State() isHidden = true;

  @State() isActive = false;

  /**
   * @internal
   */
  @Prop() isVideoView: PlayerProps['isVideoView'] = false;

  /**
   * @internal
   */
  @Prop() currentProvider?: PlayerProps['currentProvider'];

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
  @Prop() buffering: PlayerProps['buffering'] = false;

  @Watch('buffering')
  onActiveChange() {
    this.isActive = this.buffering;
    this.onVisiblityChange();
  }

  constructor() {
    withPlayerContext(this, [
      'isVideoView',
      'buffering',
      'currentProvider',
    ]);
  }

  private onVisiblityChange() {
    (!this.isHidden && this.isActive) ? this.vWillShow.emit() : this.vWillHide.emit();
  }

  render() {
    return (
      <Host
        class={{
          hidden: this.isHidden || this.blacklist.includes(this.currentProvider!),
          active: this.isActive,
        }}
      >
        <div>Loading...</div>
      </Host>
    );
  }
}
