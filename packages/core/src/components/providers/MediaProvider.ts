import { ComponentInterface, EventEmitter } from '@stencil/core';
import { PlayerProp, PlayerProps } from '../core/player/PlayerProp';
import { withPlayerContext } from '../core/player/PlayerContext';

export interface MediaProviderAdapter<InternalPlayerType = any> {
  getInternalPlayer(): Promise<InternalPlayerType>
  play(): Promise<void>
  pause(): Promise<void>
  canPlay(type: string): Promise<boolean>
  setCurrentTime(time: number): Promise<void>;
  setMuted(muted: boolean): Promise<void>;
  setVolume(volume: number): Promise<void>;
  canSetPlaybackRate?(): Promise<boolean>
  setPlaybackRate?(rate: number): Promise<void>;
  canSetPlaybackQuality?(): Promise<boolean>
  setPlaybackQuality?(quality: string): Promise<void>;
  canSetFullscreen?(): Promise<boolean>
  enterFullscreen?(options?: FullscreenOptions): Promise<void>;
  exitFullscreen?(): Promise<void>;
  canSetPiP?(): Promise<boolean>
  enterPiP?(): Promise<void>;
  exitPiP?(): Promise<void>;
}

export type MockMediaProviderAdapter = {
  [P in keyof MediaProviderAdapter]: jest.Mock
};

export interface MediaProvider<InternalPlayerType = any> extends ComponentInterface {
  [PlayerProp.Controls]: PlayerProps[PlayerProp.Controls]
  [PlayerProp.Language]: PlayerProps[PlayerProp.Language]
  [PlayerProp.Debug]: PlayerProps[PlayerProp.Debug]
  [PlayerProp.Loop]: PlayerProps[PlayerProp.Loop]
  [PlayerProp.Autoplay]: PlayerProps[PlayerProp.Autoplay]
  [PlayerProp.Playsinline]: PlayerProps[PlayerProp.Playsinline]
  [PlayerProp.Muted]: PlayerProps[PlayerProp.Muted]
  vLoadStart: EventEmitter<void>
  getAdapter(): Promise<MediaProviderAdapter<InternalPlayerType>>
}

export interface MediaProviderConstructor {
  new(...args: any[]): MediaProvider
}

export const withProviderContext = (
  Provider: MediaProviderConstructor,
) => withPlayerContext(Provider, [
  PlayerProp.Autoplay,
  PlayerProp.Controls,
  PlayerProp.Language,
  PlayerProp.Muted,
  PlayerProp.Debug,
  PlayerProp.Loop,
  PlayerProp.Playsinline,
]);
