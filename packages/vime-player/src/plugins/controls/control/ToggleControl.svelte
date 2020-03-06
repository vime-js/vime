{#if enabled}
  <Control
    {player}
    {title}
    {label}
    on:click
    on:click={onToggle}
    aria-label={$$props['aria-label']}
    aria-pressed={active}
    on:focuschange
    bind:this={control}
  >
    <Icon {icon} />
  </Control>
{/if}

<script>
  import { tick, createEventDispatcher } from 'svelte';
  import { Icon } from '@vime/core';
  import Control from '../Control.svelte';

  export let player;

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let control;

  export let label;
  export let active;
  export let activeTitle;
  export let inactiveTitle;
  export let activeIcon;
  export let inactiveIcon;
  export let custom = false;
  export let enabled = true;

  export const getControl = () => control;

  $: icon = active ? activeIcon : inactiveIcon;
  $: title = active ? activeTitle : inactiveTitle;

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onToggle = () => { if (!custom) active = !active; };
</script>