import { defineCustomElements } from '@vime/core/loader';
import {
  PlayerProp,
  PlayerEvent,
  PlayerProps,
  PlayerDispatcher,
  findRootPlayer,
} from '@vime/core';
import { usePlayerContext, usePlayerDispatcher } from './context';

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
