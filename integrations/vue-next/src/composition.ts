import { onMounted, readonly, Ref, ref, watch } from 'vue';
import {
  createDispatcher,
  Dispatcher,
  findPlayer,
  PlayerProps,
  WritableProps,
  usePlayerContext as useVimeContext,
  isWritableProp,
} from '@vime/core';

/**
 * Finds and returns the closest ancestor player element to the given `el`.
 *
 * @param el A HTMLElement that is within the player's subtree.
 */
export const usePlayer = <T extends HTMLElement>(el: Ref<T | null>) => {
  const player = ref<HTMLVmPlayerElement | null>(null);

  const find = async () => {
    player.value = el.value ? (await findPlayer(el.value)) ?? null : null;
  };

  onMounted(find);
  watch(el, find);

  return readonly(player) as Readonly<Ref<HTMLVmPlayerElement | null>>;
};

export type PropBinding<
  P extends keyof PlayerProps
> = P extends keyof WritableProps
  ? Ref<PlayerProps[P]>
  : Readonly<Ref<PlayerProps[P]>>;

/**
 * Binds the given `prop` to the closest ancestor player of the given `ref`. When the property
 * changes on the player, this hook will trigger a re-render with the new value.
 *
 * @param el The HTMLElement to start searching from.
 * @param prop The property to bind to.
 * @param defaultValue The initial value of the property until the the player context is bound.
 */
export const usePlayerContext = <
  T extends HTMLElement,
  P extends keyof PlayerProps
>(
  el: Ref<T | null>,
  prop: P,
  defaultValue: PlayerProps[P],
): PropBinding<P> => {
  const noop = () => {};
  const binding = ref(defaultValue);
  const dispatch = ref<Dispatcher>(noop);
  let prevValue = defaultValue;

  watch(el, () => {
    dispatch.value = el.value ? createDispatcher(el.value) : noop;
  });

  watch(binding, () => {
    if (binding.value !== prevValue) dispatch.value(prop as any, binding.value);
  });

  watch(el, async (_a, _b, onInvalidate) => {
    if (!el.value) return;
    const off = await useVimeContext(el.value, [prop], (_, newValue) => {
      binding.value = newValue as any;
      prevValue = newValue as any;
    });
    onInvalidate(off);
  });

  return (isWritableProp(prop) ? binding : readonly(binding)) as any;
};
