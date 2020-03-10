import { writable, readable, derived } from 'svelte/store';
import en from '../lang/en';
import PluginRole from './PluginRole';

import { 
  IS_MOBILE, listen_for_touch_input, mergeable,
  private_writable
} from '@vime/utils';

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
  store.debug = writable(process.env.NODE_ENV !== 'production');
  store.isMobile = writable(IS_MOBILE);
  store.isTouch = readable(false, set => listen_for_touch_input(t => set(t)));
  store.isContextMenuEnabled = writable(false);
 
  store.currentPoster = derived(
    [_store.poster, _store.nativePoster],
    ([$poster, $nativePoster]) => ($poster || $nativePoster)
  );

  store.i18n = derived(
    [store.locale, store.langauges],
    ([$locale, $languages]) => $languages[$locale] || $languages.en
  );
  
  store.hasControls = derived(
    [store.plugins, _store.useNativeControls],
    ([$plugins, $useNativeControls]) => hasRole($plugins, PluginRole.CONTROLS) || $useNativeControls
  );

  store.hasCaptions = derived(
    [store.plugins, _store.useNativeCaptions, _store.canSetTracks],
    ([$plugins, $useNativeCaptions, $canSetNativeTracks]) => 
      hasRole($plugins, PluginRole.CAPTIONS) || ($useNativeCaptions && $canSetNativeTracks)
  );

  store.hasSettings = derived(
    [store.plugins, _store.useNativeControls],
    ([$plugins, $useNativeControls]) => hasRole($plugins, PluginRole.SETTINGS) || $useNativeControls
  );
  
  store.Provider = derived(
    [_store.src, store.providers],
    ([$src, $providers]) => $providers.find(p => p.canPlay($src))
  );

  // Internal player overrides.

  _store.useNativeView.set(false);
  _store.useNativeControls.set(false);
  _store.useNativeCaptions.set(false);

  store._isControlsActive = writable(false);
  store.isControlsActive = derived(
    [_store.isControlsEnabled, store._isControlsActive, _store.useNativeControls, _store.isControlsActive],
    ([$isControlsEnabled, $isControlsActive, $useNativeControls, $isNativeControlsActive]) => 
      $isControlsEnabled && ($isControlsActive || ($useNativeControls && $isNativeControlsActive))
  );

  store.canSetTrack = derived(
    [store.plugins, _store.useNativeCaptions, _store.canSetTrack],
    ([$plugins, $useNativeCaptions, $canSetNativeTrack]) => 
      hasRole($plugins, PluginRole.CAPTIONS) || ($useNativeCaptions && $canSetNativeTrack)
  );

  store.canSetTracks = derived(
    [store.plugins, _store.useNativeCaptions, _store.canSetTracks],
    ([$plugins, $useNativeCaptions, $canSetNativeTracks]) => 
      hasRole($plugins, PluginRole.CAPTIONS) || ($useNativeCaptions && $canSetNativeTracks)
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
};