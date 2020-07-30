import {
  h, Component, Prop, State, Watch, Host, Event, EventEmitter,
} from '@stencil/core';
import { openPlayerWormhole } from '../../core/player/PlayerWormhole';
import { PlayerProp, PlayerProps } from '../../core/player/PlayerProp';
import { isUndefined } from '../../../utils/unit';

@Component({
  tag: 'vime-poster',
  styleUrl: 'poster.scss',
})
export class Poster {
  @State() isHidden = true;

  @State() isActive = false;

  /**
   * How the poster image should be resized to fit the container (sets the `object-fit` property).
   */
  @Prop() fit?: 'fill' | 'contain' | 'cover' | 'scale-down' | 'none' = 'cover';

  /**
   * @internal
   */
  @Prop() isVideoView: PlayerProps[PlayerProp.IsVideoView] = false;

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
  @Prop() playbackStarted: PlayerProps[PlayerProp.PlaybackStarted] = false;

  /**
   * Emitted when the poster has loaded.
   */
  @Event({ bubbles: false }) loaded!: EventEmitter<void>;

  /**
   * Emitted when the poster will be shown.
   */
  @Event({ bubbles: false }) willShow!: EventEmitter<void>;

  /**
   * Emitted when the poster will be hidden.
   */
  @Event({ bubbles: false }) willHide!: EventEmitter<void>;

  connectedCallback() {
    this.onEnabledChange();
    this.onActiveChange();
  }

  private onVisibilityChange() {
    (!this.isHidden && this.isActive) ? this.willShow.emit() : this.willHide.emit();
  }

  @Watch('isVideoView')
  @Watch('currentPoster')
  onEnabledChange() {
    this.isHidden = !this.isVideoView || isUndefined(this.currentPoster);
    this.onVisibilityChange();
  }

  @Watch('playbackStarted')
  onActiveChange() {
    this.isActive = !this.playbackStarted;
    this.onVisibilityChange();
  }

  private onPosterLoad() {
    this.loaded.emit();
  }

  render() {
    return (
      <Host
        class={{
          hidden: this.isHidden,
          active: this.isActive,
        }}
      >
        <img
          src={this.currentPoster}
          alt={!isUndefined(this.mediaTitle) ? `${this.mediaTitle} Poster` : 'Media Poster'}
          style={{ objectFit: this.fit }}
          onLoad={this.onPosterLoad.bind(this)}
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
