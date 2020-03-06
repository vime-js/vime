<ToggleControl
  {player}
  label={LABEL}
  activeIcon={$icons.play}
  inactiveIcon={$icons.pause}
  activeTitle={$i18n.play}
  inactiveTitle={$i18n.pause}
  aria-label={$i18n.playback}
  bind:active={$paused}
  bind:this={toggle}
/>

<script context="module">
  export const ID = 'vPlaybackControl';
  export const LABEL = 'togglePlayback';
</script>

<script>
  import ToggleControl from './ToggleControl.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const { icons, i18n, paused } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let toggle;

  export const getToggle = () => toggle;
</script>