import { PlayerEvent as InternalPlayerEvent } from '@vime/core'

// Treeshaking safe.
const PlayerEvent = function () {};
PlayerEvent.MOUNT = 'mount';
PlayerEvent.DESTROY = 'destroy';
PlayerEvent.PLUGIN_MOUNT = 'pluginmount';
PlayerEvent.PLUGIN_DESTROY = 'plugindestroy';
// copy over internal events
export default PlayerEvent;