<SeekControl 
  {player}
  base={-10}
  isActive={$hasPlaybackStarted}
  bind:this={seekControl}
/>

<script context="module">
  export const ID = 'vSeekBackwardControl'
  export const LABEL = 'seekBackward'
</script>

<script>
  import SeekControl from './SeekControl.svelte'

  export let player

  const { hasPlaybackStarted } = player.getStore()

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let seekControl

  export const getSeekControl = () => seekControl
</script>