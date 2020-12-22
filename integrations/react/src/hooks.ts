import {
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import {
  PlayerProps,
  createDispatcher,
  usePlayerContext as useContext,
  findPlayer,
  WritableProps,
} from '@vime/core';

const noop = () => {};

/**
 * Returns the closest ancestor player to the given `ref`.
 */
export const usePlayer = (ref: React.RefObject<HTMLElement | null>) => {
  const [player, setPlayer] = useState<HTMLVmPlayerElement | null>(null);

  useLayoutEffect(() => {
    async function find() {
      setPlayer((ref.current ? (await findPlayer(ref.current)) : null));
    }

    find();
  }, [ref.current]);

  return player;
};

export type PropBinding<P extends keyof PlayerProps> = [
  value: PlayerProps[P],
  setValue: P extends keyof WritableProps ? ((value: PlayerProps[P]) => void) : undefined,
];

/**
 * Binds the given `prop` to the closest ancestor player of the given `ref`. When the property
 * changes on the player, this hook will trigger a re-render with the new value.
 *
 * @param ref The ref to start searching from.
 * @param prop The property to bind to.
 * @param defaultValue The initial value of the property until the the player context is bound.
 */
export const usePlayerContext = <P extends keyof PlayerProps>(
  ref: React.RefObject<HTMLElement | null>,
  prop: P,
  defaultValue: PlayerProps[P],
): PropBinding<P> => {
  const [value, setValue] = useState(defaultValue);

  const dispatch = useCallback(
    (ref.current === null) ? noop : createDispatcher(ref.current),
    [ref.current],
  );

  const setter = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (value: PlayerProps[P]) => { dispatch(prop as any, value); },
    [dispatch, prop],
  );

  useLayoutEffect(() => {
    if (ref.current === null) return undefined;

    let cleanup: () => void;

    async function connect() {
      cleanup = await useContext(
        ref.current!,
        [prop],
        (_, newValue) => { setValue(newValue as any); },
      );
    }

    connect();
    return () => { cleanup?.(); };
  }, [ref.current, prop]);

  return [value, (setter as any)];
};
