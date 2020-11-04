import { ComponentInterface, EventEmitter } from '@stencil/core';
import { PlayerProps } from '../core/player/PlayerProps';
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
  [P in keyof MediaProviderAdapter]: any
};

export interface MediaProvider<InternalPlayerType = any> extends ComponentInterface {
  logger?: PlayerProps['logger']
  controls: PlayerProps['controls']
  language: PlayerProps['language']
  loop: PlayerProps['loop']
  autoplay: PlayerProps['autoplay']
  playsinline: PlayerProps['playsinline']
  muted: PlayerProps['muted']
  vLoadStart: EventEmitter<void>
  getAdapter(): Promise<MediaProviderAdapter<InternalPlayerType>>
}

export interface MediaProviderConstructor {
  new(...args: any[]): MediaProvider
}

export const withProviderContext = (
  provider: MediaProvider,
) => withPlayerContext(provider, [
  'autoplay',
  'controls',
  'language',
  'muted',
  'logger',
  'loop',
  'aspectRatio',
  'playsinline',
]);
