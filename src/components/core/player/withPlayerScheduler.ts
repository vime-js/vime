/* eslint-disable func-names */
import { getElement, writeTask } from '@stencil/core';

import { Disposal } from '../../../utils/Disposal';
import { listen } from '../../../utils/dom';
import { createStencilHook, wrapStencilHook } from '../../../utils/stencil';
import { isUndefined } from '../../../utils/unit';
import { MediaProviderAdapter } from '../../providers/MediaProvider';
import { PROVIDER_CACHE_KEY } from '../../providers/ProviderConnect';
import { MediaPlayer } from './MediaPlayer';
import { STATE_CHANGE_EVENT, StateChange } from './PlayerDispatcher';
import { LOAD_START_EVENT } from './PlayerEvents';
import {
  initialState,
  isWritableProp,
  PlayerProp,
  shouldPropResetOnMediaChange,
  WritableProps,
} from './PlayerProps';

// These changes need to be called immediately to avoid the browser blocking the request.
const immediateAdapterCall = new Set<PlayerProp>(['currentTime', 'paused']);

export type SafeAdapterCall = <P extends keyof WritableProps>(
  prop: P,
  method: keyof MediaProviderAdapter,
) => Promise<void>;

export function withPlayerScheduler(player: MediaPlayer): SafeAdapterCall {
  const el = getElement(player);
  const disposal = new Disposal();
  const cache = new Map<PlayerProp, unknown>();

  function initCache() {
    (Object.keys(initialState) as PlayerProp[]).forEach(prop => {
      cache.set(prop, player[prop]);
    });
  }

  // Queue of adapter calls to be run when the media is ready for playback.
  let adapterCalls: ((adapter: MediaProviderAdapter) => Promise<void>)[] = [];
  async function flushAdapterCalls() {
    const adapter = await player.adapter;
    if (isUndefined(adapter)) return;
    for (let i = 0; i < adapterCalls.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await adapterCalls[i](adapter);
    }
    adapterCalls = [];
  }

  let hasMediaChanged = false;
  function onMediaChange(e?: Event) {
    e?.stopImmediatePropagation();

    // Don't reset first time otherwise props intialized by the user will be reset.
    if (!hasMediaChanged) {
      hasMediaChanged = true;
      return;
    }

    adapterCalls = [];

    writeTask(() => {
      (Object.keys(initialState) as PlayerProp[])
        .filter(shouldPropResetOnMediaChange)
        .forEach(prop => {
          player[prop as keyof MediaPlayer] = initialState[prop];
        });
    });
  }

  async function onStateChange(event: CustomEvent<StateChange>) {
    event.stopImmediatePropagation();
    const { by, prop, value } = event.detail;

    if (!isWritableProp(prop)) {
      player.logger?.warn(
        `${by.nodeName} tried to change \`${prop}\` but it is readonly.`,
      );
      return;
    }

    if (!player.playbackStarted && immediateAdapterCall.has(prop)) {
      const adapter = await player.adapter;

      if (prop === 'paused' && !value) {
        adapter?.play();
      }

      if (prop === 'currentTime') {
        adapter?.play();
        adapter?.setCurrentTime(value as number);
      }
    }

    writeTask(() => {
      player[prop as keyof MediaPlayer] = value;
    });
  }

  // Called by ProviderConnect.
  const { onProviderDisconnect } = player;
  player.onProviderDisconnect = function () {
    onMediaChange();
    if (onProviderDisconnect) onProviderDisconnect.call(player);
  };

  createStencilHook(
    player,
    () => {
      initCache();
      disposal.add(listen(el, LOAD_START_EVENT, onMediaChange));
      disposal.add(listen(el, STATE_CHANGE_EVENT, onStateChange));
    },
    () => {
      cache.clear();
      disposal.empty();
    },
  );

  wrapStencilHook(player, 'componentWillRender', async () => {
    if (player.playbackReady && adapterCalls.length > 0)
      await flushAdapterCalls();
  });

  function isAdapterCallRequired<P extends keyof WritableProps>(
    prop: P,
    value: WritableProps[P],
  ) {
    return value !== player[PROVIDER_CACHE_KEY]?.get(prop);
  }

  return async function safeAdapterCall(prop, method) {
    if (!isAdapterCallRequired(prop, player[prop])) return;

    const value = player[prop];
    const safeCall = async (adapter?: MediaProviderAdapter) => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await adapter?.[method]?.(value);
      } catch (e) {
        el.dispatchEvent(new CustomEvent('vmError', { detail: e }));
      }
    };

    if (player.playbackReady) {
      await safeCall(await player.adapter);
    } else {
      adapterCalls.push(safeCall);
    }
  };
}
