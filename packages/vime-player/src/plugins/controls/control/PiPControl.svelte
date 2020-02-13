<ToggleControl
  {player}
  label={LABEL}
  isEnabled={$isPiPSupported && $isPiPEnabled}
  activeIcon={$icons.exitPiP}
  inactiveIcon={$icons.enterPiP}
  activeTitle={$i18n.exitPiP}
  inactiveTitle={$i18n.enterPiP}
  aria-label={$i18n.pip}
  bind:isActive={$isPiPActive}
  bind:this={toggle}
/>

<script context="module">
  export const ID = 'vPiPControl'
  export const LABEL = 'togglePiP'
</script>

<script>
  import ToggleControl from './ToggleControl.svelte'

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player

  const {
    icons, i18n, isPiPActive,
    isPiPSupported, isPiPEnabled
  } = player.getStore()

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let toggle

  export const getToggle = () => toggle
</script>