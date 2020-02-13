{#if is_array(src)}
  {#each src as mediaResource }
    <source 
      src={mediaResource.src || mediaResource} 
      type={mediaResource.type} 
    />
  {/each}
{:else if src}
    <source 
      src={src.src || src} 
      type={src.type} 
    />
{/if}

<script>
  import { is_array } from '~utils/unit'

  export let src
</script>