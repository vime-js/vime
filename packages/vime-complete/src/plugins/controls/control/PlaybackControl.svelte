<ToggleControl
  {player}
  label={LABEL}
  isActive={!$paused}
  autopilot={false}
  activeIcon={$icons.pause}
  inactiveIcon={$icons.play}
  activeTitle={$i18n.pause}
  inactiveTitle={$i18n.play}
  aria-label={$i18n.playback}
  on:click={onToggle}
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

  const onToggle = () => { $paused = !$paused; };
</script>