// Treeshaking safe.
const PlayerEvent = function PlayerEvent() {};
PlayerEvent.MOUNT = 'mount';
PlayerEvent.DESTROY = 'destroy';
PlayerEvent.PLUGIN_MOUNT = 'pluginmount';
PlayerEvent.PLUGIN_DESTROY = 'plugindestroy';
export default PlayerEvent;
