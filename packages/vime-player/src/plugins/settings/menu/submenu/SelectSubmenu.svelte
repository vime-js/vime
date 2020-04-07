<Submenu
  {title}
  {player}
  {hint}
  {isActive}
  {isEnabled}
  {hideController}
  isLocked={isLocked || !hasOptions}
  on:open
  on:close
  bind:this={submenu}
>
  <MenuOptions
    {player}
    {options}
    group={value}
    on:valuechange
    bind:this={menuOptions}
  />
</Submenu>

<script>
  import Submenu from './Submenu.svelte';
  import MenuOptions from '../MenuOptions.svelte';

  export let player;
  
  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let submenu;
  let menuOptions;

  export let title = null;
  export let value = null;
  export let options = [];
  export let emptyHint = '';
  export let isActive = false;
  export let isLocked = false;
  export let isEnabled = true;
  export let hideController = false;

  export const getSubmenu = () => submenu;
  export const getMenuOptions = () => menuOptions;

  $: hasOptions = options && options.length > 0;
  $: currentOption = hasOptions ? options.find((o) => o.value === value) : null;
  $: hint = (!hasOptions || !currentOption) ? emptyHint : currentOption.title;
</script>