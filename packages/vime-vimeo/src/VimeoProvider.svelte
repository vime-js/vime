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
  import { can_play } from './utils';

  const VM = {};

  // @see https://developer.vimeo.com/player/sdk/reference#methods-for-playback-controls
  VM.Command = {
    PLAY: 'play',
    PAUSE: 'pause',
    SET_MUTED: 'setMuted',
    SET_VOLUME: 'setVolume',
    SET_CURRENT_TIME: 'setCurrentTime',
    SET_PLAYBACK_RATE: 'setPlaybackRate',
    ADD_EVENT_LISTENER: 'addEventListener',
    GET_DURATION: 'getDuration',
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

  export const canPlay = src => can_play(src);
</script>

<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { raf } from 'svelte/internal';
  import { PlayerState, MediaType } from '@vime/core';
  import { is_array } from '@vime/utils';
  import VimeoEmbed from './VimeoEmbed.svelte';
  import { get_src_id, get_poster } from './utils';

  let embed;
  let info = {};
  let tracks = [];
  let srcId = null;
  let currentSrc = null;
  let seeking = false;
  let playbackReady = false;
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

  export const setPaused = paused => { paused ? send(VM.Command.PAUSE) : send(VM.Command.PLAY); };
  export const setMuted = muted => { send(VM.Command.SET_MUTED, muted); };
  export const setVolume = volume => { send(VM.Command.SET_VOLUME, volume / 100); };
  export const setCurrentTime = time => { send(VM.Command.SET_CURRENT_TIME, time); };
  export const setPlaysinline = enabled => { params.playsinline = enabled; };
  export const setControls = enabled => { params.controls = enabled; };
  export const setPlaybackRate = rate => { send(VM.Command.SET_PLAYBACK_RATE, rate); };

  export const supportsPiP = () => false;
  export const supportsFullscreen = () => true;

  export const setTrack = index => {
    if (index === -1) {
      send(VM.Command.DISABLE_TEXT_TRACK);
      return;
    }
    const { language, kind } = tracks[index];
    send(VM.Command.ENABLE_TEXT_TRACK, { language, kind });
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
    playbackReady = false;
    seeking = false;
    internalTime = 0;
    tracks = [];
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

  const onMethod = (method, value) => {
    switch (method) {
      case VM.Command.GET_CURRENT_TIME:
        onTimeUpdate(parseFloat(value));
        break;
      case VM.Command.GET_TEXT_TRACKS:
        tracks = value || [];
        info.tracks = tracks.map(track => ({ ...track, srclang: track.language }));
        info.currentTrackIndex = tracks.findIndex(t => t.mode === 'showing');
        break;
      case VM.Command.GET_DURATION:
        info.duration = parseFloat(value);
        break;
    }
  };

  const onData = e => {
    const data = e.detail;
    if (!data) return;
    const { event, data: payload } = data;
    if (data.method) onMethod(data.method, data.value);
    if (!event) return;
    switch (event) {
      case VM.Event.READY:
        VM.EVENTS.forEach(event => send(VM.Command.ADD_EVENT_LISTENER, event));
        break;
      case VM.Event.LOADED:
        info.state = PlayerState.CUED;
        send(VM.Command.GET_DURATION);
        send(VM.Command.GET_TEXT_TRACKS);
        playbackReady = true;
        break;
      case VM.Event.PLAY:
        info.state = PlayerState.PLAYING;
        break;
      case VM.Event.PAUSE:
        info.state = PlayerState.PAUSED;
        break;
      case VM.Event.LOAD_PROGRESS:
        info.buffered = parseFloat(payload.seconds);
        break;
      case VM.Event.BUFFER_START:
        info.state = PlayerState.BUFFERING;
        break;
      case VM.Event.SEEKING:
        info.seeking = true;
        break;
      case VM.Event.TEXT_TRACK_CHANGE:
        info.currentTrackIndex = tracks.findIndex(t => t.label === payload.label);
        break;
      case VM.Event.SEEKED:
        seeking = false;
        info.seeked = true;
        break;
      case VM.Event.VOLUME_CHANGE:
        info.volume = parseFloat(payload.volume) * 100;
        break;
      case VM.Event.DURATION_CHANGE:
        info.duration = parseFloat(payload.duration);
        break;
      case VM.Event.PLAYBACK_RATE_CHANGE:
        info.playbackRate = parseFloat(payload.playbackRate);
        break;
      case VM.Event.FULLSCREEN_CHANGE:
        info.fullscreen = !!payload.fullscreen;
        break;
      case VM.Event.FINISH:
        info.state = PlayerState.ENDED;
        break;
      case VM.Event.ERROR:
        dispatch('error', payload);
        break;
    }
  };

  $: srcId = get_src_id(src);
  $: get_poster(src).then(poster => { info.poster = poster; }).catch(e => dispatch('error', e));
  $: (!seeking && playbackReady) ? getTimeUpdates() : cancelTimeUpdates();

  $: {
    dispatch('update', info);
    info = {};
  }
</script>