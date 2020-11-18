/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import {
  h, Host, Component, Prop,
} from '@stencil/core';
import {
  createDispatcher, Dispatcher, PlayerProps, withPlayerContext,
} from '@vime/core';

@Component({
  tag: 'tap-sides-to-seek',
  styleUrl: 'tap-sides-to-seek.css',
  shadow: true,
})
export class TapSidesToSeek {
  private dispatch!: Dispatcher;

  /** @internal */
  @Prop() currentTime: PlayerProps['currentTime'] = 0;

  /** @internal */
  @Prop() duration: PlayerProps['duration'] = -1;

  connectedCallback() {
    this.dispatch = createDispatcher(this);
  }

  private onSeekBackward() {
    if (this.currentTime < 5) return;
    // We are dispatching an update to the player to change the `currentTime` property.
    this.dispatch('currentTime', this.currentTime - 5);
  }

  private onSeekForward() {
    if (this.currentTime > (this.duration - 5)) return;
    this.dispatch('currentTime', this.currentTime + 5);
  }

  render() {
    return (
      <Host>
        <div
          class="tapTarget"
          onClick={this.onSeekBackward.bind(this)}
        />

        <div class="spacer" />

        <div
          class="tapTarget"
          onClick={this.onSeekForward.bind(this)}
        />
      </Host>
    );
  }
}

withPlayerContext(TapSidesToSeek, [
  'currentTime',
  'duration',
]);
