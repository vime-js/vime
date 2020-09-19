import { defineCustomElements } from '@vime/core/loader';

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
} from '@vime/core';

export * from './components';
export * from './mixins';

defineCustomElements();
