import {
  Prop, Method, Component, Event, EventEmitter,
} from '@stencil/core';
import { MediaProvider, MockMediaProviderAdapter, openProviderWormhole } from '../MediaProvider';
import { createPlayerStateDispatcher, PlayerStateDispatcher } from '../../core/player/PlayerState';
import { PlayerProp } from '../../core/player/PlayerProp';

@Component({
  tag: 'vime-faketube',
  styleUrl: 'faketube.css',
})
export class FakeTube implements MediaProvider {
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
  @Event() vLoadStart!: EventEmitter<void>;

  connectedCallback() {
    this.dispatch = createPlayerStateDispatcher(this);
  }

  /**
   * Returns a mock adapter.
   */
  @Method()
  async getAdapter(): Promise<MockMediaProviderAdapter> {
    return {
      getInternalPlayer: jest.fn(),
      play: jest.fn(),
      pause: jest.fn(),
      canPlay: jest.fn(),
      setCurrentTime: jest.fn(),
      setMuted: jest.fn(),
      setVolume: jest.fn(),
      canSetPlaybackRate: jest.fn(),
      setPlaybackRate: jest.fn(),
      canSetPlaybackQuality: jest.fn(),
      setPlaybackQuality: jest.fn(),
      canSetFullscreen: jest.fn(),
      enterFullscreen: jest.fn(),
      exitFullscreen: jest.fn(),
      canSetPiP: jest.fn(),
      enterPiP: jest.fn(),
      exitPiP: jest.fn(),
    };
  }

  /**
   * Dispatches the `vLoadStart` event.
   */
  @Method()
  async dispatchLoadStart() {
    this.vLoadStart.emit();
  }

  /**
   * Dispatches a state change event.
   */
  @Method()
  async dispatchStateChange(prop: PlayerProp, value: any) {
    this.dispatch(prop as any, value);
  }
}

openProviderWormhole(FakeTube);
