import { h, Component, Prop } from '@stencil/core';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import { isUndefined } from '../../../utils/unit';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';

@Component({
  tag: 'vm-scrim',
  styleUrl: 'scrim.css',
  shadow: true,
})
export class Scrim {
  /**
   * If this prop is defined, a dark gradient that smoothly fades out without being noticed will be
   * used instead of a set color. This prop also sets the direction in which the dark end of the
   * gradient should start. If the direction is set to `up`, the dark end of the gradient will
   * start at the bottom of the player and fade out to the center. If the direction is set to
   * `down`, the gradient will start at the top of the player and fade out to the center.
   */
  @Prop() gradient?: 'up' | 'down';

  /** @internal */
  @Prop() isVideoView: PlayerProps['isVideoView'] = false;

  /** @internal */
  @Prop() isControlsActive: PlayerProps['isControlsActive'] = false;

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, ['isVideoView', 'isControlsActive']);
  }

  render() {
    return (
      <div
        class={{
          scrim: true,
          gradient: !isUndefined(this.gradient),
          gradientUp: this.gradient === 'up',
          gradientDown: this.gradient === 'down',
          hidden: !this.isVideoView,
          active: this.isControlsActive,
        }}
      />
    );
  }
}
