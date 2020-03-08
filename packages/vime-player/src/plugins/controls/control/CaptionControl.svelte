<ToggleControl
  {player}
  custom
  label={LABEL}
  isEnabled={$canSetTracks}
  activeIcon={$icons.captionsOn}
  inactiveIcon={$icons.captionsOff}
  activeTitle={$i18n.disableCaptions}
  inactiveTitle={$i18n.enableCaptions}
  aria-label={$i18n.captions}
  bind:isActive={$isCaptionsEnabled}
  bind:this={toggle}
/>

<script context="module">
  export const ID = 'vCaptionsControl';
  export const LABEL = 'toggleCaptions';
</script>

<script>
  import ToggleControl from './ToggleControl.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const {
    icons, i18n, isCaptionsActive,
    canSetTracks, currentTrackIndex,
    isCaptionsEnabled
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let toggle;

  export const getToggle = () => toggle;
</script>