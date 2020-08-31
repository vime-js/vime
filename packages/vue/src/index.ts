import { defineCustomElements } from '@vime/core/loader';
import {
  PlayerProp,
  PlayerProps,
  PlayerMethods,
  PlayerEvent,
  PlayerEvents,
  ViewType,
  MediaType,
  loadSprite,
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
};

export * from './components';
export * from './mixins';

defineCustomElements();
