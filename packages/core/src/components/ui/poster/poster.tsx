import {
  h, Component, Prop, State, Watch, Host,
} from '@stencil/core';
import { openPlayerWormhole } from '../../core/player/PlayerWormhole';
import { PlayerProp, PlayerProps } from '../../core/player/PlayerProp';
import { isUndefined } from '../../../utils/unit';

@Component({
  tag: 'vime-poster',
  styleUrl: 'poster.scss',
})
export class Poster {
  @State() isEnabled = false;

  @State() isActive = false;

  /**
   * How the poster image should be resized to fit the container (sets the `object-fit` property).
   */
  @Prop() fit?: 'fill' | 'contain' | 'cover' | 'scale-down' | 'none' = 'cover';

  /**
   * @internal
   */
  @Prop() isVideoView!: PlayerProps[PlayerProp.IsVideoView];

  /**
   * @internal
   */
  @Prop() currentPoster?: PlayerProps[PlayerProp.CurrentPoster];

  /**
   * @internal
   */
  @Prop() mediaTitle?: PlayerProps[PlayerProp.MediaTitle];

  /**
   * @internal
   */
  @Prop() playbackStarted!: PlayerProps[PlayerProp.PlaybackStarted];

  @Watch('isVideoView')
  @Watch('currentPoster')
  onEnabledChange() {
    this.isEnabled = this.isVideoView && !isUndefined(this.currentPoster);
  }

  @Watch('playbackStarted')
  onActiveChange() {
    this.isActive = !this.playbackStarted;
  }

  render() {
    return (
      <Host
        class={{
          enabled: this.isEnabled,
          active: this.isActive,
        }}
      >
        <img
          style={{ objectFit: this.fit }}
          alt={!isUndefined(this.mediaTitle) ? `${this.mediaTitle} Poster` : 'Media Poster'}
          src={this.currentPoster}
        />
      </Host>
    );
  }
}

openPlayerWormhole(Poster, [
  PlayerProp.MediaTitle,
  PlayerProp.CurrentPoster,
  PlayerProp.PlaybackStarted,
  PlayerProp.IsVideoView,
]);
