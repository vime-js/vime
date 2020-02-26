<Embed
  {src}
  {title}
  {params}
  origin={DM.ORIGIN}
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
  import { decode_query_string } from '@vime/utils';

  const DM = {
    ORIGIN: 'https://www.dailymotion.com',
    Event: {
      API_READY: 'apiready',
      VIDEO_CHANGE: 'videochange'
    }
  };

  const DECODER = decode_query_string;

  const PRECONNECTIONS = [
    DM.ORIGIN,
    'https://static1.dmcdn.net'
  ];

  const Event = {
    SRC_CHANGE: 'srcchange',
    TITLE_CHANGE: 'titlechange'
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
  export const getOrigin = () => DM.ORIGIN;
  export const getIframe = () => embed.getIframe();
  export const getSrcWithParams = () => embed.getSrc();

  export const sendCommand = async (command, args) => {
    await tick();
    await ready.promise;
    embed.postMessage({
      command,
      parameters: args || []
    });
  };

  const buildSrc = () => {
    const vId = window.encodeURIComponent(srcId || '');
    const base = `${DM.ORIGIN}/embed`;
    const content = srcId ? `/video/${vId}` : '';
    return `${base}${content}?api=1`;
  };

  const onReload = () => {
    ready = deferred();
    initialized = false;
  };

  const onSrcChange = () => { videoTitle = ''; };

  const _onData = e => {
    const data = e.detail;
    const event = data.event;
    if (event === DM.Event.API_READY) {
      ready.resolve();
      initialized = true;
    }
    if (event === DM.Event.VIDEO_CHANGE) {
      videoTitle = data.title;
    }
  };

  $: src = buildSrc(srcId);
  $: title = `Dailymotion - ${videoTitle || 'Video Player'}`;
  $: onSrcChange(src);
  $: onData = !initialized ? _onData : null;

  let mounted = false;
  onMount(() => { mounted = true; });
  
  $: if (mounted) dispatch(Event.TITLE_CHANGE, videoTitle);
  $: if (mounted) dispatch(Event.SRC_CHANGE, { id: srcId, src });
</script>