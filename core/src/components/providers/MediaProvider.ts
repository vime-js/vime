import { EventEmitter } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { PlayerProps } from '../core/player/PlayerProps';
import { AudioAdapter } from './adapters/AudioAdapter';
import { CaptionsAdapter } from './adapters/CaptionsAdapter';
import { FullscreenAdapter } from './adapters/FullscreenAdapter';
import { PiPAdapter } from './adapters/PiPAdapter';

export interface MediaProviderAdapter<InternalPlayerType = any>
  extends CaptionsAdapter,
  AudioAdapter,
  FullscreenAdapter,
  PiPAdapter {
  getInternalPlayer(): Promise<InternalPlayerType>;
  play(): Promise<void>;
  pause(): Promise<void>;
  canPlay(type: string): Promise<boolean>;
  setCurrentTime(time: number): Promise<void>;
  setMuted(muted: boolean): Promise<void>;
  setVolume(volume: number): Promise<void>;
  canSetPlaybackRate?(): Promise<boolean>;
  setPlaybackRate?(rate: number): Promise<void>;
  canSetPlaybackQuality?(): Promise<boolean>;
  setPlaybackQuality?(quality: string): Promise<void>;
}

export type MockMediaProviderAdapter = {
  [P in keyof MediaProviderAdapter]: any;
};

export interface AdapterProvider<InternalPlayerType = any> {
  getAdapter(): Promise<MediaProviderAdapter<InternalPlayerType>>;
}

export interface AdapterHost<InternalPlayerType = any>
  extends HTMLStencilElement,
  AdapterProvider<InternalPlayerType> {}

export interface MediaProvider<InternalPlayerType = any>
  extends AdapterProvider<InternalPlayerType> {
  logger?: PlayerProps['logger'];
  controls: PlayerProps['controls'];
  language: PlayerProps['language'];
  loop: PlayerProps['loop'];
  autoplay: PlayerProps['autoplay'];
  playsinline: PlayerProps['playsinline'];
  muted: PlayerProps['muted'];
  vmLoadStart: EventEmitter<void>;
}
