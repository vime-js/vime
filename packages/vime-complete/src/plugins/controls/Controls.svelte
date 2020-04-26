<svelte:options accessors />

<div 
  class="controls"
  class:video={$isVideoView}
  use:vIf={isActive}
  bind:this={el}
>
  {#each groups as id (id)}
    <ControlGroup
      {player}
      bind:this={instances[id]}
    />
  {/each}
</div>

<script context="module">
  import PluginRole from '../../core/PluginRole';
  
  export const ID = 'vControls';
  export const ROLE = PluginRole.CONTROLS;
</script>

<script>
  import { tick, onMount, onDestroy } from 'svelte';
  import { listen } from 'svelte/internal';
  import { vIf } from '@vime-js/utils';
  import { ID as SettingsID } from '../settings/Settings.svelte';
  import ControlGroup from './ControlGroup.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const registry = player.createRegistry(ID);
  const plugins = player.getPluginsRegistry();

  const {
    paused, isVideoView, isControlsEnabled,
    canInteract, useNativeControls, _isControlsActive: isControlsActive,
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;
  let idleTimer = 0;
  let hideControlsTimeout;
  let groups = [];

  const instances = {};

  export const getEl = () => el;
  export const getRegistry = () => registry;
  export const getGroups = () => instances;
  export const getGroup = (id) => instances[id];
  
  export const createGroup = async (id) => {
    groups.push(id);
    await tick();
    return instances[id];
  };

  export const createGroups = (newGroups) => {
    const promises = newGroups.map(createGroup);
    return Promise.all(promises);
  };

  export const removeGroup = (id) => {
    groups = groups.filter((groupId) => groupId !== id);
    return tick();
  };

  export const removeGroups = (ids) => {
    ids.map(removeGroup);
    return tick();
  };

  $: if (!$paused && $isVideoView && idleTimer) {
    window.clearTimeout(hideControlsTimeout);
    $isControlsActive = true;
    hideControlsTimeout = window.setTimeout(() => { $isControlsActive = false; }, 2750);
  } else {
    window.clearTimeout(hideControlsTimeout);
    $isControlsActive = $canInteract;
  }

  $: groups
    .filter((id) => !registry.has(id) && instances[id])
    .forEach((id) => registry.register(id, instances[id]));

  $: isActive = ($isControlsEnabled && !$useNativeControls)
    && ($isControlsActive || (settings && $isMenuActive));

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onShowControls = () => { idleTimer += 1; };

  onMount(() => {
    const showControlsEvents = ['focus', 'keydown', 'click', 'mousemove', 'touchstart'];
    showControlsEvents.forEach((event) => onDestroy(listen(player.getEl(), event, onShowControls)));
  });
  
  // --------------------------------------------------------------
  // Settings Plugin
  // --------------------------------------------------------------

  let isMenuActive;

  $: settings = $plugins[SettingsID];
  $: if (settings) { ({ isMenuActive } = settings.getStore()); }
</script>

<style type="text/scss">
  @import '../../style/common';

  .controls {
    position: relative;
    display: flex;
    z-index: 3;
    pointer-events: none;
    flex-direction: column;

    &.video {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }
</style>