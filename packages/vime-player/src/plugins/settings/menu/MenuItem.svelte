<li class:audio={$isAudio}>
  <MenuControl 
    {id}
    {title}
    {hint}
    {player}
    role="menuitem"
    aria-hidden={isHidden}
    aria-disabled={isDisabled}
    aria-haspopup={hasOptions ? canShowOptions : null}
    aria-expanded={hasOptions ? isMenuActive : null}
    aria-controls={hasOptions ? menuId : null}
    on:click
    on:click={onToggleMenu}
    bind:this={menuControl}
  />
  <div 
    class="divider"
    class:active={isMenuActive}
    bind:this={divider}
  ></div>
  <MenuOptions
    {player}
    {options}
    id={menuId}
    group={value}
    aria-hidden={isHidden || !isMenuActive}
    aria-labelledby={id}
    on:valuechange
    on:menuclose
    on:menuclose={onMenuClose}
    bind:this={menuOptions}
  />
</li>

<script context="module">
  let menuIdCounter = 0;

  const Event = {
    MENU_CHANGE: 'menuchange'
  };
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  import MenuOptions from './MenuOptions.svelte';
  import MenuControl from './MenuControl.svelte';

  // eslint-disable-next-line prefer-const
  menuIdCounter += 1;
  const id = `menuitem-${menuIdCounter}`;
  const menuId = `submenu-${menuIdCounter}`;

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------
  
  export let player;

  const dispatch = createEventDispatcher();
  const { isAudio } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let divider;
  let menuControl;
  let menuOptions;
  let isMenuActive = false;

  export let title = null;
  export let value = null;
  export let emptyHint = '';
  export let options = [];
  export let isHidden = false;
  export let isDisabled = false;

  export const getId = () => id;
  export const getMenuId = () => menuId;
  export const getDivider = () => divider;
  export const getMenuControl = () => menuControl;
  export const getMenuOptions = () => menuOptions;

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onToggleMenu = e => {
    if (isDisabled || !hasOptions) return;
    isMenuActive = !isMenuActive;
    dispatch(Event.MENU_CHANGE, isMenuActive);
  };

  const onMenuClose = e => {
    isMenuActive = false;
    dispatch(Event.MENU_CHANGE, false);
  };

  $: hasOptions = !options || options.length > 0;
  $: canShowOptions = !isDisabled && !isMenuActive && hasOptions;
  $: currentOption = hasOptions ? options.find(o => o.value === value) : null;
  $: hint = (!hasOptions || !currentOption) ? emptyHint : currentOption.title;
</script>

<style type="text/scss">
  @import '../../../style/common';

  .divider {
    width: 100%;
    margin: 4px 0;
    border: 0.5px solid;
    border-color: $color-white-100;
    display: none;

    &.active {
      display: block;
    }
  }

  .audio {
    .divider {
      border-color: $color-gray-100;
    }
  }
</style>