import { writable, readable, derived } from 'svelte/store'
import en from '../lang/en';
import PluginRole from './PluginRole'
import PlayerEvent from './PlayerEvent'
import { 
  IS_MOBILE, listen_for_touch_input, mergeable,
  private_writable, subscribe_and_dispatch
} from '@vime/utils'

// For more events see `packages/vime-core/src/PlayerEvents.js`.
const dispatchPlayerEvents = store => {
  subscribe_and_dispatch(store.locale, PlayerEvent.LOCALE_CHANGE);
  subscribe_and_dispatch(store.theme, PlayerEvent.THEME_CHANGE);
};

// iStore = internalPlayerStore (packages/vime-core/src/playerStore.js).
export const buildPlayerStore = iStore => {
  const store = {};
  const hasRole = (plugins, role) => plugins.some(p => p.ROLE === role);

  store.locale = writable('en');
  store.icons = mergeable({});
  store.config = mergeable({ plugins: {} });
  store.langauges = mergeable({ en });
  store.theme = writable(null);
  store.plugins = writable([]);
  store.providers = writable([]);
  store.Provider = private_writable(null);
  store.controlsActive = writable(true);
  store.contextMenuEnabled = writable(false);
  store.debug = writable(process.env.NODE_ENV !== 'production');
  store.mobile = private_writable(IS_MOBILE);
  store.touch = readable(false, set => listen_for_touch_input(t => set(t)));
  store.i18n = derived(
    [store.locale, store.langauges],
    ([$locale, $languages]) => $languages[$locale] || $languages.en
  );
  store.hasControls = derived(
    [store.plugins, iStore.nativeMode],
    ([$plugins, $nativeMode]) => hasRole($plugins, PluginRole.CONTROLS) || $nativeMode
  );

  // Internal player overrides.

  store.canSetTrack = derived(
    [store.plugins, iStore.nativeMode, iStore.canSetTrack],
    ([$plugins, $nativeMode, $canSetTrack]) => 
      hasRole($plugins, PluginRole.CAPTIONS) || ($nativeMode && $canSetTrack)
  );
  store.canSetTracks = derived(
    [store.plugins, iStore.nativeMode, iStore.canSetTracks],
    ([$plugins, $nativeMode, $canSetTracks]) => 
      hasRole($plugins, PluginRole.CAPTIONS) || ($nativeMode && $canSetTracks)
  );
  store.canSetPoster = derived(
    [store.plugins, iStore.canSetPoster],
    ([$plugins, $canSetPoster]) => {
      const hasPlugin = hasRole($plugins, PluginRole.POSTER);
      iStore._posterPlugin.set(hasPlugin);
      return hasPlugin || $canSetPoster;
    } 
  );

  dispatchPlayerEvents(store);

  return {
    ...iStore,
    ...store
  };
}