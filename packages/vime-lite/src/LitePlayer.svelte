<svelte:options accessors />

<PlayerWrapper 
  {aspectRatio} 
  isEnabled={hasWrapper} 
>
  <Embed
    {params}
    {decoder}
    {preconnections}
    src={embedURL}
    title={iframeTitle}
    origin={origin}
    on:load
    on:data
    on:message
    on:rebuild
    on:load={onLoad}
    on:data={onData}
    on:srcchange={onReload}
    bind:this={embed}
  />
</PlayerWrapper>

<script>
  import { tick, createEventDispatcher } from 'svelte';
  import { noop } from 'svelte/internal';
  import { deferred } from '@vime-js/utils';
  import Embed from './Embed.svelte';
  import PlayerWrapper from './PlayerWrapper.svelte';

  const dispatch = createEventDispatcher();

  const Event = {
    READY: 'ready',
    TITLE_CHANGE: 'titlechange',
    ORIGIN_CHANGE: 'originchange',
    EMBED_URL_CHANGE: 'embedurlchange',
    ERROR: 'error',
  };

  let embed;
  let mediaTitle = null;
  let ready = deferred();
  let initialized = false;

  export let src = null;
  export let params = {};
  export let providers = [];
  export let cookies = false;
  export let hasWrapper = true;
  export let aspectRatio = '16:9';

  export const getOrigin = () => origin;
  export const getEmbed = () => embed;
  export const getEmbedURL = () => embedURL;
  export const getTitle = () => mediaTitle;
  export const getProvider = () => Provider;
  export const getMediaId = () => (Provider ? Provider.extractMediaId(src) : null);

  export const sendCommand = async (command, args, force) => {
    if (!Provider) return;

    try {
      if (!force) {
        await tick();
        await ready.promise;
      }
      embed.postMessage(Provider.buildPostMessage(command, args));
    } catch (e) { /** noop */ }
  };

  const onReload = () => {
    ready.promise.catch(noop);
    ready.reject();
    ready = deferred();
    initialized = false;
    ready.promise
      .then(() => {
        initialized = true;
        dispatch(Event.READY);
      })
      .catch((e) => {
        dispatch(Event.ERROR, e);
      });
  };

  const onSrcChange = () => { mediaTitle = null; };
  const onLoad = () => { if (Provider) Provider.onLoad(embed); };

  const onDataHandler = (e) => {
    const data = e.detail;
    if (!data || !Provider) return;
    Provider.resolveReadyState(data, ready, sendCommand);
    if (!mediaTitle) mediaTitle = Provider.extractMediaTitle(data);
  };

  onReload();

  $: onSrcChange(src);

  $: origin = Provider ? Provider.buildOrigin(cookies) : null;
  $: embedURL = Provider ? Provider.buildEmbedURL(src, cookies) : null;
  $: Provider = providers.find((p) => p.canPlay(src));
  $: iframeTitle = (Provider && mediaTitle) ? `${Provider.name} - ${mediaTitle || 'Video Player'}` : null;
  $: decoder = Provider ? Provider.decoder : null;
  $: preconnections = Provider ? Provider.preconnections : [];
  $: onData = (!initialized || !mediaTitle) ? onDataHandler : null;

  $: dispatch(Event.SRC_CHANGE, src);
  $: dispatch(Event.TITLE_CHANGE, mediaTitle);
  $: dispatch(Event.ORIGIN_CHANGE, origin);
  $: dispatch(Event.EMBED_URL_CHANGE, embedURL);
</script>