import { Component, h, Prop, State, Watch } from '@stencil/core';

import { PlayerProps } from '../../core/player/PlayerProps';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';

/**
 * A temporary placeholder that is used while content is loading. The implementation was inspired
 * by [Shoelace](https://github.com/shoelace-style/shoelace), thanks Cory!
 */
@Component({
  tag: 'vm-skeleton',
  styleUrl: 'skeleton.css',
  shadow: true,
})
export class Skeleton {
  @State() hidden = false;

  /**
   * Determines which animation effect the skeleton will use.
   * */
  @Prop() effect: 'sheen' | 'none' = 'sheen';

  /** @internal */
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
    withComponentRegistry(this);
    withPlayerContext(this, ['ready']);
  }

  render() {
    return (
      <div
        class={{
          skeleton: true,
          hidden: this.hidden,
          sheen: this.effect === 'sheen',
        }}
      >
        <div class="indicator" />
      </div>
    );
  }
}
