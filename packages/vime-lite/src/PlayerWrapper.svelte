{#if isEnabled}
  <Lazy let:intersecting>
    {#if intersecting}
      <div
        class:video={!is_null(aspectRatio)}
        use:vAspectRatio={isEnabled ? aspectRatio : null} 
        bind:this={el}
      >
        <slot />
      </div>
    {/if}
  </Lazy>
{:else}
  <slot />
{/if}

<script>
  import { createEventDispatcher } from 'svelte';
  import { is_null, vAspectRatio } from '@vime-js/utils';
  import Lazy from './Lazy.svelte';

  const dispatch = createEventDispatcher();

  let el;

  export let aspectRatio = null;
  export let isEnabled = true;

  $: if (el) dispatch('mount', el);
</script>

<style>
  div {
    position: relative;
  }

  .video {
    height: 0;
    overflow: hidden;
    background: #000;
  }
</style>