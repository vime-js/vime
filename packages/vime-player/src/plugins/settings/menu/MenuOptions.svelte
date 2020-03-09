<Menu 
  {id}
  aria-hidden={$$props['aria-hidden']}
  aria-labelledby={$$props['aria-labelledby']}
  on:menuclose
  bind:this={menu}
>
  {#each options as option, index}
    <MenuItemRadio
      {player}
      {group}
      title={option.title}
      value={option.value}
      badge={option.badge}
      on:valuechange
      bind:this={menuItemRadios[index]}
    />
  {/each}
</Menu>

<script>
  import Menu from './Menu.svelte';
  import MenuItemRadio from './MenuItemRadio.svelte';

  export let player;

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let menu;
  let menuItemRadios = [];
  
  export let id;
  export let group;
  export let options;

  export const getMenu = () => menu;
  export const getMenuItemRadios = () => menuItemRadios.filter(Boolean)
</script>