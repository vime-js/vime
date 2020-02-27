<Lazy let:intersecting>
  {#if intersecting}
    <div use:setAspectRatio={aspectRatio} bind:this={el}>
      <slot />
    </div>
  {/if}
</Lazy>

<script>
  import { createEventDispatcher } from 'svelte';
  import { Lazy } from '../components';
  import { aspectRatio as setAspectRatio } from '../actions';

  const dispatch = createEventDispatcher();

  let el;

  export let aspectRatio = null;

  $: if (el) dispatch('mount', el);
</script>