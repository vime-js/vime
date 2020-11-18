import {
  h, Component, State, Prop, Watch, Event, EventEmitter,
} from '@stencil/core';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import { Provider } from '../../providers/Provider';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';

@Component({
  tag: 'vm-spinner',
  styleUrl: 'spinner.css',
  shadow: true,
})
export class Spinner {
  private blacklist = [Provider.YouTube];

  @State() isHidden = true;

  @State() isActive = false;

  /** @internal */
  @Prop() isVideoView: PlayerProps['isVideoView'] = false;

  @Watch('isVideoView')
  onVideoViewChange() {
    this.isHidden = !this.isVideoView;
    this.onVisiblityChange();
  }

  /** @internal */
  @Prop() currentProvider?: PlayerProps['currentProvider'];

  /**
   * Whether the spinner should be active when the player is booting or media is loading.
   */
  @Prop() showWhenMediaLoading = false;

  /**
   * Emitted when the spinner will be shown.
   */
  @Event({ bubbles: false }) vmWillShow!: EventEmitter<void>;

  /**
   * Emitted when the spinner will be hidden.
   */
  @Event({ bubbles: false }) vmWillHide!: EventEmitter<void>;

  /** @internal */
  @Prop() playbackReady: PlayerProps['playbackReady'] = false;

  /** @internal */
  @Prop() buffering: PlayerProps['buffering'] = false;

  @Watch('buffering')
  @Watch('playbackReady')
  onActiveChange() {
    this.isActive = this.buffering || (this.showWhenMediaLoading && !this.playbackReady);
    this.onVisiblityChange();
  }

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, [
      'isVideoView',
      'buffering',
      'playbackReady',
      'currentProvider',
    ]);
  }

  private onVisiblityChange() {
    (!this.isHidden && this.isActive) ? this.vmWillShow.emit() : this.vmWillHide.emit();
  }

  render() {
    return (
      <div
        class={{
          spinner: true,
          hidden: this.isHidden || this.blacklist.includes(this.currentProvider!),
          active: this.isActive,
        }}
      >
        <div
          class={{
            spin: true,
            active: this.isActive,
          }}
        >
          Loading...
        </div>
      </div>
    );
  }
}
