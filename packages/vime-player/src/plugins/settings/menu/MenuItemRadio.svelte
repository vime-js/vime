<li>
  <MenuControl 
    {title}
    {badge}
    {player}
    role="menuitemradio"
    aria-label={title}
    aria-checked={isChecked}
    on:click={onClick}
  />
</li>

<script context="module">
  const Event = {
    VALUE_CHANGE: 'valuechange'
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

  export let title;
  export let value;
  export let group;
  export let badge = null;

  export const getTitle = () => title;
  export const getValue = () => value;
  export const getGroup = () => group;
  export const getBadge = () => badge;

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onClick = () => { dispatch(Event.VALUE_CHANGE, value); };

  $: isChecked = (group === value);
</script>