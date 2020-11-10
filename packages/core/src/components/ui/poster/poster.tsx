import {
  h, Component, Prop, State, Watch, Host, Event, EventEmitter, Element,
} from '@stencil/core';
import { withPlayerContext } from '../../core/player/PlayerContext';
import { PlayerProps } from '../../core/player/PlayerProps';
import { isNull, isUndefined } from '../../../utils/unit';
import { LazyLoader } from '../../core/player/LazyLoader';

@Component({
  tag: 'vime-poster',
  styleUrl: 'poster.scss',
})
export class Poster {
  private lazyLoader!: LazyLoader;

  @Element() el!: HTMLVimePosterElement;

  @State() isHidden = true;

  @State() isActive = false;

  @State() hasLoaded = false;

  /**
   * How the poster image should be resized to fit the container (sets the `object-fit` property).
   */
  @Prop() fit?: 'fill' | 'contain' | 'cover' | 'scale-down' | 'none' = 'cover';

  /**
   * @internal
   */
  @Prop() isVideoView: PlayerProps['isVideoView'] = false;

  /**
   * @internal
   */
  @Prop() currentPoster?: PlayerProps['currentPoster'];

  @Watch('currentPoster')
  onCurrentPosterChange() {
    this.hasLoaded = false;
  }

  /**
   * @internal
   */
  @Prop() mediaTitle?: PlayerProps['mediaTitle'];

  /**
   * @internal
   */
  @Prop() playbackStarted: PlayerProps['playbackStarted'] = false;

  /**
   * @internal
   */
  @Prop() currentTime: PlayerProps['currentTime'] = 0;

  /**
   * Emitted when the poster has loaded.
   */
  @Event({ bubbles: false }) vLoaded!: EventEmitter<void>;

  /**
   * Emitted when the poster will be shown.
   */
  @Event({ bubbles: false }) vWillShow!: EventEmitter<void>;

  /**
   * Emitted when the poster will be hidden.
   */
  @Event({ bubbles: false }) vWillHide!: EventEmitter<void>;

  constructor() {
    withPlayerContext(this, [
      'mediaTitle',
      'currentPoster',
      'playbackStarted',
      'currentTime',
      'isVideoView',
    ]);
  }

  connectedCallback() {
    this.lazyLoader = new LazyLoader(this.el, ['data-src'], (el) => {
      const src = el.getAttribute('data-src');
      el.removeAttribute('src');
      if (!isNull(src)) el.setAttribute('src', src);
    });

    this.onEnabledChange();
    this.onActiveChange();
  }

  disconnectedCallback() {
    this.lazyLoader.destroy();
  }

  private onVisibilityChange() {
    (!this.isHidden && this.isActive) ? this.vWillShow.emit() : this.vWillHide.emit();
  }

  @Watch('isVideoView')
  @Watch('currentPoster')
  onEnabledChange() {
    this.isHidden = !this.isVideoView || isUndefined(this.currentPoster);
    this.onVisibilityChange();
  }

  @Watch('currentTime')
  @Watch('playbackStarted')
  onActiveChange() {
    this.isActive = !this.playbackStarted || this.currentTime <= 0.1;
    this.onVisibilityChange();
  }

  private onPosterLoad() {
    this.vLoaded.emit();
    this.hasLoaded = true;
  }

  render() {
    return (
      <Host
        class={{
          hidden: this.isHidden,
          active: this.isActive && this.hasLoaded,
        }}
      >
        <img
          class="lazy"
          data-src={this.currentPoster}
          alt={!isUndefined(this.mediaTitle) ? `${this.mediaTitle} Poster` : 'Media Poster'}
          style={{ objectFit: this.fit }}
          onLoad={this.onPosterLoad.bind(this)}
        />
      </Host>
    );
  }
}
