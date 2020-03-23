<svelte:options accessors />

<div 
  use:vIf={isEnabled}
  use:vShow={isActive}
></div>

<script context="module">
  export const ID = 'vScrim';
</script>

<script>
  import { vIf, vShow } from '@vime-js/utils';

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
  export let isEnabled = true;
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
    pointer-events: none;
  }
</style>