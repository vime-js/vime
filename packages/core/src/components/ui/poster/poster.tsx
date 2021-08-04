import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { isNull, isUndefined } from '../../../utils/unit';
import { LazyLoader } from '../../core/player/LazyLoader';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';

/**
 * Loads the poster set in the player prop `currentPoster` and displays it. The poster will automatically
 * dissapear once playback starts.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/poster/poster.png"
 *   alt="Vime poster component"
 * />
 */
@Component({
  tag: 'vm-poster',
  styleUrl: 'poster.css',
  shadow: true,
})
export class Poster {
  private lazyLoader!: LazyLoader;

  @Element() host!: HTMLVmPosterElement;

  @State() isHidden = true;

  @State() isActive = false;

  @State() hasLoaded = false;

  /**
   * How the poster image should be resized to fit the container (sets the `object-fit` property).
   */
  @Prop() fit?: 'fill' | 'contain' | 'cover' | 'scale-down' | 'none' = 'cover';

  /** @internal */
  @Prop() isVideoView: PlayerProps['isVideoView'] = false;

  /** @internal */
  @Prop() currentPoster?: PlayerProps['currentPoster'];

  @Watch('currentPoster')
  onCurrentPosterChange() {
    this.hasLoaded = false;
    this.lazyLoader?.onMutation();
  }

  /** @internal */
  @Prop() mediaTitle?: PlayerProps['mediaTitle'];

  /** @internal */
  @Prop() playbackStarted: PlayerProps['playbackStarted'] = false;

  /** @internal */
  @Prop() currentTime: PlayerProps['currentTime'] = 0;

  /**
   * Emitted when the poster has loaded.
   */
  @Event({ bubbles: false }) vmLoaded!: EventEmitter<void>;

  /**
   * Emitted when the poster will be shown.
   */
  @Event({ bubbles: false }) vmWillShow!: EventEmitter<void>;

  /**
   * Emitted when the poster will be hidden.
   */
  @Event({ bubbles: false }) vmWillHide!: EventEmitter<void>;

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, [
      'mediaTitle',
      'currentPoster',
      'playbackStarted',
      'currentTime',
      'isVideoView',
    ]);
  }

  connectedCallback() {
    this.lazyLoader = new LazyLoader(this.host, ['data-src', 'src'], el => {
      const src = el.getAttribute('data-src');
      el.removeAttribute('src');
      if (!isNull(src)) {
        el.setAttribute('src', src);
      }
    });

    this.onEnabledChange();
    this.onActiveChange();
  }

  disconnectedCallback() {
    this.lazyLoader.destroy();
  }

  private onVisibilityChange() {
    !this.isHidden && this.isActive
      ? this.vmWillShow.emit()
      : this.vmWillHide.emit();
  }

  @Watch('isVideoView')
  onEnabledChange() {
    this.isHidden = !this.isVideoView;
    this.onVisibilityChange();
  }

  @Watch('currentTime')
  @Watch('playbackStarted')
  onActiveChange() {
    this.isActive = !this.playbackStarted || this.currentTime <= 0.1;
    this.onVisibilityChange();
  }

  private onPosterLoad() {
    this.vmLoaded.emit();
    this.hasLoaded = true;
  }

  render() {
    return (
      <div
        class={{
          poster: true,
          hidden: this.isHidden,
          active: this.isActive && this.hasLoaded,
        }}
      >
        <img
          class="lazy"
          data-src={this.currentPoster}
          alt={
            !isUndefined(this.mediaTitle)
              ? `${this.mediaTitle} Poster`
              : 'Media Poster'
          }
          style={{ objectFit: this.fit }}
          onLoad={this.onPosterLoad.bind(this)}
        />
      </div>
    );
  }
}
