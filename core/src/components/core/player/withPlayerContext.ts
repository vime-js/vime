import { openWormhole } from 'stencil-wormhole';
import { PlayerProp, PlayerProps } from './PlayerProps';
import { findPlayer } from './findPlayer';
import { getEventName } from './PlayerEvents';
import { listen } from '../../../utils/dom';

/**
 * Binds props between an instance of a given component class and it's closest ancestor player.
 *
 * @param component A Stencil component instance.
 * @param props A set of props to watch and update on the given component instance.
 */
export const withPlayerContext = (
  component: any,
  props: PlayerProp[],
) => openWormhole(component, props);

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
  updater: <P extends keyof PlayerProps>(prop: P, value: PlayerProps[P]) => void,
  playerRef?: HTMLVmPlayerElement,
) => {
  const player = playerRef ?? (await findPlayer(ref));

  const listeners = props.map((prop) => {
    const event = getEventName(prop);
    return listen(player, event, () => { updater(prop, player[prop]); });
  });

  return () => {
    listeners.forEach((off) => off());
  };
};
