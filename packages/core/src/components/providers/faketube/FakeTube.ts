import {
  Prop, Method, Component, Element,
} from '@stencil/core';
import { MediaProvider, MockMediaProviderAdapter } from '../MediaProvider';
import { createPlayerStateDispatcher, PlayerStateDispatcher } from '../../core/player/PlayerState';
import { PlayerProp } from '../../core/player/PlayerProps';

@Component({
  tag: 'vime-faketube',
})
export class FakeTube implements MediaProvider {
  private dispatch!: PlayerStateDispatcher;

  @Element() el!: HTMLVimeFaketubeElement;

  /**
   * @inheritDoc
   */
  @Prop({ attribute: null }) autoplay = false;

  /**
   * @inheritDoc
   */
  @Prop({ attribute: null }) controls = false;

  /**
   * @inheritDoc
   */
  @Prop({ attribute: null }) debug = false;

  /**
   * @inheritDoc
   */
  @Prop({ attribute: null }) loop = false;

  /**
   * @inheritDoc
   */
  @Prop({ attribute: null }) muted = false;

  /**
   * @inheritDoc
   */
  @Prop({ attribute: null }) playsinline = false;

  connectedCallback() {
    this.dispatch = createPlayerStateDispatcher(this.el);
  }

  /**
   * @inheritDoc
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
      canSetMediaQuality: jest.fn(),
      setMediaQuality: jest.fn(),
      canSetFullscreen: jest.fn(),
      enterFullscreen: jest.fn(),
      enterPiP: jest.fn(),
      exitPiP: jest.fn(),
    };
  }

  /**
   * Dispatches a state change event.
   */
  @Method()
  async dispatchStateChange(prop: PlayerProp, value: any) {
    this.dispatch(prop as any, value);
  }
}
