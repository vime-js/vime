<Embed
  {src}
  {title}
  {params}
  origin={ORIGIN}
  decoder={DECODER}
  preconnections={PRECONNECTIONS}
  on:load
  on:data
  on:message
  on:rebuild
  on:data={onData}
  on:srcchange={onReload}
  bind:this={embed}
/>

<script context="module">
  import { decode_json } from '@vime-js/utils';
  import { EMBED_ORIGIN as ORIGIN } from './utils';

  const VM = {};

  VM.Event = {
    READY: 'ready',
    ERROR: 'error',
    LOADED: 'loaded',
  };

  VM.Command = {
    GET_VIDEO_TITLE: 'getVideoTitle',
    ADD_EVENT_LISTENER: 'addEventListener',
  };

  const DECODER = decode_json;
  const BLANK_SRC_ID = '390460225';

  const PRECONNECTIONS = [
    ORIGIN,
    'https://i.vimeocdn.com',
    'https://f.vimeocdn.com',
    'https://fresnel.vimeocdn.com',
  ];

  const Event = {
    READY: 'ready',
    SRC_CHANGE: 'srcchange',
    TITLE_CHANGE: 'titlechange',
    ERROR: 'error',
  };
</script>

<script>
  import { tick, onMount, createEventDispatcher } from 'svelte';
  import { noop } from 'svelte/internal';
  import { deferred } from '@vime-js/utils';
  import { Embed } from '@vime-js/core';

  const dispatch = createEventDispatcher();

  let embed;
  let src = null;
  let videoTitle = '';
  let ready = deferred();
  let initialized = false;

  export let srcId = null;
  export let params = {};

  export const getSrc = () => src;
  export const getTitle = () => videoTitle;
  export const getOrigin = () => ORIGIN;
  export const getIframe = () => embed.getIframe();
  export const getSrcWithParams = () => embed.getSrc();

  export const sendCommand = async (command, args, force) => {
    try {
      if (!force) {
        await tick();
        await ready.promise;
      }
      embed.postMessage({
        method: command,
        value: args || '',
      });
    } catch (e) { /** noop */ }
  };

  const buildSrc = () => {
    const content = window.encodeURIComponent(srcId || BLANK_SRC_ID);
    return `${ORIGIN}/video/${content}`;
  };

  const onReload = () => {
    ready.promise.catch(noop);
    ready.reject();
    ready = deferred();
    initialized = false;
  };

  const onSrcChange = () => { videoTitle = ''; };

  const onDataHandler = (e) => {
    const data = e.detail;
    if (!data) return;
    const event = data && data.event;
    const payload = data && data.data;
    if ((event === VM.Event.ERROR) && payload && payload.method === 'ready') {
      const error = new Error(payload.message);
      error.name = payload.name;
      ready.reject(error);
      dispatch(Event.ERROR, error);
      initialized = true;
    }
    if (event === VM.Event.READY) sendCommand(VM.Command.ADD_EVENT_LISTENER, VM.Event.LOADED, true);
    if (event === VM.Event.LOADED) {
      ready.resolve();
      sendCommand(VM.Command.GET_VIDEO_TITLE);
    }
    if (data.method === VM.Command.GET_VIDEO_TITLE) {
      videoTitle = data.value;
      dispatch(Event.READY);
      initialized = true;
    }
  };

  $: src = buildSrc(srcId);
  $: title = `Vimeo - ${videoTitle || 'Video Player'}`;
  $: onSrcChange(src);
  $: onData = !initialized ? onDataHandler : null;

  let mounted = false;
  onMount(() => { mounted = true; });
  
  $: if (mounted) dispatch(Event.TITLE_CHANGE, videoTitle);
  $: if (mounted) dispatch(Event.SRC_CHANGE, src);
</script>