<Embed
  {src}
  {title}
  {params}
  origin={VM.ORIGIN}
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
  import { decode_json } from '@vime/utils';

  const VM = {
    ORIGIN: 'https://player.vimeo.com',
    Event: {
      READY: 'ready',
      ERROR: 'error'
    },
    Command: {
      GET_VIDEO_TITLE: 'getVideoTitle'
    }
  };

  const DECODER = decode_json;
  const BLANK_SRC_ID = '390460225';

  const PRECONNECTIONS = [
    VM.ORIGIN,
    'https://i.vimeocdn.com',
    'https://f.vimeocdn.com',
    'https://fresnel.vimeocdn.com'
  ];

  const Event = {
    SRC_CHANGE: 'srcchange',
    TITLE_CHANGE: 'titlechange',
    ERROR: 'error'
  };
</script>

<script>
  import { tick, onMount, createEventDispatcher } from 'svelte';
  import { deferred } from '@vime/utils';
  import { Embed } from '@vime/core';

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
  export const getOrigin = () => VM.ORIGIN;
  export const getIframe = () => embed.getIframe();
  export const getSrcWithParams = () => embed.getSrc();

  export const sendCommand = async (command, args) => {
    await tick();
    await ready.promise;
    embed.postMessage({
      method: command,
      value: args || ''
    });
  };

  const buildSrc = () => {
    const base = `${VM.ORIGIN}/video/`;
    const content = window.encodeURIComponent(srcId || BLANK_SRC_ID);
    return `${base}${content}`;
  };

  const onReload = () => {
    ready = deferred();
    initialized = false;
  };

  const onSrcChange = () => { videoTitle = ''; };

  const _onData = e => {
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
    if (event === VM.Event.READY) {
      ready.resolve();
      sendCommand(VM.Command.GET_VIDEO_TITLE);
    }
    if (data.method === VM.Command.GET_VIDEO_TITLE) {
      videoTitle = data.value;
      initialized = true;
    }
  };

  $: src = buildSrc(srcId);
  $: title = `Vimeo - ${videoTitle || 'Video Player'}`;
  $: onSrcChange(src);
  $: onData = !initialized ? _onData : null;

  let mounted = false;
  onMount(() => { mounted = true; });
  
  $: if (mounted) dispatch(Event.TITLE_CHANGE, videoTitle);
  $: if (mounted) dispatch(Event.SRC_CHANGE, src);
</script>