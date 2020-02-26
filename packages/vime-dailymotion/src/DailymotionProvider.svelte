<DailymotionEmbed
  {srcId}
  {params}
  on:srcchange
  on:titlechange
  on:rebuild={onRebuildStart}
  on:data={onData}
  bind:this={embed}
/>

<script context="module">
  import { is_string  } from '@vime/utils';
  import { PlayerEvent } from '@vime/core';

  const DM = {
    // eslint-disable-next-line
    URL: /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?$/,
    // @see https://developer.dailymotion.com/player/#player-api-events
    Event: {
      API_READY: 'apiready',
      VIDEO_CHANGE: 'videochange',
      VOLUME_CHANGE: PlayerEvent.VOLUME_CHANGE,
      PLAYBACK_READY: 'playback_ready',
      SEEKING: PlayerEvent.SEEKING,
      SEEKED: PlayerEvent.SEEKED,
      WAITING: 'waiting',
      PROGRESS: PlayerEvent.PROGRESS,
      QUALITY_CHANGE: PlayerEvent.QUALITY_CHANGE,
      QUALITIES_AVAILABLE: 'qualitiesavailable',
      FULLSCREEN_CHANGE: PlayerEvent.FULLSCREEN_CHANGE,
      DURATION_CHANGE: PlayerEvent.DURATION_CHANGE,
      PLAYING: PlayerEvent.PLAYING,
      PLAY: PlayerEvent.PLAY,
      PAUSE: PlayerEvent.PAUSE,
      AD_TIME_UPDATE: 'ad_timeupdate',
      TIME_UPDATE: PlayerEvent.TIME_UPDATE,
      VIDEO_START: 'video_start',
      VIDEO_END: 'video_end',
      ERROR: PlayerEvent.ERROR
    },
    // @see https://developer.dailymotion.com/player/#player-api-methods
    Command: {
      PLAY: PlayerEvent.PLAY,
      PAUSE: PlayerEvent.PAUSE,
      SEEK: 'seek',
      VOLUME: 'volume',
      CONTROLS: 'controls',
      MUTED: 'muted',
      QUALITY: 'quality',
      FULLSCREEN: 'fullscreen'
    }
  };

  export const canPlay = src => is_string(src) && DM.URL.test(src);

  const getPoster = srcId => {
    if (!srcId) return Promise.resolve(null);
    return window.fetch(`https://api.dailymotion.com/video/${srcId}?fields=thumbnail_1080_url`)
      .then(response => response.json())
      .then(data => data.thumbnail_1080_url);
  };
</script>

<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { MediaType } from '@vime/core';
  import { is_number, is_boolean } from '@vime/utils';
  import DailymotionEmbed from './DailymotionEmbed.svelte';

  let embed;

  // DM commands don't go through until ads have finished, so we store them and then replay them
  // once the video starts.
  let startTime = null;
  let startVolume = null;
  let startMuted = null;
  let started = false;

  const params = {};
  const dispatch = createEventDispatcher();
  const send = (command, args) => embed && embed.sendCommand(command, args);

  export let src = null;
  export let srcId = null;

  export const getEmbed = () => embed;

  export const setPaused = paused => paused ? send(DM.Command.PAUSE) : send(DM.Command.PLAY);
  export const setPlaysinline = enabled => { /** noop */ };
  export const setControls = enabled => send(DM.Command.CONTROLS, [enabled]);
  export const setQuality = quality => send(DM.Command.QUALITY, [quality]);
  export const setFullscreen = active => send(DM.Command.FULLSCREEN, [active]);

  export const setMuted = muted => {
    if (!started) startMuted = muted;
    send(DM.Command.MUTED, [muted]);
  };

  export const setVolume = volume => {
    if (!started) startVolume = volume;
    send(DM.Command.VOLUME, [volume / 100]);
  };

  export const setCurrentTime = time => {
    if (!started) startTime = time;
    send(DM.Command.SEEK, [time]);
  };
  
  export const setNativeMode = nativeMode => {
    params['ui-logo'] = nativeMode;
    params['ui-start-screen-info'] = nativeMode;
  };

  export const supportsPiP = () => false;
  export const supportsFullscreen = () => true;

  onMount(() => dispatch(PlayerEvent.ORIGIN_CHANGE, embed.getOrigin()));

  const onRebuildStart = () => dispatch(PlayerEvent.REBUILD_START);

  const onData = e => {
    const data = e.detail;
    const event = data && data.event;
    if (!event) return;
    switch (event) {
      case DM.Event.API_READY:
        dispatch(PlayerEvent.READY);
        break;
      case DM.Event.PLAYBACK_READY:
        startTime = null;
        startVolume = null;
        startMuted = null;
        started = false;
        dispatch(PlayerEvent.PLAYBACK_READY);
        dispatch(PlayerEvent.MEDIA_TYPE_CHANGE, MediaType.VIDEO);
        break;
      case DM.Event.VIDEO_START:
        if (is_number(startTime) && startTime > 0) {
          setCurrentTime(startTime);
          dispatch(PlayerEvent.SEEKING);
        }
        if (is_boolean(startMuted)) setMuted(startMuted);
        if (is_number(startVolume)) setVolume(startVolume);
        started = true;
        break;
      case DM.Event.TIME_UPDATE:
      case DM.Event.AD_TIME_UPDATE:
        dispatch(PlayerEvent.TIME_UPDATE, data.time);
        break;
      case DM.Event.VOLUME_CHANGE:
        dispatch(PlayerEvent.MUTE_CHANGE, data.muted);
        dispatch(PlayerEvent.VOLUME_CHANGE, parseFloat(data.volume) * 100);
        break;
      case DM.Event.SEEKING:
        dispatch(PlayerEvent.SEEKING);
        // When paused DM doesn't fire `buffering` event.
        dispatch(PlayerEvent.BUFFERING);
        break;
      case DM.Event.SEEKED:
        dispatch(PlayerEvent.BUFFERING, false);
        dispatch(PlayerEvent.SEEKED, parseFloat(data.time));
        break;
      case DM.Event.WAITING:
        dispatch(PlayerEvent.BUFFERING);
        break;
      case DM.Event.PROGRESS:
        dispatch(PlayerEvent.BUFFERED, data.time);
        break;
      case DM.Event.QUALITIES_AVAILABLE:
        dispatch(PlayerEvent.QUALITIES_CHANGE, data.qualities);
        break;
      case DM.Event.QUALITY_CHANGE:
        dispatch(PlayerEvent.QUALITY_CHANGE, data.quality);
        break;
      case DM.Event.PLAY:
        dispatch(PlayerEvent.PLAY);
        break;
      case DM.Event.PLAYING:
        dispatch(PlayerEvent.PLAYING);
        break;
      case DM.Event.PAUSE:
        dispatch(PlayerEvent.PAUSE);
        break;
      case DM.Event.DURATION_CHANGE:
        dispatch(PlayerEvent.DURATION_CHANGE, data.duration);
        break;
      case DM.Event.VIDEO_END:
        dispatch(PlayerEvent.PLAYBACK_END);
        break;
      case DM.Event.FULLSCREEN_CHANGE:
        dispatch(PlayerEvent.FULLSCREEN_CHANGE, data.fullscreen);
        break;
      case DM.Event.ERROR:
        dispatch(PlayerEvent.ERROR, data);
        break;
    }
  };

  $: if (!srcId && src) srcId = src.match(DM.URL)[1] || null;
  $: getPoster(srcId).then(poster => dispatch(PlayerEvent.POSTER_CHANGE, poster));
</script>