<svelte:options accessors />

<div 
  use:vIf={isEnabled}
  use:vShow={isActive}
  bind:this={el}
>
  <div>Loading...</div>
</div>

<script context="module">
  export const ID = 'vSpinner';
</script>

<script>
  import { vIf, vShow } from '@vime-js/utils';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const {
    buffering, isVideoView, useNativeControls,
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;

  export let autopilot = true;
  export let isEnabled = true;
  export let isActive = false;

  $: if (autopilot) isActive = $buffering;
  $: if (autopilot) isEnabled = $isVideoView && !$useNativeControls;
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
    z-index: 2;
    pointer-events: none;

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