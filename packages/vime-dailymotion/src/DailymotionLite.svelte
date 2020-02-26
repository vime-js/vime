<svelte:options accessors />

<PlayerWrapper {aspectRatio} >
  <DailymotionEmbed
    {srcId}
    {params}
    on:load
    on:data
    on:message
    on:rebuild
    on:srcchange
    on:titlechange
    on:error
    bind:this={embed} 
  />
</PlayerWrapper>

<script>
  import { PlayerWrapper } from '@vime/core';
  import DailymotionEmbed from './DailymotionEmbed.svelte';

  let embed;

  export let srcId = null;
  export let params = {};
  export let aspectRatio = '16:9';

  export const getEmbed = () => embed;
</script>