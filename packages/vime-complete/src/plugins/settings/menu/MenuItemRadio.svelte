<svelte:options accessors />

<li>
  <MenuControl 
    {title}
    {badge}
    {player}
    role="menuitemradio"
    aria-label={title}
    aria-checked={isChecked}
    on:click
    on:click={onClick}
  />
</li>

<script context="module">
  const Event = {
    VALUE_CHANGE: 'valuechange',
  };
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  import MenuControl from './MenuControl.svelte';

  const dispatch = createEventDispatcher();

  export let player;

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let menuControl;

  export let group;
  export let title = null;
  export let value = null;
  export let badge = null;

  export const getMenuControl = () => menuControl;

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onClick = () => { dispatch(Event.VALUE_CHANGE, value); };

  $: isChecked = (group === value);
</script>