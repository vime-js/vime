import { getElement } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { isInstanceOf, isNull } from '../../../utils/unit';

/**
 * Finds the closest ancestor player element.
 *
 * @param ref A HTMLElement that is within the player's subtree.
 */
export const findRootPlayer = (ref: any) => {
  const root = isInstanceOf(ref, HTMLElement) ? ref : getElement(ref);

  let player = root;

  while (!isNull(player) && !(/^VIME-PLAYER$/.test(player?.nodeName))) {
    player = player.parentElement as HTMLStencilElement;
  }

  if (isNull(player)) {
    throw Error(`Can't find root player given: ${root}`);
  }

  return player as HTMLVimePlayerElement;
};
