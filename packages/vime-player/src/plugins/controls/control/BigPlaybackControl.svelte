<div class:paused={$paused}>
  <PlaybackControl 
    large 
    {player} 
  />
</div>

<script context="module">
  export const ID = 'vBigPlaybackControl';
</script>

<script>
  import PlaybackControl from './PlaybackControl.svelte';

  export let player;

  const { paused } = player.getStore();
</script>

<style>
  div.paused :global(svg) {
    margin-left: 4px;
  }
</style>