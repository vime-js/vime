/* eslint-disable func-names, no-param-reassign */
import { ComponentInterface, EventEmitter, getElement } from '@stencil/core';
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

export interface AdapterHost<InternalPlayerType = any> extends ComponentInterface {
  getAdapter(): Promise<MediaProviderAdapter<InternalPlayerType>>
}

export interface MediaProvider<InternalPlayerType = any> extends AdapterHost<InternalPlayerType> {
  logger?: PlayerProps['logger']
  controls: PlayerProps['controls']
  language: PlayerProps['language']
  loop: PlayerProps['loop']
  autoplay: PlayerProps['autoplay']
  playsinline: PlayerProps['playsinline']
  muted: PlayerProps['muted']
  vLoadStart: EventEmitter<void>
}

export function withProviderConnect(host: AdapterHost) {
  const el = getElement(host);

  const buildConnectEvent = (name: string) => new CustomEvent(name, {
    bubbles: true,
    composed: true,
    detail: host,
  });

  const connectEvent = buildConnectEvent('vMediaProviderConnect');
  const disconnectEvent = buildConnectEvent('vMediaProviderDisconnect');
  const { componentWillLoad, connectedCallback, disconnectedCallback } = host;

  host.componentWillLoad = function () {
    el.dispatchEvent(connectEvent);
    if (componentWillLoad) return componentWillLoad.call(host);
    return undefined;
  };

  host.connectedCallback = function () {
    el.dispatchEvent(connectEvent);
    if (connectedCallback) connectedCallback.call(host);
  };

  host.disconnectedCallback = function () {
    el.dispatchEvent(disconnectEvent);
    if (disconnectedCallback) disconnectedCallback.call(host);
  };
}

export const withProviderContext = (provider: MediaProvider) => withPlayerContext(provider, [
  'autoplay',
  'controls',
  'language',
  'muted',
  'logger',
  'loop',
  'aspectRatio',
  'playsinline',
]);
