<Lazy let:intersecting>
  {#if intersecting}
    <div
      class:bg={!!aspectRatio}
      class:relative={!hasParent}
      use:vAspectRatio={!hasParent ? aspectRatio : null} 
      bind:this={el}
    >
      <slot />
    </div>
  {/if}
</Lazy>

<script>
  import { createEventDispatcher } from 'svelte';
  import { Lazy } from '../components';
  import { vAspectRatio } from '@vime-js/utils';

  const dispatch = createEventDispatcher();

  let el;

  export let aspectRatio = null;
  export let hasParent = false;

  $: if (el) dispatch('mount', el);
</script>

<style>
  .bg {
    background: #000;
  }

  .relative {
    position: relative;
  }
</style>