<VimeoEmbed
  {srcId}
  {params}
  on:titlechange
  on:error
  on:srcchange={onReload}
  on:rebuild={onReload}
  on:rebuild={onRebuildStart}
  on:srcchange={onCurrentSrcChange}
  on:data={onData}
  bind:this={embed}
/>

<script context="module">
  import { is_string } from '@vime/utils';
  import { PlayerEvent } from '@vime/core';

  const VM = {
    SRC: /vimeo(?:\.com|)\/([0-9]{9,})/,
    FILE_URL: /vimeo\.com\/external\/[0-9]+\..+/,
    THUMBNAIL_URL: /vimeocdn\.com\/video\/([0-9]+)/
  };

  // @see https://developer.vimeo.com/player/sdk/reference#methods-for-playback-controls
  VM.Command = {
    PLAY: PlayerEvent.PLAY,
    PAUSE: PlayerEvent.PAUSE,
    SET_MUTED: 'setMuted',
    SET_VOLUME: 'setVolume',
    SET_CURRENT_TIME: 'setCurrentTime',
    SET_PLAYBACK_RATE: 'setPlaybackRate',
    ADD_EVENT_LISTENER: 'addEventListener',
    GET_CURRENT_TIME: 'getCurrentTime',
    GET_TEXT_TRACKS: 'getTextTracks',
    ENABLE_TEXT_TRACK: 'enableTextTrack',
    DISABLE_TEXT_TRACK: 'disableTextTrack'
  };

  // Some reason event names are different when calling `addEventListener` vs the event name
  // that comes through `onData`, hence `VM.Event` and `VM.EVENTS` below.
  VM.Event = {
    PLAY: PlayerEvent.PLAY,
    PAUSE: PlayerEvent.PAUSE,
    READY: PlayerEvent.READY,
    LOAD_PROGRESS: 'loadProgress',
    BUFFER_START: 'bufferstart',
    BUFFER_END: 'bufferend',
    LOADED: 'loaded',
    FINISH: 'finish',
    SEEKING: PlayerEvent.SEEKING,
    SEEKED: 'seek',
    CUE_CHANGE: PlayerEvent.CUE_CHANGE,
    FULLSCREEN_CHANGE: PlayerEvent.FULLSCREEN_CHANGE,
    VOLUME_CHANGE: PlayerEvent.VOLUME_CHANGE,
    DURATION_CHANGE: PlayerEvent.DURATION_CHANGE,
    PLAYBACK_RATE_CHANGE: PlayerEvent.PLAYBACK_RATE_CHANGE,
    TEXT_TRACK_CHANGE: 'texttrackchange',
    ERROR: PlayerEvent.ERROR
  };

  // @see https://developer.vimeo.com/player/sdk/reference#events-for-playback-controls
  VM.EVENTS = [
    PlayerEvent.PLAY,
    PlayerEvent.PAUSE,
    PlayerEvent.SEEKING,
    PlayerEvent.SEEKED,
    PlayerEvent.TIME_UPDATE,
    PlayerEvent.VOLUME_CHANGE,
    PlayerEvent.DURATION_CHANGE,
    PlayerEvent.FULLSCREEN_CHANGE,
    PlayerEvent.CUE_CHANGE,
    PlayerEvent.PROGRESS,
    PlayerEvent.ERROR,
    VM.Event.PLAYBACK_RATE_CHANGE,
    VM.Event.LOADED,
    VM.Event.BUFFER_START,
    VM.Event.BUFFER_END,
    VM.Event.TEXT_TRACK_CHANGE,
    'waiting',
    'ended'
  ];

  export const canPlay = src => is_string(src) && !VM.FILE_URL.test(src) && VM.SRC.test(src);

  const getPoster = src => {
    if (!src) return Promise.resolve(null);
    return window.fetch(`https://noembed.com/embed?url=${src}`)
      .then(response => response.json())
      .then(data => {
        const thumbnailId = data.thumbnail_url.match(VM.THUMBNAIL_URL)[1];
        return `https://i.vimeocdn.com/video/${thumbnailId}_1920x1080.jpg?r=pad`;
      });
  };
</script>

<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { raf } from 'svelte/internal';
  import { MediaType } from '@vime/core';
  import VimeoEmbed from './VimeoEmbed.svelte';

  let embed;
  let srcId = null;
  let currentSrc = null;
  let seeking = false;
  let ready = false;
  let tracks = [];
  let currentTrack = -1;
  let internalTime = 0;

  const params = {
    // Controlled by Vime.
    autopause: false
  };

  const dispatch = createEventDispatcher();
  const send = (command, args) => embed && embed.sendCommand(command, args);

  export let src = null;

  export const getEmbed = () => embed;
  export const getEl = () => embed.getIframe();

  export const setPaused = paused => paused ? send(VM.Command.PAUSE) : send(VM.Command.PLAY);
  export const setMuted = muted => send(VM.Command.SET_MUTED, muted);
  export const setVolume = volume => send(VM.Command.SET_VOLUME, volume / 100);
  export const setCurrentTime = time => send(VM.Command.SET_CURRENT_TIME, time);
  export const setPlaysinline = enabled => { params.playsinline = enabled; };
  export const setControls = enabled => { params.controls = enabled; };
  export const setNativeMode = nativeMode => { /** noop */ };
  export const setPlaybackRate = rate => send(VM.Command.SET_PLAYBACK_RATE, rate);

  export const supportsPiP = () => false;
  export const supportsFullscreen = () => true;

  export const setTrack = index => {
    if (index === -1) send(VM.Command.DISABLE_TEXT_TRACK);
    if (index > -1) {
      const { language, kind } = tracks[index];
      send(VM.Command.ENABLE_TEXT_TRACK, { language, kind });
    }
    currentTrack = index;
  };

  onMount(() => dispatch(PlayerEvent.ORIGIN_CHANGE, embed.getOrigin()));
  onMount(() => dispatch(PlayerEvent.MEDIA_TYPE_CHANGE, MediaType.VIDEO));
  const onRebuildStart = () => dispatch(PlayerEvent.REBUILD_START);
  
  const onCurrentSrcChange = e => {
    currentSrc = e.detail;
    dispatch(PlayerEvent.SRC_ID_CHANGE, srcId);
    dispatch(PlayerEvent.CURRENT_SRC_CHANGE, e.detail);
  };

  const onReload = () => {
    ready = false;
    seeking = false;
    internalTime = 0;
    tracks = [];
    currentTrack = -1;
  };

  const onTimeUpdate = time => {
    dispatch(PlayerEvent.TIME_UPDATE, time);
    if (Math.abs(internalTime - time) > 1) {
      seeking = true;
      dispatch(PlayerEvent.SEEKING);
      // When paused Vimeo doesn't fire `buffering` event.
      dispatch(PlayerEvent.BUFFERING);
    }
    internalTime = time;
  };

  let timeRaf;
  const cancelTimeUpdates = () => window.cancelAnimationFrame(timeRaf);
  onDestroy(cancelTimeUpdates);
  const getTimeUpdates = () => {
    send(VM.Command.GET_CURRENT_TIME);
    timeRaf = raf(getTimeUpdates);
  };

  const onData = e => {
    const data = e.detail;
    if (!data) return;
    const event = data.event;
    const payload = data.data;
    if (data.method === VM.Command.GET_CURRENT_TIME) {
      onTimeUpdate(parseFloat(data.value));
      return;
    }
    if (data.method === VM.Command.GET_TEXT_TRACKS) {
      tracks = data.value || [];
      currentTrack = tracks.findIndex(t => t.mode === 'showing');
    }
    if (!event) return;
    switch (event) {
      case VM.Event.READY:
        dispatch(PlayerEvent.READY);
        VM.EVENTS.forEach(event => send(VM.Command.ADD_EVENT_LISTENER, event));
        break;
      case VM.Event.LOADED:
        ready = true;
        dispatch(PlayerEvent.PLAYBACK_READY);
        send(VM.Command.GET_TEXT_TRACKS);
        break;
      case VM.Event.PLAY:
        dispatch(PlayerEvent.PLAYING);
        break;
      case VM.Event.PAUSE:
        dispatch(PlayerEvent.PAUSE);
        break;
      case VM.Event.LOAD_PROGRESS:
        dispatch(PlayerEvent.BUFFERED, payload.seconds);
        break;
      case VM.Event.BUFFER_START:
        dispatch(PlayerEvent.BUFFERING);
        break;
      case VM.Event.BUFFER_END:
        dispatch(PlayerEvent.BUFFERING, false);
        break;
      case VM.Event.SEEKING:
        dispatch(PlayerEvent.SEEKING);
        break;
      case VM.Event.TEXT_TRACK_CHANGE:
        currentTrack = tracks.findIndex(t => t.label === payload.label);
        break;
      case VM.Event.CUE_CHANGE:
        dispatch(PlayerEvent.CUE_CHANGE, payload.cues ? payload.cues : [payload]);
        break;
      case VM.Event.SEEKED:
        if (seeking) dispatch(PlayerEvent.BUFFERING, false);
        seeking = false;
        dispatch(PlayerEvent.SEEKED);
        break;
      case VM.Event.VOLUME_CHANGE:
        dispatch(PlayerEvent.VOLUME_CHANGE, parseFloat(payload.volume) * 100);
        break;
      case VM.Event.DURATION_CHANGE:
        dispatch(PlayerEvent.DURATION_CHANGE, payload.duration);
        break;
      case VM.Event.PLAYBACK_RATE_CHANGE:
        dispatch(PlayerEvent.PLAYBACK_RATE_CHANGE, payload.playbackRate);
        break;
      case VM.Event.FULLSCREEN_CHANGE:
        dispatch(PlayerEvent.FULLSCREEN_CHANGE, payload.fullscreen);
        break;
      case VM.Event.FINISH:
        dispatch(PlayerEvent.PLAYBACK_END);
        break;
      case VM.Event.ERROR:
        dispatch(PlayerEvent.ERROR, payload);
        break;
    }
  };

  $: match = src ? src.match(VM.SRC) : null;
  $: srcId = match ? match[1] : src;
  $: dispatch(PlayerEvent.TRACKS_CHANGE, tracks);
  $: dispatch(PlayerEvent.TRACK_CHANGE, currentTrack);
  $: getPoster(currentSrc).then(poster => dispatch(PlayerEvent.POSTER_CHANGE, poster));
  $: (!seeking && ready) ? getTimeUpdates() : cancelTimeUpdates();
</script>