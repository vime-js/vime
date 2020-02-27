{#each sources as source}
  <source 
    src={is_object(source) ? source.src : (source || null)} 
    type={is_object(source) ? source.type : null}
    quality={is_object(source) ? source.quality : null}
  />
{/each}

<script>
  import { is_object, is_array } from '@vime/utils';

  export let src;

  let sources = [];

  $: if (src) {
    sources = is_array(src) ? src : [src];
  } else {
    sources = [];
  }
</script>