import { getElement } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';

export const findRootPlayer = (ref: any) => {
  let player = getElement(ref);

  while (!(/^VIME-PLAYER$/.test(player?.nodeName))) {
    player = player.parentElement as HTMLStencilElement;
  }

  return player as HTMLVimePlayerElement;
};
