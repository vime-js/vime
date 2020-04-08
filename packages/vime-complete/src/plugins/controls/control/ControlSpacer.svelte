<div class="spacer"></div>

<script context="module">
  export const LABEL = 'addSpace';
</script>

<script>
  import { noop } from 'svelte/internal';

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  export let player;

  // Silence dev mode warning.
  noop(player);
</script>

<style>
  .spacer {
    flex: 1;
  }
</style>