import { defineCustomElements } from '@vime/core/loader';
import {
  PlayerProp,
  PlayerMethods,
  PlayerEvent,
  PlayerEvents,
  PlayerProps,
  ViewType,
  MediaType,
  loadSprite,
  Translation,
} from '@vime/core';

export {
  PlayerProp,
  PlayerProps,
  PlayerMethods,
  PlayerEvent,
  PlayerEvents,
  ViewType,
  MediaType,
  loadSprite,
  Translation,
};

export * from './components';
export * from './hooks';

defineCustomElements();
