import { defineCustomElements } from '@vime/core/loader';
import { usePlayerContext, usePlayerDispatcher } from './context';
import { PlayerProp, PlayerEvent, PlayerProps, PlayerDispatcher } from '@vime/core';

export * from './components';

export { 
  PlayerProp,
  PlayerProps,
  PlayerEvent,
  PlayerDispatcher,
  usePlayerContext,
  usePlayerDispatcher,
};

if (typeof window !== 'undefined') {
  defineCustomElements(window);
}