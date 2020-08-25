import { getElement } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { isInstanceOf } from '../../../utils/unit';

/**
 * Finds the closest ancestor player element.
 *
 * @param ref A HTMLElement that is within the player's subtree.
 */
export const findRootPlayer = (ref: any) => {
  let player = isInstanceOf(ref, HTMLElement) ? ref : getElement(ref);

  while (!(/^VIME-PLAYER$/.test(player?.nodeName))) {
    player = player.parentElement as HTMLStencilElement;
  }

  return player as HTMLVimePlayerElement;
};
