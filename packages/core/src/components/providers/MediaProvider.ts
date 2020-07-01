import { ComponentInterface } from '@stencil/core';

export interface MediaProviderAdapter<InternalPlayerType = any> {
  getInternalPlayer(): InternalPlayerType
  play(): Promise<void>
  pause(): Promise<void>
  canPlay(type: string): boolean
  setCurrentTime(time: number): void;
  setMuted(muted: boolean): void;
  setVolume(volume: number): void;
  canSetPlaybackRate?(): Promise<boolean>
  setPlaybackRate?(rate: number): void;
  canSetMediaQuality?(): Promise<boolean>
  setMediaQuality?(quality: string): void;
  canSetFullscreen?(): boolean
  enterFullscreen?(options?: FullscreenOptions): Promise<void>;
  canSetPiP?(): boolean
  enterPiP?(): Promise<void>;
  exitPiP?(): Promise<void>;
}

export type MockMediaProviderAdapter = {
  [P in keyof MediaProviderAdapter]: jest.Mock
};

export interface MediaProvider<InternalPlayerType = any> extends ComponentInterface {
  /**
   * **INTERNAL:** Do not interact with this prop, refer to the `vime-player` component.
   */
  controls: boolean

  /**
   * **INTERNAL:** Do not interact with this prop, refer to `vime-player` component.
   */
  debug: boolean

  /**
   * **INTERNAL:** Do not interact with this prop, refer to the `vime-player` component.
   */
  loop: boolean

  /**
   * **INTERNAL:** Do not interact with this prop, refer to the `vime-player` component.
   */
  autoplay: boolean

  /**
   * **INTERNAL:** Do not interact with this prop, refer to the `vime-player` component.
   */
  playsinline: boolean

  /**
   * **INTERNAL:** Do not interact with this prop, refer to the `vime-player` component.
   */
  muted: boolean

  /**
   * **INTERNAL:** Returns the adapter that each provider must implement, to enable the core player
   * component (`vime-player`) to control it. Do not interact with this method directly.
   */
  getAdapter(): Promise<MediaProviderAdapter<InternalPlayerType>>
}
