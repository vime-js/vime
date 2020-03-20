<svelte:options accessors />

<PlayerWrapper {aspectRatio} >
  <VimeoEmbed
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
  import VimeoEmbed from './VimeoEmbed.svelte';

  let embed;

  export let srcId = null;
  export let params = {};
  export let aspectRatio = '16:9';

  export const getSrc = () => embed.getSrc();
  export const getOrigin = () => embed.getOrigin();
  export const getTitle = () => embed.getTitle();
  export const getIframe = () => embed.getIframe();
  export const getSrcWithParams = () => embed.getSrcWithParams();
  export const sendCommand = (command, args, force) => embed.sendCommand(command, args, force);
</script>