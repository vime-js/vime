import { ComponentInterface } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

import { listen } from '../../../utils/dom';
import { isUndefined } from '../../../utils/unit';
import { findPlayer } from './findPlayer';
import { getEventName } from './PlayerEvents';
import { PlayerProp, PlayerProps } from './PlayerProps';

/**
 * Binds props between an instance of a given component class and it's closest ancestor player.
 *
 * @param component A Stencil component instance.
 * @param props A set of props to watch and update on the given component instance.
 */
export const withPlayerContext = (
  component: ComponentInterface,
  props: PlayerProp[],
): void => openWormhole(component, props);

/**
 * Finds the closest ancestor player to the given `ref` and watches the given props for changes. On
 * a prop change the given `updater` fn is called.
 *
 * @param ref A element within any player's subtree.
 * @param props A set of props to watch and call the `updater` fn with.
 * @param updater This function is called with the prop/value of any watched properties.
 */
export const usePlayerContext = async (
  ref: HTMLElement,
  props: PlayerProp[],
  updater: <P extends keyof PlayerProps>(
    prop: P,
    value: PlayerProps[P],
  ) => void,
  playerRef?: HTMLVmPlayerElement,
): Promise<() => void> => {
  const player = playerRef ?? (await findPlayer(ref));

  const listeners = !isUndefined(player)
    ? props.map(prop => {
        const event = getEventName(prop);
        return listen(player, event, () => {
          updater(prop, player[prop]);
        });
      })
    : [];

  return () => {
    listeners.forEach(off => off());
  };
};
