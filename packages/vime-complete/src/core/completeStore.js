import { writable, readable, derived } from 'svelte/store';
import en from '../lang/en';
import PluginRole from './PluginRole';

import {
  IS_MOBILE, listen_for_touch_input, mergeable,
} from '@vime-js/utils';

export const buildCompleteStore = (standardStore) => {
  const store = {};
  const hasRole = (plugins, role) => plugins.some((p) => p.ROLE === role);

  store.locale = writable('en');
  store.icons = writable({});
  store.languages = mergeable({ en });
  store.theme = writable(null);
  store.plugins = writable([]);
  store.debug = writable(process.env.NODE_ENV !== 'production');
  store.isMobile = writable(IS_MOBILE);
  store.isTouch = readable(false, (set) => listen_for_touch_input((t) => set(t)));
  store.isContextMenuEnabled = writable(false);

  store.currentPoster = derived(
    [standardStore.poster, standardStore.nativePoster],
    ([$poster, $nativePoster]) => ($poster || $nativePoster),
  );

  store.i18n = derived(
    [store.locale, store.languages],
    ([$locale, $languages]) => $languages[$locale] || $languages.en,
  );

  store.hasControls = derived(
    [store.plugins, standardStore.useNativeControls],
    ([$plugins, $useNativeControls]) => hasRole($plugins, PluginRole.CONTROLS)
      || $useNativeControls,
  );

  store.hasCaptions = derived(
    [store.plugins, standardStore.useNativeCaptions, standardStore.canSetTracks],
    ([$plugins, $useNativeCaptions, $canSetNativeTracks]) => hasRole($plugins, PluginRole.CAPTIONS)
      || ($useNativeCaptions && $canSetNativeTracks),
  );

  store.hasSettings = derived(
    [store.plugins, standardStore.useNativeControls],
    ([$plugins, $useNativeControls]) => hasRole($plugins, PluginRole.SETTINGS)
      || $useNativeControls,
  );

  // Internal player overrides.

  standardStore.useNativeView.set(false);
  standardStore.useNativeControls.set(false);
  standardStore.useNativeCaptions.set(false);

  // eslint-disable-next-line no-underscore-dangle
  store._isControlsActive = writable(false);
  store.isControlsActive = derived(
    [
      standardStore.isControlsEnabled,
      // eslint-disable-next-line no-underscore-dangle
      store._isControlsActive,
      standardStore.useNativeControls,
      standardStore.isControlsActive,
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
    [store.plugins, standardStore.useNativeCaptions, standardStore.canSetTrack],
    ([$plugins, $useNativeCaptions, $canSetNativeTrack]) => hasRole($plugins, PluginRole.CAPTIONS)
      || ($useNativeCaptions && $canSetNativeTrack),
  );

  store.canSetTracks = derived(
    [store.plugins, standardStore.useNativeCaptions, standardStore.canSetTracks],
    ([$plugins, $useNativeCaptions, $canSetNativeTracks]) => hasRole($plugins, PluginRole.CAPTIONS)
      || ($useNativeCaptions && $canSetNativeTracks),
  );

  store.canSetPoster = derived(
    [store.plugins, standardStore.canSetPoster],
    ([$plugins, $canSetPoster]) => {
      const hasPlugin = hasRole($plugins, PluginRole.POSTER);
      // eslint-disable-next-line no-underscore-dangle
      standardStore._posterPlugin.set(hasPlugin);
      return hasPlugin || $canSetPoster;
    },
  );

  return {
    ...standardStore,
    ...store,
  };
};
