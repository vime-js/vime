import { PlayerEvent as InternalPlayerEvent } from '@vime/core'

// Treeshaking safe.
const PlayerEvent = function () {};
PlayerEvent.MOUNT = 'mount';
PlayerEvent.DESTROY = 'destroy';
PlayerEvent.PLUGIN_MOUNT = 'pluginmount';
PlayerEvent.PLUGIN_DESTROY = 'plugindestroy';
PlayerEvent.LOCALE_CHANGE = 'localechange';
PlayerEvent.THEME_CHANGE = 'themechange';
Object.keys(InternalPlayerEvent).forEach(event => {
  PlayerEvent[event] = InternalPlayerEvent[event];
});
export default PlayerEvent;