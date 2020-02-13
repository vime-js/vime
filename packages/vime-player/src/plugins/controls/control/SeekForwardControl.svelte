<SeekControl 
  {player}
  base={30}
  isActive={$hasPlaybackStarted}
  bind:this={seekControl}
/>

<script context="module">
  export const ID = 'vSeekForwardControl'
  export const LABEL = 'seekForward'
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