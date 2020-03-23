<svelte:options accessors />

{#each options as option, index}
  <MenuItemRadio
    {player}
    {group}
    {...option}
    on:valuechange
    bind:this={menuItemRadios[index]}
  />
{/each}

<script>
  import MenuItemRadio from './MenuItemRadio.svelte';

  export let player;

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  const menuItemRadios = [];
  
  export let group;
  export let options = [];

  export const getRadios = () => menuItemRadios.filter(Boolean);
</script>