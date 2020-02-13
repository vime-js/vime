<!-- {#if $isSettingsSupported && $isSettingsEnabled}
  <div>
    <Control
      {id}
      {player}
      title={$i18n.settings}
      on:click={onToggle}
      aria-haspopup
      aria-controls={menuId}
      aria-expanded={$isSettingsActive}
      aria-label={$i18n.settings}
      bind:this={control}
    >
      <Icon icon={$icons.settings} />
    </Control>
  </div>
{/if} -->

<script context="module">
  export const ID = 'vSettingsControl'
  export const LABEL = 'toggleSettings'
</script>

<script>
  import { tick } from 'svelte'
  import { Icon } from '~core'
  import Control from '../Control.svelte'

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player

  const { i18n, icons } = player.getStore()
  
  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let control

  export const getControl = () => control

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  // const onToggle = e => {
  //   e.stopPropagation()
  //   $isSettingsActive = !$isSettingsActive
  // }

  // --------------------------------------------------------------
  // Settings Plugin
  // --------------------------------------------------------------

  let id
  let menuId

  // settingsControl
  // const keyboardEvent = {
  //   // Enter (13)
  //   keys: [13],
  //   action: async () => {
  //     onToggle()
  //     await tick()
  //     // focus menu
  //   }
  // }

  // get id ($settingsMenuRef.getAttribute('aria-labelledby'))
  // get menuId ($settingsMenuRef.getAttribute('id'))
</script>

<!-- <style type="text/scss">
  div {
    :global(.control > svg) {
      transition: transform 0.3s ease;
    }

    :global(> .control[aria-expanded='true'] > svg) {
      transform: rotate(90deg);
    }
  }
</style> -->