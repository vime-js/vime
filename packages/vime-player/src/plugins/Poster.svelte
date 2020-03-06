<svelte:options accessors />

{#if enabled}
  <div 
    class:active
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
    poster: customPoster, isVideoView, isAudio, 
    playbackStarted, nativePoster
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;

  export let poster;
  export let autopilot = true;
  export let enabled = true;
  export let active = false;
  export let fallback = true;

  export const getEl = () => el;

  $: if (el) {
    el.style.backgroundImage = poster ? `url('${poster.src || poster}')` : null;
    el.style.backgroundSize = poster ? (poster.size || 'contain') : null;
  }

  $: if (autopilot) poster = $customPoster || (fallback ? $nativePoster : null);
  $: if (autopilot) enabled = $isVideoView;
  $: if (autopilot) active = $isAudio || !$playbackStarted;
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