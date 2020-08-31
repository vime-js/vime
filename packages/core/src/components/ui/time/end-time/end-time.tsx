import { h, Component, Prop } from '@stencil/core';
import { withPlayerContext } from '../../../core/player/PlayerContext';
import { PlayerProps } from '../../../core/player/PlayerProps';

@Component({
  tag: 'vime-end-time',
})
export class EndTime {
  /**
   * @internal
   */
  @Prop() duration: PlayerProps['duration'] = -1;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps['i18n'] = {};

  /**
   * Whether the time should always show the hours unit, even if the time is less than
   * 1 hour (eg: `20:35` -> `00:20:35`).
   */
  @Prop() alwaysShowHours = false;

  render() {
    return (
      <vime-time
        label={this.i18n.duration}
        seconds={Math.max(0, this.duration)}
        alwaysShowHours={this.alwaysShowHours}
      />
    );
  }
}

withPlayerContext(EndTime, [
  'duration',
  'i18n',
]);
