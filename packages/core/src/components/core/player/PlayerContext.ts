import { openWormhole } from 'stencil-wormhole';
import { ComponentInterface } from '@stencil/core';
import { PlayerProp, PlayerProps } from './PlayerProps';
import { findRootPlayer } from './utils';
import { getEventName } from './PlayerEvents';
import { listen } from '../../../utils/dom';

/**
 * Binds props between an instance of a given component class and it's closest ancestor player.
 *
 * @param Component A Stencil component class.
 * @param props A set of props to watch and update on the given component instance.
 */
export const withPlayerContext = (
  Component: ComponentInterface,
  props: PlayerProp[],
) => openWormhole(Component as any, props);

/**
 * Finds the closest ancestor player to the given `ref` and watches the given props for changes. On
 * a prop change the given `updater` fn is called.
 *
 * @param ref A element within any player's subtree.
 * @param props A set of props to watch and call the `updater` fn with.
 * @param updater This function is called with the prop/value of any watched properties.
 */
export const usePlayerContext = (
  ref: HTMLElement,
  props: PlayerProp[],
  updater: <P extends keyof PlayerProps>(prop: P, value: PlayerProps[P]) => void,
  playerRef?: HTMLVimePlayerElement,
) => {
  const player = playerRef ?? findRootPlayer(ref);

  const listeners = props.map((prop) => {
    const event = getEventName(prop);
    return listen(player, event, () => { updater(prop, player[prop]); });
  });

  return () => {
    listeners.forEach((off) => off());
  };
};
