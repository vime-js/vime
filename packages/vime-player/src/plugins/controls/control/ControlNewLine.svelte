<div 
  class="break" 
  bind:this={el}
></div>

<script context="module">
  export const LABEL = 'addNewLine';
</script>

<script>
  import { noop } from 'svelte/internal';
  import { onMount, onDestroy } from 'svelte';

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  export let player;

  // Silence dev mode warning.
  noop(player);

  let el;
  let nextControl;

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  onMount(async () => {
    nextControl = el.nextElementSibling;
    nextControl.style.marginLeft = 0;
  });

  onDestroy(() => {
    if (nextControl) nextControl.style.marginLeft = null;
    nextControl = null;
  });
</script>

<style>
  .break {
    width: 100%;
    margin-bottom: 8px;
  }
</style>