<ToggleControl
  {player}
  label={LABEL}
  isEnabled={$isFullscreenSupported && $isFullscreenEnabled}
  activeIcon={$icons.exitFullscreen}
  inactiveIcon={$icons.enterFullscreen}
  activeTitle={$i18n.exitFullscreen}
  inactiveTitle={$i18n.enterFullscreen}
  aria-label={$i18n.fullscreen}
  bind:isActive={$isFullscreenActive}
  bind:this={toggle}
/>

<script context="module">
  export const ID = 'vFullscreenControl';
  export const LABEL = 'toggleFullscreen';
</script>

<script>
  import ToggleControl from './ToggleControl.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const {
    icons, i18n, isFullscreenActive,
    isFullscreenSupported, isFullscreenEnabled
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let toggle;

  export const getToggle = () => toggle;
</script>