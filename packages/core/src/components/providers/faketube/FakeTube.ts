import {
  Prop, Method, Component, Event, EventEmitter,
} from '@stencil/core';
import { MediaProvider, MockMediaProviderAdapter, openProviderWormhole } from '../MediaProvider';
import { createPlayerStateDispatcher, PlayerStateDispatcher } from '../../core/player/PlayerState';
import { PlayerProp } from '../../core/player/PlayerProp';

@Component({
  tag: 'vime-faketube',
})
export class FakeTube implements MediaProvider {
  private dispatch!: PlayerStateDispatcher;

  /**
   * @internal
   */
  @Prop({ attribute: null }) language!: string;

  /**
   * @internal
   */
  @Prop({ attribute: null }) autoplay!: boolean;

  /**
   * @internal
   */
  @Prop({ attribute: null }) controls!: boolean;

  /**
   * @internal
   */
  @Prop({ attribute: null }) debug!: boolean;

  /**
   * @internal
   */
  @Prop({ attribute: null }) loop!: boolean;

  /**
   * @internal
   */
  @Prop({ attribute: null }) muted!: boolean;

  /**
   * @internal
   */
  @Prop({ attribute: null }) playsinline!: boolean;

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
