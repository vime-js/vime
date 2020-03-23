<svelte:options accessors />

<li>
  <MenuControl 
    {id}
    {title}
    {hint}
    {player}
    role="menuitem"
    {...$$restProps}
    on:click
    bind:this={menuControl}
  />
  <slot />
</li>

<script>
  import MenuControl from './MenuControl.svelte';
  
  export let player;

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let menuControl;

  export let id = null;
  export let title = null;
  export let hint = null;

  export const getMenuControl = () => menuControl;
</script>