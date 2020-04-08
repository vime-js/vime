import { writable, readable, derived } from 'svelte/store';
import en from '../lang/en';
import PluginRole from './PluginRole';

import {
  IS_MOBILE, listen_for_touch_input, mergeable,
} from '@vime-js/utils';

export const buildPlayerStore = (standardPlayerStore) => {
  const store = {};
  const hasRole = (plugins, role) => plugins.some((p) => p.ROLE === role);

  store.locale = writable('en');
  store.icons = writable({});
  store.langauges = mergeable({ en });
  store.theme = writable(null);
  store.plugins = writable([]);
  store.debug = writable(process.env.NODE_ENV !== 'production');
  store.isMobile = writable(IS_MOBILE);
  store.isTouch = readable(false, (set) => listen_for_touch_input((t) => set(t)));
  store.isContextMenuEnabled = writable(false);

  store.currentPoster = derived(
    [standardPlayerStore.poster, standardPlayerStore.nativePoster],
    ([$poster, $nativePoster]) => ($poster || $nativePoster),
  );

  store.i18n = derived(
    [store.locale, store.langauges],
    ([$locale, $languages]) => $languages[$locale] || $languages.en,
  );

  store.hasControls = derived(
    [store.plugins, standardPlayerStore.useNativeControls],
    ([$plugins, $useNativeControls]) => hasRole($plugins, PluginRole.CONTROLS)
      || $useNativeControls,
  );

  store.hasCaptions = derived(
    [store.plugins, standardPlayerStore.useNativeCaptions, standardPlayerStore.canSetTracks],
    ([$plugins, $useNativeCaptions, $canSetNativeTracks]) => hasRole($plugins, PluginRole.CAPTIONS)
      || ($useNativeCaptions && $canSetNativeTracks),
  );

  store.hasSettings = derived(
    [store.plugins, standardPlayerStore.useNativeControls],
    ([$plugins, $useNativeControls]) => hasRole($plugins, PluginRole.SETTINGS)
      || $useNativeControls,
  );

  // Internal player overrides.

  standardPlayerStore.useNativeView.set(false);
  standardPlayerStore.useNativeControls.set(false);
  standardPlayerStore.useNativeCaptions.set(false);

  // eslint-disable-next-line no-underscore-dangle
  store._isControlsActive = writable(false);
  store.isControlsActive = derived(
    [
      standardPlayerStore.isControlsEnabled,
      // eslint-disable-next-line no-underscore-dangle
      store._isControlsActive,
      standardPlayerStore.useNativeControls,
      standardPlayerStore.isControlsActive,
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
    [store.plugins, standardPlayerStore.useNativeCaptions, standardPlayerStore.canSetTrack],
    ([$plugins, $useNativeCaptions, $canSetNativeTrack]) => hasRole($plugins, PluginRole.CAPTIONS)
      || ($useNativeCaptions && $canSetNativeTrack),
  );

  store.canSetTracks = derived(
    [store.plugins, standardPlayerStore.useNativeCaptions, standardPlayerStore.canSetTracks],
    ([$plugins, $useNativeCaptions, $canSetNativeTracks]) => hasRole($plugins, PluginRole.CAPTIONS)
      || ($useNativeCaptions && $canSetNativeTracks),
  );

  store.canSetPoster = derived(
    [store.plugins, standardPlayerStore.canSetPoster],
    ([$plugins, $canSetPoster]) => {
      const hasPlugin = hasRole($plugins, PluginRole.POSTER);
      // eslint-disable-next-line no-underscore-dangle
      standardPlayerStore._posterPlugin.set(hasPlugin);
      return hasPlugin || $canSetPoster;
    },
  );

  return {
    ...standardPlayerStore,
    ...store,
  };
};
