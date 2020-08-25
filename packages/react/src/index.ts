import { defineCustomElements } from '@vime/core/loader';
import {
  PlayerProp,
  PlayerEvent,
  PlayerProps,
  ViewType,
  MediaType,
} from '@vime/core';

export {
  PlayerProp,
  PlayerProps,
  PlayerEvent,
  ViewType,
  MediaType,
};

export * from './components';
export * from './hooks';

if (typeof window !== 'undefined') {
  defineCustomElements(window);
}
