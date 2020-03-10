<svelte:options accessors />

{#if isEnabled}
  <img
    class:active={isActive}
    src={$currentPoster}
    alt={$title || 'Media Poster'}
    bind:this={el}
  />
{/if}

<script context="module">
  import PluginRole from '../core/PluginRole';

  export const ID = 'vPoster';
  export const ROLE = PluginRole.POSTER;
</script>

<script>
  import { writable } from 'svelte/store';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const logger = player.createLogger(ID);
  const { title, currentPoster, playbackStarted, useNativeControls } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;

  export let autopilot = true;
  export let isEnabled = true;
  export let isActive = false;

  export const getEl = () => el;

  $: if (autopilot) isEnabled = !$useNativeControls && !!$currentPoster;
  $: if (autopilot) isActive = !$playbackStarted;
</script>

<style type="text/scss">
  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.5s ease;

    &.active {
      opacity: 1;
    }
  }
</style>