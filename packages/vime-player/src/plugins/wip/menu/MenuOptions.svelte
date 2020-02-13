<Menu 
  id={$$props.id}
  aria-hidden={$$props['aria-hidden']}
  aria-labelledby={$$props['aria-labelledby']}
  on:menuclose
>
  {#each options as option, i}
    <MenuItemRadio 
      {group}
      title={option.title}
      value={option.value}
      badge={option.badge}
      on:valuechange
    />
  {/each}
</Menu>

<script>
  import Menu from './Menu.svelte'
  import MenuItemRadio from './MenuItemRadio.svelte'
  
  export let group
  export let options
</script>