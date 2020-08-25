import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  PlayerProps,
  createPlayerDispatcher,
  usePlayerContext as useVimeContext,
  isExternalReadonlyPlayerProp,
  isInternalReadonlyPlayerProp,
  findRootPlayer,
} from '@vime/core';
import {
  InternalWritablePlayerProp,
} from '@vime/core/dist/types/components/core/player/PlayerProp';

type InternalPropBinding<P extends keyof PlayerProps> = [
  value: PlayerProps[P],
  setValue: P extends InternalWritablePlayerProp ? ((value: PlayerProps[P]) => void) : undefined,
];

const noop = () => {};

/**
 * Returns the closest ancestor player to the given `ref`.
 */
export const usePlayer = (ref: React.RefObject<HTMLElement | null>) => {
  const [player, setPlayer] = useState<HTMLVimePlayerElement | null>(null);

  useLayoutEffect(() => {
    setPlayer((ref.current ? findRootPlayer(ref.current) : null));
  }, [ref.current]);

  return player;
};

const useContext = <P extends keyof PlayerProps>(
  ref: React.RefObject<HTMLElement | null>,
  prop: P,
  defaultValue: PlayerProps[P],
  isInternal = false,
) => {
  const [value, setValue] = useState(defaultValue);

  const canWrite = useMemo(
    () => (!isInternal && !isExternalReadonlyPlayerProp(prop))
      || (!isInternalReadonlyPlayerProp(prop) && isInternal),
    [prop],
  );

  const dispatch = useCallback(
    (ref.current === null) ? noop : createPlayerDispatcher(ref.current),
    [ref.current],
  );

  const setter = useCallback(
    // eslint-disable-next-line no-shadow
    canWrite ? (value: PlayerProps[P]) => { dispatch(prop as any, value); } : noop,
    [canWrite, dispatch, prop],
  );

  useLayoutEffect(() => {
    if (ref.current === null) return undefined;
    return useVimeContext(
      ref.current!,
      [prop],
      (_, newValue) => { setValue(newValue); },
    );
  }, [ref.current, prop]);

  return [value, (setter as any)];
};

/**
 * Binds the given `prop` to the closest ancestor player of the given `ref`. When the property
 * changes on the player, this hook will trigger a re-render with the new value.
 *
 * @param ref The player to bind to.
 * @param prop The property to bind to.
 * @param defaultValue The initial value of the property until the the player context is bound.
 */
export const usePlayerContext = <P extends keyof PlayerProps>(
  ref: React.RefObject<HTMLVimePlayerElement | null>,
  prop: P,
  defaultValue: PlayerProps[P],
): PlayerProps[P] => useContext(ref, prop, defaultValue)[0];

/**
 * Binds the given `prop` to the closest ancestor player of the given `ref`. The internal
 * player context gives us the ability to set properties that are considered unsafe to write to
 * from the "outside" (when directly interacting with the player). **Remember, with great power
 * comes great responsibility**.
 *
 * @param ref The root HTMLElement of the custom component.
 * @param prop The player property to bind to.
 * @param defaultValue The initial value of the property until the the player context is bound.
 */
export const useInternalPlayerContext = <P extends keyof PlayerProps>(
  ref: React.RefObject<HTMLElement | null>,
  prop: P,
  defaultValue: PlayerProps[P],
): InternalPropBinding<P> => useContext(ref, prop, defaultValue, true) as any;
