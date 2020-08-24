import { openWormhole } from 'stencil-wormhole';
import { ComponentInterface } from '@stencil/core';
import { PlayerProp } from './PlayerProp';
import { findRootPlayer } from './utils';
import { getEventName } from './PlayerEvent';
import { listen } from '../../../utils/dom';

export const withPlayerContext = (
  Component: ComponentInterface,
  props: PlayerProp[],
) => openWormhole(Component as any, props);

export const usePlayerContext = (
  ref: HTMLElement,
  props: PlayerProp[],
  updater: (prop: keyof typeof PlayerProp, value: any) => void,
) => {
  const player = findRootPlayer(ref);

  const listeners = props.map((prop) => {
    const event = getEventName(prop);
    return listen(player, event, () => { updater(prop, player[prop]); });
  });

  return () => {
    listeners.forEach((off) => off());
  };
};
