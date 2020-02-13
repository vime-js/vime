<ToggleControl
  {player}
  label={LABEL}
  activeIcon={$icons.volumeMute}
  inactiveIcon={get_volume_icon($icons, $isMuted, $volume)}
  activeTitle={$i18n.unmute}
  inactiveTitle={$i18n.mute}
  aria-label={$i18n.mute}
  on:focuschange
  bind:isActive={$isMuted}
  bind:this={toggle}
/>

<script context="module">
  export const ID = 'vMuteControl'
  export const LABEL = 'toggleMute'
</script>

<script>
  import { get_volume_icon } from '~utils/icon'
  import ToggleControl from './ToggleControl.svelte'

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player

  const { icons, i18n, isMuted, volume } = player.getStore()

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let toggle

  export const getToggle = () => toggle
</script>