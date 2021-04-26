import { getElement } from '@stencil/core';

import { fireEventAndRetry, listen } from '../../../utils/dom';
import { deferredPromise } from '../../../utils/promise';
import { createStencilHook } from '../../../utils/stencil';
import { isInstanceOf } from '../../../utils/unit';
import { MediaPlayer } from './MediaPlayer';

export const FIND_PLAYER_EVENT = 'vmFindPlayer';

export type FoundPlayerCallback = (player: HTMLVmPlayerElement) => void;

export function withFindPlayer(player: MediaPlayer): void {
  const el = getElement(player) as HTMLVmPlayerElement;

  let off: () => void;
  createStencilHook(
    player,
    () => {
      off = listen(
        el,
        FIND_PLAYER_EVENT,
        (event: CustomEvent<FoundPlayerCallback>) => {
          event.stopPropagation();
          event.detail(el);
        },
      );
    },
    () => {
      off?.();
    },
  );
}

/**
 * Finds the closest ancestor player element by firing the `vmFindPlayer` event, and waiting
 * for the player to catch it. This function retries finding the player (`maxRetries`) until it
 * gives up and fails.
 *
 * @param ref - A HTMLElement that is within the player's subtree.
 * @param interval - The length of the timeout before trying again in milliseconds.
 * @param maxRetries - The number of times to retry firing the event.
 */
export const findPlayer = (
  ref: unknown,
  interval = 300,
  maxRetries = 10,
): Promise<HTMLVmPlayerElement | undefined> => {
  const el = (isInstanceOf(ref, HTMLElement)
    ? ref
    : getElement(ref)) as HTMLElement;

  const search = deferredPromise<HTMLVmPlayerElement>();

  // eslint-disable-next-line prefer-const
  let stopFiring: () => void;

  const event = new CustomEvent<FoundPlayerCallback>(FIND_PLAYER_EVENT, {
    bubbles: true,
    composed: true,
    detail: player => {
      search.resolve(player);
      stopFiring();
    },
  });

  stopFiring = fireEventAndRetry(
    el,
    event,
    () => {
      search.reject(`Could not find player for ${el.nodeName}`);
    },
    interval,
    maxRetries,
  );

  return search.promise;
};
