/* eslint-disable func-names */
import { getElement } from '@stencil/core';
import { createStencilHook } from '../../../utils/stencil';
import { MediaPlayer } from './MediaPlayer';
import { firePlayerEvent } from './PlayerEvents';
import { initialState, PlayerProp } from './PlayerProps';

export function withPlayerEvents(player: MediaPlayer) {
  const el = getElement(player);
  const cache = new Map<PlayerProp, any>();

  function initCache() {
    (Object.keys(initialState) as PlayerProp[]).forEach((prop) => {
      cache.set(prop, player[prop]);
    });
  }

  createStencilHook(
    player,
    () => {
      initCache();
    },
    () => {
      cache.clear();
    },
  );

  const { componentDidRender } = player;
  player.componentDidRender = function () {
    componentDidRender?.();

    const props = Array.from(cache.keys()) as PlayerProp[];
    for (let i = 0; i < props.length; i += 1) {
      const prop = props[i];
      const oldValue = cache.get(prop);
      const newValue = player[prop];
      if (oldValue !== newValue) {
        firePlayerEvent(el, prop, newValue, oldValue);
        cache.set(prop, newValue);
      }
    }
  };
}
