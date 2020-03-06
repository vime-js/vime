<ToggleControl
  {player}
  custom
  label={LABEL}
  active={$captionsActive}
  enabled={$canSetTrack}
  activeIcon={$icons.captionsOn}
  inactiveIcon={$icons.captionsOff}
  activeTitle={$i18n.disableCaptions}
  inactiveTitle={$i18n.enableCaptions}
  aria-label={$i18n.captions}
  on:click={onToggle}
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
    icons, i18n, captionsActive,
    canSetTrack, currentTrack
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let toggle;
  let prevTrack = -1;

  export const getToggle = () => toggle;

  const onToggle = () => {
    $captionsActive ? ($currentTrack = -1) : ($currentTrack = prevTrack);
    $currentTrack = prevTrack;
  };
</script>