<div 
  tabindex="0"
  class="vime player{classes ? ` ${classes}` : ''}"
  class:video={$videoView}
  class:fullscreen={$fullscreenActive}
  class:idle={!$nativeMode && !$paused && !$controlsActive}
  on:contextmenu={onContextMenu}
  bind:this={el}
>
  <div class="internal">
    {#if !$nativeMode && $video}
      <div class="blocker"></div>
    {/if}
    <InternalPlayer
      fullscreenEl={el}
      Provider={$Provider && $Provider.default}
      bind:this={internalPlayer}
      on:error
    />
  </div>
  <Lazy 
    container={el} 
    let:intersecting 
  >
    {#if mounted && intersecting}
      <Plugins
        player={self}
        plugins={$plugins || []}
        nativeMode={$nativeMode}
        config={$config ? $config.plugins : {}}
        on:register={onPluginMount}
        on:deregister={onPluginDestroy}
        bind:this={pluginsManager}
        on:error
      />
    {/if}
  </Lazy>
</div>

<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { noop, get_current_component } from 'svelte/internal';
  import { get } from 'svelte/store';
  import Plugins from './Plugins.svelte';
  import { buildPlayerStore } from './playerStore';
  import PlayerEvent from './PlayerEvent'
  import { 
    Registry, Disposal, Lazy,
    Player as InternalPlayer, PlayerEvent as InternalPlayerEvent
  } from '@vime/core';
  import { 
    log as _log, warn as _warn, error as _error,
    map_store_to_component, is_string
  } from '@vime/utils';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------
  
  let el;
  let internalPlayer;
  let pluginsManager;
  let classes = null;

  let src;
  let debug;
  let plugins;
  let config;
  let paused;
  let video;
  let theme;
  let Provider;
  let providers;
  let videoView;
  let nativeMode;
  let controlsActive;
  let fullscreenActive;
  let contextMenuEnabled;

  const ID = 'Player';
  let self = get_current_component();
  const disposal = new Disposal();
  const registry = new Registry(ID);
  const _dispatch = createEventDispatcher();

  let store = {};
  let onPropsChange = () => {};
  $: onPropsChange($$props);

  onMount(() => {
    store = buildPlayerStore(internalPlayer.getStore());
    onPropsChange = map_store_to_component(self, store);
    Object.keys(InternalPlayerEvent).forEach(event => {
      disposal.add(internalPlayer.$on(event, e => _dispatch(event, e.detail)))
    });
    ({  
      plugins, config, paused,
      video, theme, videoView,
      nativeMode, Provider, controlsActive, 
      debug, providers, fullscreenActive, 
      src, contextMenuEnabled
    } = store);
  })

  $: {
    const newProvider = $providers && $providers.find(p => p.canPlay($src));
    if (newProvider !== $Provider) $Provider = newProvider;
    if (!$Provider && $src) _warn(`no provider can play this \`src\` [${$src}]`);
  }

  onDestroy(() => {
    self = null;
    store = {};
    onPropsChange = noop;
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
    }
  };

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  let mounted = false;
  onMount(() => {
    mounted = true;
    _dispatch(PlayerEvent.MOUNT);
  });

  onDestroy(() => _dispatch(PlayerEvent.DESTROY));
  
  const onPluginMount = e => {
    self[e.detail.id] = e.detail.value;
    _dispatch(`${e.detail.id}mount`, e.detail);
    _dispatch(PlayerEvent.PLUGIN_MOUNT, e.detail);
  };

  const onPluginDestroy = e => {
    delete self[e.detail];
    _dispatch(`${e.detail}destroy`, e.detail);
    _dispatch(PlayerEvent.PLUGIN_DESTROY, e.detail);
  };

  const onContextMenu = e => {
    if (!$debug && !$contextMenuEnabled) e.preventDefault();
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

  .internal {
    width: 100%;
    height: 100%;
  }

  .blocker {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: inline-block;
  }
</style>
