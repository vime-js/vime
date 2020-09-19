import { defineCustomElements } from '@vime/core/loader';

export {
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

export * from './components';
export * from './hooks';

defineCustomElements();
