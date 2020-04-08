<svelte:options accessors />

{#if isEnabled}
  <Control
    {player}
    {title}
    {label}
    {large}
    on:click
    on:keydown
    on:focuschange
    on:click={autopilot ? onToggle : null}
    aria-label={$$props['aria-label']}
    aria-pressed={isActive}
    bind:this={control}
  >
    <Icon {icon} />
  </Control>
{/if}

<script>
  import Control from './Control.svelte';
  import Icon from '../../../core/Icon.svelte';

  export let player;

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let control;

  export let label;
  export let activeTitle;
  export let inactiveTitle;
  export let activeIcon;
  export let inactiveIcon;
  export let isActive = false;
  export let isEnabled = true;
  export let large = false;
  export let autopilot = true;

  export const getControl = () => control;

  $: icon = isActive ? activeIcon : inactiveIcon;
  $: title = isActive ? activeTitle : inactiveTitle;

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onToggle = () => { isActive = !isActive; };
</script>