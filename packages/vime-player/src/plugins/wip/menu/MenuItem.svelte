<li class:audio={$isAudio}>
  <MenuControl 
    {id}
    role="menuitem"
    {title}
    {hint}
    aria-hidden={isHidden}
    aria-disabled={isDisabled}
    aria-haspopup={hasOptions ? canShowOptions : null}
    aria-expanded={hasOptions ? isMenuActive : null}
    aria-controls={hasOptions ? menuId : null}
    on:click={onToggleMenu}
  />
  {#if isMenuActive}
    <div class="divider"></div>
  {/if}
  <MenuOptions
    id={menuId}
    {options}
    aria-hidden={isHidden || !isMenuActive}
    aria-labelledby={id}
    group={value}
    on:valuechange
    on:menuclose={onMenuClose}
  />
</li>

<script context="module">
  let menuIdCounter = 0;
</script>

<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import { ctxKey } from '~src/context';
  import MenuOptions from './MenuOptions.svelte';
  import MenuControl from './MenuControl.svelte';
  
  const dispatch = createEventDispatcher();

  const ctx = getContext(ctxKey);
  const isAudio = ctx.isAudio;

  // eslint-disable-next-line prefer-const
  menuIdCounter += 1;
  const id = `menuitem-${menuIdCounter}`;
  const menuId = `submenu-${menuIdCounter}`;

  let isMenuActive = false;

  export let title = null;
  export let value = null;
  export let emptyHint = '';
  export let options = [];
  export let isHidden = false;
  export let isDisabled = false;

  const onToggleMenu = e => {
    if (isDisabled || !hasOptions) return;
    isMenuActive = !isMenuActive;
    dispatch('menuchange', isMenuActive);
  };

  const onMenuClose = e => {
    isMenuActive = false;
    dispatch('menuchange', false);
  };

  $: hasOptions = options.length > 0;
  $: canShowOptions = !isDisabled && !isMenuActive && hasOptions;
  $: currentOption = options.find(o => o.value === value);
  $: hint = (!hasOptions || !currentOption) ? emptyHint : currentOption.title;
</script>

<style type="text/scss">
  @import '../../style/common';

  .divider {
    width: 100%;
    margin: 4px 0;
    border: 0.5px solid;
    border-color: $color-white-100;
  }

  .audio {
    .divider {
      border-color: $color-gray-100;
    }
  }
</style>