<svelte:options accessors />

{#if isEnabled}
  <div class:active={isActive}></div>
{/if}

<script context="module">
  export const ID = 'vScrim';
</script>

<script>
  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------
  
  export let player;

  const {
    isVideoView, playbackStarted, paused,
    isControlsActive, isMobile, useNativeControls,
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  export let autopilot = true;
  export let isEnabled = false;
  export let isActive = false;

  $: if (autopilot) isEnabled = $isVideoView && !$useNativeControls;
  $: if (autopilot) isActive = ($isMobile && $playbackStarted) && ($paused || $isControlsActive);
</script>

<style type="text/scss">
  @import '../style/common';

  div {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    background: $color-gray-300;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    pointer-events: none;

    &.active {
      opacity: 1;
    }
  }
</style>