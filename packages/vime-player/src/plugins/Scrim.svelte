<svelte:options accessors />

{#if enabled}
  <div class:active></div>
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
    controlsActive, isMobile
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  export let autopilot = true;
  export let enabled = false;
  export let active = false;

  $: if (autopilot) enabled = $isVideoView;
  $: if (autopilot) active = ($isMobile && $playbackStarted) && ($paused || $controlsActive);
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