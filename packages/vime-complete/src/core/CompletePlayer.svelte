<div 
  tabindex="0"
  class="vime player{classes ? ` ${classes}` : ''}"
  class:audio={!$isVideoView}
  class:video={$isVideoView}
  class:fullscreen={$isFullscreenActive}
  class:idle={!$useNativeControls && !$paused && !$isControlsActive}
  use:vAspectRatio={($isVideoView && !$isFullscreenActive) ? $aspectRatio : null}
  on:contextmenu={onContextMenu}
  bind:this={el}
>
  <div>
    <div 
      class="blocker"
      use:vIf={$playbackReady && (!$useNativeControls && $isVideoView)}
    ></div>
    <StandardPlayer
      parentEl={el}
      bind:this={standardPlayer}
      on:error
    />
  </div>
  <Lazy
    container={el}
    let:intersecting 
  >
    {#if intersecting && mounted}
      <PluginsManager
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
  import { noop, get_current_component } from 'svelte/internal';
  import { get } from 'svelte/store';
  import PluginsManager from './PluginsManager.svelte';
  import PlayerEvent from './PlayerEvent';
  import { buildPlayerStore } from './completePlayerStore';
  import Registry from './Registry';
  import Disposal from './Disposal';
  import { Player as StandardPlayer } from '@vime-js/standard';
  import { Lazy } from '@vime-js/lite';

  import {
    tick as svelteTick, onMount, onDestroy,
    createEventDispatcher,
  } from 'svelte';

  import {
    log as vimeLog, warn as vimeWarn, error as vimeError,
    map_store_to_component, is_string, vIf,
    vAspectRatio,
  } from '@vime-js/utils';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------
  
  let el;
  let standardPlayer;
  let pluginsManager;
  let classes = null;

  let debug;
  let paused;
  let theme;
  let aspectRatio;
  let isVideoView;
  let playbackReady;
  let useNativeControls;
  let isControlsActive;
  let isFullscreenActive;

  let self = get_current_component();
  onDestroy(() => { self = null; });

  const ID = 'Player';
  const disposal = new Disposal();
  const registry = new Registry(ID);
  const dispatch = createEventDispatcher();

  let store = {};
  let onPropsChange = noop;
  $: onPropsChange($$props);

  let mounted = false;
  onMount(() => {
    store = buildPlayerStore(standardPlayer.getStore());
    onPropsChange = map_store_to_component(self, store);
    ({
      paused, theme, isVideoView,
      useNativeControls, isControlsActive, debug,
      isFullscreenActive, aspectRatio, playbackReady,
    } = store);
    mounted = true;
  });

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  export { classes as class };
  export const getEl = () => el;
  export const getRegistry = () => registry;
  export const getStandardPlayer = () => standardPlayer;
  export const getPluginsManager = () => pluginsManager;
  export const getPluginsRegistry = () => pluginsManager && pluginsManager.getRegistry();

  export const tick = () => svelteTick();
  export const dispose = (cb) => disposal.add(cb);
  export const requestPiP = () => standardPlayer.requestPiP();
  export const exitPiP = () => standardPlayer.exitPiP();
  export const requestFullscreen = () => standardPlayer.requestFullscreen();
  export const exitFullscreen = () => standardPlayer.exitFullscreen();
  
  export const createRegistry = (id) => {
    const subRegistry = new Registry(id);
    registry.register(id, subRegistry);
    return subRegistry;
  };

  export const createLogger = (id) => {
    const seperator = '::';
    return {
      log(...args) { if ($debug) vimeLog(id, seperator, ...args); },
      warn(...args) { if ($debug) vimeWarn(id, seperator, ...args); },
      error(...args) { if ($debug) vimeError(id, seperator, ...args); },
    };
  };

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  onDestroy(() => dispatch(PlayerEvent.DESTROY));

  const onPluginsManagerMount = async () => {
    await svelteTick();
    dispatch(PlayerEvent.MOUNT);
  };
  
  const onPluginMount = (e) => {
    const { id, value: plugin } = e.detail;
    self[id] = plugin;
    dispatch(PlayerEvent.PLUGIN_MOUNT, { id, plugin });
  };

  const onPluginDestroy = (e) => {
    const id = e.detail;
    if (self) delete self[id];
    dispatch(PlayerEvent.PLUGIN_DESTROY, id);
  };

  const onContextMenu = (e) => {
    if (!$debug && !get(store.isContextMenuEnabled)) e.preventDefault();
  };

  const onThemeChange = () => (is_string($theme)
    ? el.style.setProperty('--color', $theme)
    : Object.keys($theme).forEach((key) => { el.style.setProperty(`--${key}`, $theme[key]); }));

  $: if (el && $theme) onThemeChange();
  $: if (pluginsManager) onPluginsManagerMount();
</script>

<style type="text/scss">
  @import '../style/common';
  @import '../style/slider';

  // List of CSS custom properties.
  // --color
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
    min-width: 375px;
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

    &.audio {
      min-width: 300px;
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
