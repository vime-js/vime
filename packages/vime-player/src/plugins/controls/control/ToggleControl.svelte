{#if isEnabled}
  <Control
    {player}
    {title}
    {label}
    on:click={onToggle}
    aria-label={$$props['aria-label']}
    aria-pressed={isActive}
    on:focuschange
    bind:this={control}
  >
    <Icon {icon} />
  </Control>
{/if}

<script>
  import { tick, createEventDispatcher } from 'svelte'
  import { Icon } from '~core'
  import Control from '../Control.svelte'

  export let player

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let control

  export let label
  export let isActive
  export let activeTitle
  export let inactiveTitle
  export let activeIcon
  export let inactiveIcon
  export let isEnabled = true

  export const getControl = () => control

  $: icon = isActive ? activeIcon : inactiveIcon
  $: title = isActive ? activeTitle : inactiveTitle

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onToggle = () => { isActive = !isActive }
</script>