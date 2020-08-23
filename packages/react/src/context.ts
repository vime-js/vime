import { useEffect, useState } from "react";
import { 
  withCustomPlayerContext, 
  PlayerProps, 
  createPlayerDispatcher, 
  PlayerDispatcher,
} from "@vime/core";

const noop = () => {};

export const usePlayerDispatcher = (
  ref: React.RefObject<HTMLElement | null>, 
) => {
  const [dispatcher, setDispatcher] = useState<PlayerDispatcher>(() => noop) 

  useEffect(() => {
      setDispatcher(() => (ref.current === null) ? noop : createPlayerDispatcher(ref.current))
  }, [ref]);

  return dispatcher;
};

export function usePlayerContext<P extends keyof PlayerProps>(
  ref: React.RefObject<HTMLElement | null>, 
  prop: P, 
  defaultValue: PlayerProps[P],
) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (ref.current === null) return;
    return withCustomPlayerContext(
      ref.current!, 
      [prop], 
      (_, newValue) => { setValue(newValue as any); 
    });
  }, [ref]);

  return value;
};
