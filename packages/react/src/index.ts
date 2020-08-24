import { defineCustomElements } from '@vime/core/loader';
import { usePlayerContext, usePlayerDispatcher } from './context';
import { 
  PlayerProp, 
  PlayerEvent, 
  PlayerProps, 
  PlayerDispatcher,
  findRootPlayer,
} from '@vime/core';

export * from './components';

export { 
  PlayerProp,
  PlayerProps,
  PlayerEvent,
  PlayerDispatcher,
  usePlayerContext,
  usePlayerDispatcher,
  findRootPlayer,
};

if (typeof window !== 'undefined') {
  defineCustomElements(window);
}