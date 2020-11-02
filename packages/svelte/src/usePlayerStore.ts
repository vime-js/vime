import {
  PlayerProp, usePlayerContext, PlayerProps,
  Dispatcher, createDispatcher, findRootPlayer,
  WritableProps, isWritableProp, initialState,
} from '@vime/core';
import { onMount } from 'svelte';
import {
  writable, get as unwrap, Writable, Readable,
} from 'svelte/store';

type PropStoreType<P extends keyof PlayerProps> =
  P extends keyof WritableProps
    ? Writable<PlayerProps[P]>
    : Readable<PlayerProps[P]>;

type PlayerStore = {
  [P in keyof PlayerProps]: PropStoreType<P>;
};

interface SvelteWebComponent<T extends HTMLElement> {
  getWebComponent: T | undefined
}

type Ref<T extends HTMLElement> = (() => T | SvelteWebComponent<T>);

/**
 * This function will take the given `ref` and climb up the DOM tree until it finds the first
 * ancestor player, which it will then return through the callback. This is useful for
 * getting a reference to the player when you need to call a method on it.
 *
 * @param ref A function which returns a HTMLElement or Vime component.
 */
export const usePlayer = <T extends HTMLElement>(
  ref: Ref<T>,
  callback: (player: HTMLVimePlayerElement) => void,
) => {
  onMount(() => {
    let el: any = ref();
    if (el.$$) el = el.getWebComponent();
    callback(findRootPlayer(el));
  });
};

/**
 * Creates and returns a store for the given player. The store is a collection of stores
 * for each player property. It is safe to write to properties before the player has mounted or
 * playback is ready.
 *
 * @param playerRef A function which returns the player to create the store for.
 *
 * @example
 * <vime-player bind:this={player}>
 *  <!-- ... -->
 * </vime-player>
 *
 * <script lang="ts">
 *  let player;
 *
 *  const { currentTime } = usePlayerStore(() => player);
 *
 *  $currentTime = 50;
 *
 *  $: console.log($currentTime);*
 * </script>
 */
export const usePlayerStore = <T extends HTMLElement>(ref: Ref<T>): PlayerStore => {
  let dispatch: Dispatcher = () => {};
  const internalStoreRef: Map<PlayerProp, Writable<any>> = new Map();

  const mountedQueue: (() => void)[] = [];
  const onPlayerMounted = () => { mountedQueue.forEach((fn) => fn()); };

  const vimeable = <P extends keyof PlayerProps>(prop: P, initialValue: PlayerProps[P]) => {
    const store = writable(initialValue);
    const canWrite = isWritableProp(prop);

    const set = (value: PlayerProps[P]) => {
      if (!unwrap(internalStoreRef.get('attached')!)) {
        mountedQueue.push(() => { dispatch(prop as any, value); });
      } else {
        dispatch(prop as any, value);
      }
    };

    const update = (updater: (value: PlayerProps[P]) => PlayerProps[P]) => {
      set(updater(unwrap(store)));
    };

    internalStoreRef.set(prop, store);

    return {
      subscribe: store.subscribe,
      update: canWrite ? update : undefined,
      set: canWrite ? set : undefined,
    };
  };

  const store = (Object.keys(initialState) as PlayerProp[])
    .reduce((prev, prop) => ({
      ...prev,
      [prop]: vimeable(prop, initialState[prop]),
    }), {});

  onMount(() => {
    let el: any = ref();
    if (el.$$) el = el.getWebComponent();

    const player = findRootPlayer(el);
    dispatch = createDispatcher(el);
    internalStoreRef.get('attached')!.set(player.attached);

    const disconnect = usePlayerContext(
      el,
      (Object.keys(initialState) as PlayerProp[]),
      (prop, value) => { internalStoreRef.get(prop as PlayerProp)!.set(value); },
    );

    if (!player.attached) {
      const off = usePlayerContext(
        el,
        ['attached'],
        () => {
          onPlayerMounted();
          off();
        },
      );
    }

    return () => {
      disconnect();
      internalStoreRef.clear();
    };
  });

  return store as any;
};
