<div 
  tabindex="0"
  class="vime player{classes ? ` ${classes}` : ''}"
  class:audio={!$isVideoView}
  class:video={$isVideoView}
  class:fullscreen={$isFullscreenActive}
  class:idle={!$useNativeControls && !$paused && !$isControlsActive}
  use:setAspectRatio={($isVideoView && !$isFullscreenActive) ? $aspectRatio : null}
  on:contextmenu={onContextMenu}
  bind:this={el}
>
  <div>
    {#if !$useNativeControls && $isVideo}
      <div class="blocker"></div>
    {/if}
    <InternalPlayer
      parentEl={el}
      Provider={$Provider && $Provider.default}
      bind:this={internalPlayer}
      on:error
    />
  </div>
  <Lazy
    container={el}
    let:intersecting 
  >
    {#if intersecting && mounted}
      <Plugins
        player={self}
        on:register={onPluginMount}
        on:deregister={onPluginDestroy}
        bind:this={pluginsManager}
        on:error
      />
    {/if}
  </Lazy>
</div>

<script>
  import { onMount, onDestroy, tick, createEventDispatcher } from 'svelte';
  import { noop, get_current_component } from 'svelte/internal';
  import { get } from 'svelte/store';
  import Plugins from './Plugins.svelte';
  import { buildPlayerStore } from './playerStore';
  import PlayerEvent from './PlayerEvent';
  
  import {
    Registry, Disposal, Lazy,
    aspectRatio as setAspectRatio,
    Player as InternalPlayer
  } from '@vime-js/core';

  import {
    log as _log, warn as _warn, error as _error,
    map_store_to_component, is_string
  } from '@vime-js/utils';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------
  
  let el;
  let internalPlayer;
  let pluginsManager;
  let classes = null;

  let debug;
  let plugins;
  let paused;
  let theme;
  let isVideo;
  let aspectRatio;
  let isVideoView;
  let Provider;
  let useNativeControls;
  let isControlsActive;
  let isFullscreenActive;

  let self = get_current_component();
  onDestroy(() => { self = null; });

  const ID = 'Player';
  const disposal = new Disposal();
  const registry = new Registry(ID);
  const _dispatch = createEventDispatcher();

  let store = {};
  let onPropsChange = () => {};
  $: onPropsChange($$props);

  onMount(() => {
    store = buildPlayerStore(internalPlayer.getStore());
    onPropsChange = map_store_to_component(self, store);
    ({
      plugins, paused, isVideo,
      theme, isVideoView, useNativeControls,
      isControlsActive, debug, isFullscreenActive,
      aspectRatio, Provider
    } = store);
  });

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  export { classes as class };
  export const getEl = () => el;
  export const getRegistry = () => registry;
  export const getI18n = () => get(store.i18n);
  export const getInternalPlayer = () => internalPlayer;
  export const getPluginsManager = () => pluginsManager;
  export const getPluginsRegistry = () => pluginsManager && pluginsManager.getRegistry();

  export const dispose = cb => disposal.add(cb);
  export const dispatch = (event, detail) => _dispatch(event, detail);
  export const extendLanguage = (code, language) => { store.languages.set({ [code]: language }); };

  export const requestPiP = () => internalPlayer.requestPiP();
  export const exitPiP = () => internalPlayer.exitPiP();
  export const requestFullscreen = () => internalPlayer.requestFullscreen();
  export const exitFullscreen = () => internalPlayer.exitFullscreen();
  
  export const createRegistry = id => {
    const subRegistry = new Registry(id);
    registry.register(id, subRegistry);
    return subRegistry;
  };

  export const createLogger = id => {
    const seperator = '::';
    return {
      log () { $debug && _log(id, seperator, ...arguments); },
      warn () { $debug && _warn(id, seperator, ...arguments); },
      error () { $debug && _error(id, seperator, ...arguments); }
    };
  };

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  let mounted = false;
  onMount(() => {
    tick().then(() => _dispatch(PlayerEvent.MOUNT));
    mounted = true;
  });

  onDestroy(() => _dispatch(PlayerEvent.DESTROY));
  
  const onPluginMount = e => {
    self[e.detail.id] = e.detail.value;
    _dispatch(`${e.detail.id}mount`, e.detail);
    _dispatch(PlayerEvent.PLUGIN_MOUNT, e.detail);
  };

  const onPluginDestroy = e => {
    if (self) delete self[e.detail];
    _dispatch(`${e.detail}destroy`, e.detail);
    _dispatch(PlayerEvent.PLUGIN_DESTROY, e.detail);
  };

  const onContextMenu = e => {
    if (!$debug && !get(store.isContextMenuEnabled)) e.preventDefault();
  };

  const onThemeChange = () => is_string($theme)
    ? el.style.setProperty('--theme', $theme)
    : Object.keys($theme).forEach(key => { el.style.setProperty(`--${key}`, $theme[key]); });

  $: if (el && $theme) onThemeChange();
</script>

<style type="text/scss">
  @import '../style/common';
  @import '../style/slider';

  // List of CSS custom properties.
  // --theme
  // --fontFamily
  // --fontSizeSmall
  // --fontSizeMedium
  // --fontSizeLarge
  // --fontSizeExtraLarge
  // --fontWeightLight
  // --fontWeightRegular
  // --fontWeighBold
  // --baseLineHeight

  .player {
    --fontFamily: 'Helvetica Neue', 'Segoe UI', Helvetica, Arial, sans-serif;
  }

  .player {
    box-sizing: border-box;
    direction: ltr;
    font-family: var(--fontFamily);
    -moz-osx-font-smoothing: auto;
    -webkit-font-smoothing: subpixel-antialiased;
    -webkit-tap-highlight-color: transparent;
    font-variant-numeric: tabular-nums;
    font-weight: $font-weight-bold;
    line-height: var(--baseLineHeight, 1.7);
    max-width: 100%;
    min-width: 300px;
    position: relative;
    text-shadow: none;
    transition: box-shadow 0.3s ease;

    &:focus {
      outline: 0;
    }

    :global(*),
    :global(*::after),
    :global(*::before) {
      box-sizing: inherit;
    }

    :global(button) {
      font: inherit;
      line-height: inherit;
      width: auto;

      &::-moz-focus-inner {
        border:0;
      }
    }

    // Fix 300ms delay
    :global(a),
    :global(button),
    :global(input),
    :global(label) {
      touch-action: manipulation;
    }

    &.fullscreen {
      background: #000;
      margin: 0;
      border-radius: 0 !important;
      width: 100%;
      height: 100%;
    }

    &.idle {
      cursor: none;
    }

    &.video {
      background: #000;
      overflow: hidden;
    }
  }

  .blocker {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    display: inline-block;
  }
</style>
