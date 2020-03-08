<svelte:options accessors />

{#if isEnabled}
  <div 
    class:active={isActive}
    bind:this={el}
  ></div>
{/if}

<script context="module">
  import PluginRole from '../core/PluginRole';

  export const ID = 'vPoster';
  export const ROLE = PluginRole.POSTER;
</script>

<script>
  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const logger = player.createLogger(ID);

  const {
    currentPoster, isVideoView, isAudio, 
    playbackStarted, nativePoster, useNativeControls
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;

  export let autopilot = true;
  export let isEnabled = true;
  export let isActive = false;

  export const getEl = () => el;

  $: if (el) {
    el.style.backgroundImage = $currentPoster ? `url('${$currentPoster.src || $currentPoster}')` : null;
    el.style.backgroundSize = $currentPoster ? ($currentPoster.size || 'contain') : null;
  }

  $: if (autopilot) isEnabled = $isVideoView && !$useNativeControls;
  $: if (autopilot) isActive = $isAudio || !$playbackStarted;
</script>

<style type="text/scss">
  div {
    background-color: #000;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    transition: opacity 0.5s ease;
    width: 100%;
    z-index: 1;
    pointer-events: none;

    &.active {
      opacity: 1;
    }
  }
</style>