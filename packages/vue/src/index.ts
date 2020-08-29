import { defineCustomElements } from '@vime/core/loader';
import {
  PlayerProp,
  PlayerEvent,
  PlayerProps,
  ViewType,
  MediaType,
  loadSprite,
} from '@vime/core';

export {
  PlayerProp,
  PlayerProps,
  PlayerEvent,
  ViewType,
  MediaType,
  loadSprite,
};

export * from './components';
export * from './mixins';

if (typeof window !== 'undefined') {
  defineCustomElements(window);
}
