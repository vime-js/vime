import {
  h, Prop, Method, Event, EventEmitter,
} from '@stencil/core';
import {
  MediaProvider, withProviderContext, MediaProviderAdapter, withProviderConnect,
} from '../MediaProvider';
import { ViewType } from '../../core/player/ViewType';
import { createProviderDispatcher, ProviderDispatcher } from '../ProviderDispatcher';
import { Logger } from '../../core/player/PlayerLogger';

// @component
export class Name implements MediaProvider {
  private dispatch!: ProviderDispatcher;

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
  @Prop() logger?: Logger;

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

  constructor() {
    withProviderConnect(this);
    withProviderContext(this);
  }

  connectedCallback() {
    this.dispatch = createProviderDispatcher(this);
    // @TODO change this if view is of type audio.
    this.dispatch('viewType', ViewType.Video);
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
      setCurrentTime: async (time: number) => { this.logger!.log(time); },
      setMuted: async (muted: boolean) => { this.logger!.log(muted); },
      setVolume: async (volume: number) => { this.logger!.log(volume); },
      // canSetPlaybackRate: async () => false,
      // setPlaybackRate: async (playbackRate: number) => {},
      // canSetPlaybackQuality: async () => false,
      // setPlaybackQuality: async (playbackQuality: string) => {},
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
