<ToggleControl
  {player}
  autopilot={false}
  label={LABEL}
  isEnabled={$canSetTracks && $tracks.length > 0}
  isActive={$isCaptionsActive}
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
    icons, i18n, isCaptionsActive,
    canSetTracks, currentTrackIndex,
    tracks,
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let toggle;
  let prevTrackIndex = -1;

  export const getToggle = () => toggle;

  const onToggle = () => {
    if ($isCaptionsActive) prevTrackIndex = $currentTrackIndex;
    $isCaptionsActive ? ($currentTrackIndex = -1) : ($currentTrackIndex = prevTrackIndex);
  };
</script>