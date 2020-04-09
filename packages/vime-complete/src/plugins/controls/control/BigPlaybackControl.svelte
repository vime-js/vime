<div class:paused={$paused}>
  <ToggleControl
    {player}
    large={true}
    shoudlRenderTooltip={false}
    isActive={!$paused}
    autopilot={false}
    activeIcon={$icons.pause}
    inactiveIcon={$icons.play}
    aria-label={$i18n.playback}
    on:click={onToggle}
    bind:this={toggle}
  />
</div>

<script context="module">
  export const ID = 'vBigPlaybackControl';
</script>

<script>
  import ToggleControl from './ToggleControl.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const { paused, i18n, icons } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let toggle;

  export const getToggle = () => toggle;
  
  const onToggle = () => { $paused = !$paused; };
</script>

<style>
  div.paused :global(svg) {
    margin-left: 4px;
  }
</style>