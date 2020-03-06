import { writable, readable, derived } from 'svelte/store'
import en from '../lang/en';
import PluginRole from './PluginRole'
import { 
  IS_MOBILE, listen_for_touch_input, mergeable,
  private_writable
} from '@vime/utils'

// _store = internalPlayerStore (packages/vime-core/src/playerStore.js).
export const buildPlayerStore = _store => {
  const store = {};
  const hasRole = (plugins, role) => plugins.some(p => p.ROLE === role);

  store.locale = writable('en');
  store.icons = mergeable({});
  store.langauges = mergeable({ en });
  store.theme = writable(null);
  store.plugins = writable([]);
  store.providers = writable([]);
  store.Provider = private_writable(null);
  store.controlsActive = writable(true);
  store.contextMenuEnabled = writable(false);
  store.debug = writable(process.env.NODE_ENV !== 'production');
  store.isMobile = private_writable(IS_MOBILE);
  store.isTouch = readable(false, set => listen_for_touch_input(t => set(t)));
  store.i18n = derived(
    [store.locale, store.langauges],
    ([$locale, $languages]) => $languages[$locale] || $languages.en
  );
  store.hasControls = derived(
    [store.plugins, _store.nativeMode],
    ([$plugins, $nativeMode]) => hasRole($plugins, PluginRole.CONTROLS) || $nativeMode
  );
  store.Provider = derived(
    [_store.src, store.providers],
    ([$src, $providers]) => $providers.find(p => p.canPlay($src))
  );

  // Internal player overrides.

  _store.nativeMode.set(false);

  store.poster = writable(null);
  store.nativePoster = _store.poster;

  store.canSetTrack = derived(
    [store.plugins, _store.nativeMode, _store.canSetTrack],
    ([$plugins, $nativeMode, $canSetTrack]) => 
      hasRole($plugins, PluginRole.CAPTIONS) || ($nativeMode && $canSetTrack)
  );
  store.canSetTracks = derived(
    [store.plugins, _store.nativeMode, _store.canSetTracks],
    ([$plugins, $nativeMode, $canSetTracks]) => 
      hasRole($plugins, PluginRole.CAPTIONS) || ($nativeMode && $canSetTracks)
  );
  store.canSetPoster = derived(
    [store.plugins, _store.canSetPoster],
    ([$plugins, $canSetPoster]) => {
      const hasPlugin = hasRole($plugins, PluginRole.POSTER);
      _store._posterPlugin.set(hasPlugin);
      return hasPlugin || $canSetPoster;
    } 
  );

  return {
    ..._store,
    ...store
  };
}