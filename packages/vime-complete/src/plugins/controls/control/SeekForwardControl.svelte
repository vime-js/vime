<SeekControl 
  {player}
  base={30}
  isActive={$playbackStarted}
  bind:this={seekControl}
/>

<script context="module">
  export const ID = 'vSeekForwardControl';
  export const LABEL = 'seekForward';
</script>

<script>
  import SeekControl from './SeekControl.svelte';

  export let player;

  const { playbackStarted } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let seekControl;

  export const getSeekControl = () => seekControl;
</script>