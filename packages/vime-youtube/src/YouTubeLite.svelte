<svelte:options accessors />

<PlayerWrapper {aspectRatio} >
  <YouTubeEmbed
    {srcId}
    {params}
    {cookies}
    on:load
    on:data
    on:message
    on:rebuild
    on:srcchange
    on:titlechange
    on:originchange
    on:error
    bind:this={embed} 
  />
</PlayerWrapper>

<script>
  import { PlayerWrapper } from '@vime/core';
  import YouTubeEmbed from './YouTubeEmbed.svelte';

  let embed;

  export let srcId = null;
  export let params = {};
  export let cookies = false;
  export let aspectRatio = '16:9';

  export const getEmbed = () => embed;
</script>