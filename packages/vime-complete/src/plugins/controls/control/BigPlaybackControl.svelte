<div class:paused={$paused}>
  <PlaybackControl 
    large 
    {player}
    bind:this={playbackControl}
  />
</div>

<script context="module">
  export const ID = 'vBigPlaybackControl';
</script>

<script>
  import PlaybackControl from './PlaybackControl.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const { paused } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let playbackControl;

  export const getPlaybackControl = () => playbackControl;
</script>

<style>
  div.paused :global(svg) {
    margin-left: 4px;
  }
</style>