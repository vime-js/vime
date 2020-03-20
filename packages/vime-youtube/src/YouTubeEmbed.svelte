<Embed
  {src}
  {title}
  {params}
  {origin}
  decoder={DECODER}
  preconnections={PRECONNECTIONS}
  on:load
  on:data
  on:rebuild
  on:load={onLoad}
  on:data={onData}
  on:srcchange={onReload}
  bind:this={embed}
/>

<script context="module">
  import { decode_json } from '@vime-js/utils';
  import { ORIGIN, ORIGIN_NO_COOKIES } from './utils';

  const DECODER = decode_json;

  const PRECONNECTIONS = [
    ORIGIN,
    ORIGIN_NO_COOKIES,
    'https://www.google.com',
    'https://googleads.g.doubleclick.net',
    'https://static.doubleclick.net',
    'https://s.ytimg.com',
    'https://i.ytimg.com'
  ];

  const YT = {};

  YT.Event = {
    INITIAL_DELIVERY: 'initialDelivery',
    ERROR: 'onError'
  };

  const Event = {
    READY: 'ready',
    TITLE_CHANGE: 'titlechange',
    ORIGIN_CHANGE: 'originchange',
    SRC_CHANGE: 'srcchange',
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

  export let params = {};
  export let srcId = null;
  export let cookies = false;

  export const getSrc = () => src;
  export const getOrigin = () => origin;
  export const getTitle = () => videoTitle;
  export const getIframe = () => embed.getIframe();
  export const getSrcWithParams = () => embed.getSrc();

  export const sendCommand = async (command, args, force) => {
    try {
      if (!force) {
        await tick();
        await ready.promise;
      }
      embed.postMessage({
        event: 'command',
        func: command,
        args: args || ''
      });
    } catch (e) { /** noop */ }
  };

  const buildSrc = () => {
    const vId = window.encodeURIComponent(srcId || '');
    return `${origin}/embed/${vId}?enablejsapi=1`;
  };

  const onLoad = () => {
    // Seems like have to wait a misc small delay or else YT player isn't ready.
    setTimeout(() => embed.postMessage({ event: 'listening' }), 100);
  };
  
  const onReload = () => {
    ready.promise.catch(noop);
    ready.reject();
    ready = deferred();
    initialized = false;
  };

  const onSrcChange = () => { videoTitle = ''; };

  const onVideoData = videoData => {
    const { title } = videoData;
    if (title) videoTitle = title;
  };

  const onInfo = info => {
    const { playerState, videoData } = info;
    if (videoData) onVideoData(videoData);
    if (playerState === 5) {
      ready.resolve();
      dispatch(Event.READY);
    }
  };

  const _onData = e => {
    const data = e.detail;
    const { info, event } = data || {};
    if (info) onInfo(info);
    if (event === YT.Event.ERROR) {
      ready.reject(data.info);
      dispatch(Event.ERROR, data.info);
    }
    initialized = event && ((event === YT.Event.INITIAL_DELIVERY) || (event === YT.Event.ERROR));
  };

  $: title = `YouTube ${videoTitle || 'Video Player'}`;
  $: origin = cookies ? ORIGIN : ORIGIN_NO_COOKIES;
  $: src = buildSrc(origin, srcId);
  $: onData = !initialized ? _onData : null;

  let mounted = false;
  onMount(() => { mounted = true; });
  
  $: if (mounted) dispatch(Event.TITLE_CHANGE, videoTitle);
  $: if (mounted) dispatch(Event.ORIGIN_CHANGE, origin);
  $: if (mounted) dispatch(Event.SRC_CHANGE, src);
</script>