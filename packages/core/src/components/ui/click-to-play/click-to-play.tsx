/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import {
  h, Component, Prop, Method,
} from '@stencil/core';
import { createDispatcher, Dispatcher } from '../../core/player/PlayerDispatcher';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';

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
