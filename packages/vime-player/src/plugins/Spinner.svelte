<svelte:options accessors />

{#if isEnabled}
  <div 
    class:inactive={!isActive}
    bind:this={el}
  >
    <div>Loading...</div>
  </div>
{/if}

<script context="module">
  export const ID = 'vSpinner';
</script>

<script>
  import { ID as ControlsId } from './controls/Controls.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const { 
    buffering, isVideoView, useNativeControls
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;

  export let autopilot = true;
  export let isEnabled = false;
  export let isActive = false;

  $: if (autopilot) isActive = $buffering
  $: if (autopilot) isEnabled = $isVideoView && !$useNativeControls;

  // --------------------------------------------------------------
  // Controls Plugin
  // --------------------------------------------------------------

  const controlsPlugin = player.getPluginsRegistry().watch(ControlsId);

  $: if (el && $controlsPlugin) $controlsPlugin.centerAssist(el);
</script>

<style type="text/scss">
  @import '../style/common';

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  div {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.4s ease-in-out;
    z-index: 2;
    pointer-events: none;

    &.inactive {
      opacity: 0;
    }

    div {
      background: transparent;
      margin: 60px auto;
      font-size: 10px;
      position: relative;
      text-indent: -9999em;
      border-top: 3px solid #fff;
      border-left: 3px solid #fff;
      border-right: 3px solid $color-white-200;
      border-bottom: 3px solid $color-white-200;
      transform: translateZ(0);
      animation: spin 1.1s infinite linear;

      &,
      &::after {
        border-radius: 50%;
        width: 60px;
        height: 60px;
      }
    }
  }
</style>