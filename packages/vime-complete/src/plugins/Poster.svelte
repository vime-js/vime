<svelte:options accessors />

<img
  {alt}
  src={$currentPoster}
  use:vIf={isEnabled}
  use:vShow={isActive}
  bind:this={el}
/>

<script context="module">
  import PluginRole from '../core/PluginRole';

  export const ID = 'vPoster';
  export const ROLE = PluginRole.POSTER;
</script>

<script>
  import { vIf, vShow } from '@vime-js/utils';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const {
    title, currentPoster, playbackStarted,
    useNativeControls,
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;

  export let autopilot = true;
  export let isEnabled = true;
  export let isActive = false;

  export const getEl = () => el;

  $: alt = $title ? `Poster for ${title}` : 'Media Poster';
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
  }
</style>