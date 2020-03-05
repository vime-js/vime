<VimeoEmbed
  {srcId}
  {params}
  on:error
  on:titlechange={onTitleChange}
  on:srcchange={onReload}
  on:rebuild={onReload}
  on:rebuild={onRebuildStart}
  on:srcchange={onCurrentSrcChange}
  on:data={onData}
  bind:this={embed}
/>

<script context="module">
  import { is_string } from '@vime/utils';

  const VM = {
    SRC: /vimeo(?:\.com|)\/([0-9]{9,})/,
    FILE_URL: /vimeo\.com\/external\/[0-9]+\..+/,
    THUMBNAIL_URL: /vimeocdn\.com\/video\/([0-9]+)/
  };

  // @see https://developer.vimeo.com/player/sdk/reference#methods-for-playback-controls
  VM.Command = {
    PLAY: 'play',
    PAUSE: 'pause',
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
    PLAY: 'play',
    PAUSE: 'pause',
    READY: 'ready',
    LOAD_PROGRESS: 'loadProgress',
    BUFFER_START: 'bufferstart',
    BUFFER_END: 'bufferend',
    LOADED: 'loaded',
    FINISH: 'finish',
    SEEKING: 'seeking',
    SEEKED: 'seeked',
    CUE_CHANGE: 'cuechange',
    FULLSCREEN_CHANGE: 'fullscreenchange',
    VOLUME_CHANGE: 'volumechange',
    DURATION_CHANGE: 'durationchange',
    PLAYBACK_RATE_CHANGE: 'playbackratechange',
    TEXT_TRACK_CHANGE: 'texttrackchange',
    ERROR: 'error'
  };

  // @see https://developer.vimeo.com/player/sdk/reference#events-for-playback-controls
  VM.EVENTS = [
    VM.Event.PLAY,
    VM.Event.PAUSE,
    VM.Event.SEEKING,
    'seeked',
    'timeupdate',
    VM.Event.VOLUME_CHANGE,
    VM.Event.DURATION_CHANGE,
    VM.Event.FULLSCREEN_CHANGE,
    VM.Event.CUE_CHANGE,
    'progress',
    VM.Event.ERROR,
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
  import { PlayerState, MediaType } from '@vime/core';
  import VimeoEmbed from './VimeoEmbed.svelte';

  let embed;
  let info = {};
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

  onMount(() => { info.origin = embed.getOrigin(); });
  onMount(() => { info.mediaType = MediaType.VIDEO; });
  const onRebuildStart = () => { info.rebuild = true; };
  const onTitleChange = e => { info.title = e.detail; };
  
  const onCurrentSrcChange = e => {
    currentSrc = e.detail;
    info.srcId = srcId;
    info.currentSrc = e.detail;
  };

  const onReload = () => {
    ready = false;
    seeking = false;
    internalTime = 0;
    tracks = [];
    currentTrack = -1;
  };

  const onTimeUpdate = time => {
    info.currentTime = time;
    if (Math.abs(internalTime - time) > 1) {
      seeking = true;
      info.seeking = true;
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
      info.tracks = tracks;
      info.currentTrack = tracks.findIndex(t => t.mode === 'showing');
    }
    if (!event) return;
    switch (event) {
      case VM.Event.READY:
        info.ready = true;
        VM.EVENTS.forEach(event => send(VM.Command.ADD_EVENT_LISTENER, event));
        break;
      case VM.Event.LOADED:
        ready = true;
        info.state = PlayerState.CUED;
        send(VM.Command.GET_TEXT_TRACKS);
        break;
      case VM.Event.PLAY:
        info.state = PlayerState.PLAYING;
        break;
      case VM.Event.PAUSE:
        info.state = PlayerState.PAUSED;
        break;
      case VM.Event.LOAD_PROGRESS:
        info.buffered = payload.seconds;
        break;
      case VM.Event.BUFFER_START:
        info.state = PlayerState.BUFFERING;
        break;
      case VM.Event.SEEKING:
        info.seeking = true;
        break;
      case VM.Event.TEXT_TRACK_CHANGE:
        info.currentTrack = tracks.findIndex(t => t.label === payload.label);
        break;
      case VM.Event.CUE_CHANGE:
        info.activeCues = payload.cues ? payload.cues : [payload];
        break;
      case VM.Event.SEEKED:
        seeking = false;
        info.seeked = true;
        break;
      case VM.Event.VOLUME_CHANGE:
        info.volume = parseFloat(payload.volume) * 100;
        break;
      case VM.Event.DURATION_CHANGE:
        info.duration = payload.duration;
        break;
      case VM.Event.PLAYBACK_RATE_CHANGE:
        info.playbackRate = payload.playbackRate;
        break;
      case VM.Event.FULLSCREEN_CHANGE:
        info.fullscreen = payload.fullscreen;
        break;
      case VM.Event.FINISH:
        info.state = PlayerState.ENDED;
        break;
      case VM.Event.ERROR:
        dispatch('error', payload);
        break;
    }
  };

  $: match = src ? src.match(VM.SRC) : null;
  $: srcId = match ? match[1] : src;
  $: getPoster(currentSrc).then(poster => { info.poster = poster; });
  $: (!seeking && ready) ? getTimeUpdates() : cancelTimeUpdates();

  $: {
    dispatch('update', info);
    info = {};
  }
</script>