import {
  h, Host, Component, Prop, State, Watch,
} from '@stencil/core';
import { withPlayerContext } from '../../core/player/PlayerContext';
import { PlayerProps } from '../../core/player/PlayerProps';

@Component({
  tag: 'vime-skeleton',
  styleUrl: 'skeleton.scss',
})
export class Skeleton {
  @State() hidden = false;

  /**
   * Determines which effect the skeleton will use.
   * */
  @Prop() effect: 'sheen' | 'none' = 'sheen';

  /**
   * @internal
   */
  @Prop() ready: PlayerProps['ready'] = false;

  @Watch('ready')
  onReadyChange() {
    if (!this.ready) {
      this.hidden = false;
    } else {
      setTimeout(() => {
        this.hidden = true;
      }, 500);
    }
  }

  constructor() {
    withPlayerContext(this, ['ready']);
  }

  render() {
    return (
      <Host
        class={{
          hidden: this.hidden,
          sheen: (this.effect === 'sheen'),
        }}
      >
        <div class="indicator" />
      </Host>
    );
  }
}
