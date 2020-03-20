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
  import { decode_query_string } from '@vime-js/utils';
  import { ORIGIN } from './utils';

  const DECODER = decode_query_string;

  const PRECONNECTIONS = [
    ORIGIN,
    'https://static1.dmcdn.net'
  ];

  const DM = {};

  DM.Event = {
    PLAYBACK_READY: 'playback_ready',
    VIDEO_CHANGE: 'videochange',
    ERROR: 'error'
  };

  const Event = {
    READY: 'ready',
    SRC_CHANGE: 'srcchange',
    TITLE_CHANGE: 'titlechange',
    ERROR: 'error'
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
        command,
        parameters: args || []
      });
    } catch (e) { /** noop */ }
  };

  const buildSrc = () => {
    const vId = window.encodeURIComponent(srcId || '');
    const content = srcId ? `/video/${vId}` : '';
    return `${ORIGIN}/embed${content}?api=1`;
  };

  const onReload = () => {
    ready.promise.catch(noop);
    ready.reject();
    ready = deferred();
    initialized = false;
  };

  const onSrcChange = () => { videoTitle = ''; };

  const _onData = e => {
    const data = e.detail;
    const event = data.event;
    if (event === DM.Event.VIDEO_CHANGE) videoTitle = data.title;
    if (event === DM.Event.PLAYBACK_READY) {
      ready.resolve();
      dispatch(Event.READY);
      initialized = true;
    }
    if (event === DM.Event.ERROR) {
      ready.reject(data);
      dispatch(Event.ERROR, data);
      initialized = true;
    }
  };

  $: src = buildSrc(srcId);
  $: title = `Dailymotion - ${videoTitle || 'Video Player'}`;
  $: onSrcChange(src);
  $: onData = !initialized ? _onData : null;

  let mounted = false;
  onMount(() => { mounted = true; });
  
  $: if (mounted) dispatch(Event.TITLE_CHANGE, videoTitle);
  $: if (mounted) dispatch(Event.SRC_CHANGE, src);
</script>