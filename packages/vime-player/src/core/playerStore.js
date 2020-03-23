import { writable, readable, derived } from 'svelte/store';
import en from '../lang/en';
import PluginRole from './PluginRole';

import {
  IS_MOBILE, listen_for_touch_input, mergeable,
} from '@vime-js/utils';

export const buildPlayerStore = (internalPlayerStore) => {
  const store = {};
  const hasRole = (plugins, role) => plugins.some((p) => p.ROLE === role);

  store.locale = writable('en');
  store.icons = writable({});
  store.langauges = mergeable({ en });
  store.theme = writable(null);
  store.plugins = writable([]);
  store.providers = writable([]);
  store.debug = writable(process.env.NODE_ENV !== 'production');
  store.isMobile = writable(IS_MOBILE);
  store.isTouch = readable(false, (set) => listen_for_touch_input((t) => set(t)));
  store.isContextMenuEnabled = writable(false);

  store.currentPoster = derived(
    [internalPlayerStore.poster, internalPlayerStore.nativePoster],
    ([$poster, $nativePoster]) => ($poster || $nativePoster),
  );

  store.i18n = derived(
    [store.locale, store.langauges],
    ([$locale, $languages]) => $languages[$locale] || $languages.en,
  );

  store.hasControls = derived(
    [store.plugins, internalPlayerStore.useNativeControls],
    ([$plugins, $useNativeControls]) => hasRole($plugins, PluginRole.CONTROLS)
      || $useNativeControls,
  );

  store.hasCaptions = derived(
    [store.plugins, internalPlayerStore.useNativeCaptions, internalPlayerStore.canSetTracks],
    ([$plugins, $useNativeCaptions, $canSetNativeTracks]) => hasRole($plugins, PluginRole.CAPTIONS)
      || ($useNativeCaptions && $canSetNativeTracks),
  );

  store.hasSettings = derived(
    [store.plugins, internalPlayerStore.useNativeControls],
    ([$plugins, $useNativeControls]) => hasRole($plugins, PluginRole.SETTINGS)
      || $useNativeControls,
  );

  store.Provider = derived(
    [internalPlayerStore.src, store.providers],
    ([$src, $providers]) => $providers.find((p) => p.canPlay($src)),
  );

  // Internal player overrides.

  internalPlayerStore.useNativeView.set(false);
  internalPlayerStore.useNativeControls.set(false);
  internalPlayerStore.useNativeCaptions.set(false);

  // eslint-disable-next-line no-underscore-dangle
  store._isControlsActive = writable(false);
  store.isControlsActive = derived(
    [
      internalPlayerStore.isControlsEnabled,
      // eslint-disable-next-line no-underscore-dangle
      store._isControlsActive,
      internalPlayerStore.useNativeControls,
      internalPlayerStore.isControlsActive,
    ],
    ([
      $isControlsEnabled,
      $isControlsActive,
      $useNativeControls,
      $isNativeControlsActive,
    ]) => $isControlsEnabled
      && ($isControlsActive
      || ($useNativeControls && $isNativeControlsActive)),
  );

  store.canSetTrack = derived(
    [store.plugins, internalPlayerStore.useNativeCaptions, internalPlayerStore.canSetTrack],
    ([$plugins, $useNativeCaptions, $canSetNativeTrack]) => hasRole($plugins, PluginRole.CAPTIONS)
      || ($useNativeCaptions && $canSetNativeTrack),
  );

  store.canSetTracks = derived(
    [store.plugins, internalPlayerStore.useNativeCaptions, internalPlayerStore.canSetTracks],
    ([$plugins, $useNativeCaptions, $canSetNativeTracks]) => hasRole($plugins, PluginRole.CAPTIONS)
      || ($useNativeCaptions && $canSetNativeTracks),
  );

  store.canSetPoster = derived(
    [store.plugins, internalPlayerStore.canSetPoster],
    ([$plugins, $canSetPoster]) => {
      const hasPlugin = hasRole($plugins, PluginRole.POSTER);
      // eslint-disable-next-line no-underscore-dangle
      internalPlayerStore._posterPlugin.set(hasPlugin);
      return hasPlugin || $canSetPoster;
    },
  );

  return {
    ...internalPlayerStore,
    ...store,
  };
};
