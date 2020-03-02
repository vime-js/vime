import { writable, readable, derived } from 'svelte/store'
import en from '../lang/en';
import PluginRole from './PluginRole'
import { 
  IS_MOBILE, listen_for_touch_input, mergeable,
  private_writable
} from '@vime/utils'

// iStore = internalPlayerStore
export const buildPlayerStore = iStore => {
  const store = {}
  const hasRole = (plugins, role) => plugins.some(p => p.ROLE === role)

  store.locale = writable('en');
  store.icons = mergeable({});
  store.config = mergeable({ plugins: {} });
  store.langauges = mergeable({ en });
  store.theme = writable(null);
  store.plugins = writable([]);
  store.providers = writable([]);
  store.controlsActive = writable(true);
  store.contextMenuEnabled = writable(false);
  store.mobile = private_writable(IS_MOBILE);
  store.touch = readable(false, set => listen_for_touch_input(t => set(t)));
  store.debug = writable(process.env.NODE_ENV !== 'production');
  store.i18n = derived(
    [store.locale, store.langauges],
    ([$locale, $languages]) => $languages[$locale] || $languages.en
  )
  store.Provider = derived(
    [iStore.src, store.providers],
    ([$src, $providers]) => $providers.find(p => p.canPlay($src))
  )
  store.hasControls = derived(
    [store.plugins, iStore.nativeMode],
    ([$plugins, $nativeMode]) => hasRole($plugins, PluginRole.CONTROLS) || $nativeMode
  )
  store.canSetTrack = derived(
    [store.plugins, iStore.nativeMode, iStore.canSetTrack],
    ([$plugins, $nativeMode, $canSetTrack]) => 
      hasRole($plugins, PluginRole.CAPTIONS) || ($nativeMode && $canSetTrack)
  )
  store.canSetTracks = derived(
    [store.plugins, iStore.nativeMode, iStore.canSetTracks],
    ([$plugins, $nativeMode, $canSetTracks]) => 
      hasRole($plugins, PluginRole.CAPTIONS) || ($nativeMode && $canSetTracks)
  )
  store.canSetPoster = derived(
    [store.plugins, iStore.nativeMode, iStore.canSetPoster],
    ([$plugins, $nativeMode, $canSetPoster]) => 
      hasRole($plugins, PluginRole.POSTER) || ($nativeMode && $canSetPoster)
  )

  store.pipEnabled = writable(true);
  store.fullscreenEnabled = writable(true);
  store.captionsEnabled = writable(true);
  
  return {
    ...iStore,
    ...store
  }
}