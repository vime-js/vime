<ToggleControl
  {player}
  custom
  label={LABEL}
  active={$fullscreenActive}
  enabled={$canSetFullscreen}
  activeIcon={$icons.exitFullscreen}
  inactiveIcon={$icons.enterFullscreen}
  activeTitle={$i18n.exitFullscreen}
  inactiveTitle={$i18n.enterFullscreen}
  aria-label={$i18n.fullscreen}
  on:click={onToggle}
  bind:this={toggle}
/>

<script context="module">
  export const ID = 'vFullscreenControl';
  export const LABEL = 'toggleFullscreen';
</script>

<script>
  import { noop } from 'svelte/internal'
  import ToggleControl from './ToggleControl.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  let active;

  export let player;

  const { 
    icons, i18n, canSetFullscreen,
    fullscreenActive
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let toggle;

  export const getToggle = () => toggle;

  const onToggle = () => !$fullscreenActive 
    ? player.requestFullscreen().catch(noop) 
    : player.exitFullscreen().catch(noop);
</script>