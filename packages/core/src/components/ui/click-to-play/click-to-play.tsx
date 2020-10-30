import {
  h, Component, Host, Prop,
} from '@stencil/core';
import { createDispatcher, Dispatcher } from '../../core/player/PlayerDispatcher';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withPlayerContext } from '../../core/player/PlayerContext';
import { IS_MOBILE } from '../../../utils/support';

@Component({
  tag: 'vime-click-to-play',
  styleUrl: 'click-to-play.scss',
})
export class ClickToPlay {
  private dispatch!: Dispatcher;

  /**
   * By default this is disabled on mobile to not interfere with playback, set this to `true` to
   * enable it.
   */
  @Prop() useOnMobile = false;

  /**
   * @internal
   */
  @Prop() paused: PlayerProps['paused'] = true;

  /**
   * @internal
   */
  @Prop() isVideoView: PlayerProps['isVideoView'] = false;

  constructor() {
    withPlayerContext(this, ['paused', 'isVideoView']);
  }

  connectedCallback() {
    this.dispatch = createDispatcher(this);
  }

  private onClick() {
    this.dispatch('paused', !this.paused);
  }

  render() {
    return (
      <Host
        class={{
          enabled: this.isVideoView && (!IS_MOBILE || this.useOnMobile),
        }}
        onClick={this.onClick.bind(this)}
      />
    );
  }
}
