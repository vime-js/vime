import { Component, h, Method, Prop } from '@stencil/core';

import {
  createDispatcher,
  Dispatcher,
} from '../../core/player/PlayerDispatcher';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';

/**
 * Enables toggling playback by clicking the player.
 */
@Component({
  tag: 'vm-click-to-play',
  styleUrl: 'click-to-play.css',
  shadow: true,
})
export class ClickToPlay {
  private dispatch!: Dispatcher;

  /**
   * By default this is disabled on mobile to not interfere with playback, set this to `true` to
   * enable it.
   */
  @Prop() useOnMobile = false;

  /** @internal */
  @Prop() paused: PlayerProps['paused'] = true;

  /** @internal */
  @Prop() isVideoView: PlayerProps['isVideoView'] = false;

  /** @internal */
  @Prop() isMobile: PlayerProps['isMobile'] = false;

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, ['paused', 'isVideoView', 'isMobile']);
  }

  connectedCallback() {
    this.dispatch = createDispatcher(this);
  }

  /** @internal */
  @Method()
  async forceClick() {
    this.onClick();
  }

  onClick() {
    this.dispatch('paused', !this.paused);
  }

  render() {
    return (
      <div
        class={{
          clickToPlay: true,
          enabled: this.isVideoView && (!this.isMobile || this.useOnMobile),
        }}
        onClick={this.onClick.bind(this)}
      />
    );
  }
}
