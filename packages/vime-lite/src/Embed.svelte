<svelte:window on:message={onMessage} />

<iframe
  {id}
  {title}
  src={srcWithParams}
  allowfullscreen="1"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  on:load
  bind:this={iframe}
></iframe>

<script context="module">
  let idCount = 0;
  const PRECONNECTED = [];
</script>

<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { is_string, prefetch, add_params_to_url } from '@vime-js/utils';

  let iframe = null;
  let srcWithParams = null;

  // eslint-disable-next-line prefer-const
  idCount += 1;
  const id = `vime-embed-${idCount}`;
  const dispatch = createEventDispatcher();
  
  const Event = {
    SRC_CHANGE: 'srcchange',
    MESSAGE: 'message',
    DATA: 'data',
    REBUILD: 'rebuild',
  };

  export let src = null;
  export let title = null;
  export let params = {};
  export let origin = null;
  export let preconnections = [];
  export let decoder = null;

  export const getId = () => id;
  export const getIframe = () => iframe;
  export const getSrc = () => srcWithParams;

  export const postMessage = (message, target) => {
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(JSON.stringify(message), target || origin || '*');
  };

  const originMatches = (e) => {
    if (!iframe || e.source !== iframe.contentWindow) return false;
    return (is_string(origin) && (origin === e.origin));
  };

  const onMessage = (e) => {
    if (!originMatches(e)) return;
    dispatch(Event.MESSAGE, e);
    const data = decoder ? decoder(e.data) : null;
    if (data) dispatch(Event.DATA, data);
  };

  let hasMounted = false;
  onMount(() => { hasMounted = true; });

  $: if (hasMounted) dispatch(Event.SRC_CHANGE, srcWithParams);
  $: if (hasMounted && srcWithParams) dispatch(Event.REBUILD);

  $: if (hasMounted) srcWithParams = src ? add_params_to_url(src, params) : null;

  $: if (hasMounted && srcWithParams && !iframe && !PRECONNECTED.includes(srcWithParams)) {
    if (prefetch('preconnect', srcWithParams)) PRECONNECTED.push(srcWithParams);
  }

  // TODO: improve preconnections
  // @see https://github.com/ampproject/amphtml/blob/master/src/preconnect.js
  $: if (hasMounted) {
    preconnections
      .filter((p) => !PRECONNECTED.includes(p))
      .forEach((url) => { if (prefetch('preconnect', url)) PRECONNECTED.push(url); });
  }
</script>

<style>
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    border: 0;
    user-select: none;
    width: 100%;
    height: 100%;
  }
</style>