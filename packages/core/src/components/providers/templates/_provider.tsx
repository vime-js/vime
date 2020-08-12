import {
  h, Prop, Method, Event, EventEmitter,
} from '@stencil/core';
import { MediaProvider, openProviderWormhole, MediaProviderAdapter } from '../MediaProvider';
import { createPlayerStateDispatcher, PlayerStateDispatcher } from '../../core/player/PlayerState';
import { PlayerProp } from '../../core/player/PlayerProp';
import { ViewType } from '../../core/player/ViewType';

// @component
export class Name implements MediaProvider {
  private dispatch!: PlayerStateDispatcher;

  /**
   * @internal
   */
  @Prop() language = 'en';

  /**
   * @internal
   */
  @Prop() autoplay = false;

  /**
   * @internal
   */
  @Prop() controls = false;

  /**
   * @internal
   */
  @Prop() debug = false;

  /**
   * @internal
   */
  @Prop() loop = false;

  /**
   * @internal
   */
  @Prop() muted = false;

  /**
   * @internal
   */
  @Prop() playsinline = false;

  /**
   * @internal
   */
  // @TODO we have to call this event as soon as media starts loading.
  @Event() vLoadStart!: EventEmitter<void>;

  connectedCallback() {
    this.dispatch = createPlayerStateDispatcher(this);
    // @TODO change this if view is of type audio.
    this.dispatch(PlayerProp.ViewType, ViewType.Video);
  }

  /**
   * @internal
   */
  @Method()
  async getAdapter(): Promise<MediaProviderAdapter> {
    // @TODO implement the following, commented out methods are optional and can be deleted.
    return {
      getInternalPlayer: async () => {},
      play: async () => {},
      pause: async () => {},
      canPlay: async () => false,
      setCurrentTime: async (time: number) => { console.log(time); },
      setMuted: async (muted: boolean) => { console.log(muted); },
      setVolume: async (volume: number) => { console.log(volume); },
      // canSetPlaybackRate: async () => false,
      // setPlaybackRate: async (playbackRate: number) => { console.log(playbackRate); },
      // canSetPlaybackQuality: async () => false,
      // setPlaybackQuality: async (playbackQuality: string) => { console.log(playbackQuality); },
      // canSetFullscreen: async () => false,
      // enterFullscreen: async () => {},
      // exitFullscreen: async () => {},
      // canSetPiP: async () => {},
      // enterPiP: async () => {},
      // exitPiP: async () => {},
    };
  }

  // @TODO implement the render function.
  render() {
    return <div />;
  }
}

openProviderWormhole(Name);
