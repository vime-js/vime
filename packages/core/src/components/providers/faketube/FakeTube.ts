import {
  Prop, Method, Component, Event, EventEmitter,
} from '@stencil/core';
import { MediaProvider, MockMediaProviderAdapter, withProviderContext } from '../MediaProvider';
import { PlayerProp } from '../../core/player/PlayerProps';
import { createProviderDispatcher, ProviderDispatcher } from '../ProviderDispatcher';
import { Logger } from '../../core/player/PlayerLogger';

@Component({
  tag: 'vime-faketube',
  styleUrl: 'faketube.css',
})
export class FakeTube implements MediaProvider {
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
  @Event() vLoadStart!: EventEmitter<void>;

  connectedCallback() {
    this.dispatch = createProviderDispatcher(this);
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
  async dispatchChange(prop: PlayerProp, value: any) {
    this.dispatch(prop as any, value);
  }
}

withProviderContext(FakeTube);
