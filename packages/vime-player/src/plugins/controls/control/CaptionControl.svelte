<ToggleControl
  {player}
  label={LABEL}
  isEnabled={$isCaptionsSupported && $isCaptionsEnabled}
  activeIcon={$icons.captionsOn}
  inactiveIcon={$icons.captionsOff}
  activeTitle={$i18n.disableCaptions}
  inactiveTitle={$i18n.enableCaptions}
  aria-label={$i18n.captions}
  bind:isActive={$isCaptionsActive}
  bind:this={toggle}
/>

<script context="module">
  export const ID = 'vCaptionsControl'
  export const LABEL = 'toggleCaptions'
</script>

<script>
  import ToggleControl from './ToggleControl.svelte'

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player

  const {
    icons, i18n, isCaptionsActive,
    isCaptionsSupported, isCaptionsEnabled
  } = player.getStore()

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let toggle

  export const getToggle = () => toggle
</script>