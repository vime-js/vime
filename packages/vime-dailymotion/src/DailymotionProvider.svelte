<DailymotionEmbed
  {srcId}
  {params}
  on:error
  on:titlechange={onTitleChange}
  on:srcchange={onCurrentSrcChange}
  on:rebuild={onRebuildStart}
  on:data={onData}
  bind:this={embed}
/>

<script context="module">
  import { can_play } from './utils';

  const DM = {};

  // @see https://developer.dailymotion.com/player/#player-api-events
  DM.Event = {
    API_READY: 'apiready',
    VIDEO_CHANGE: 'videochange',
    VOLUME_CHANGE: 'volumechange',
    PLAYBACK_READY: 'playback_ready',
    SEEKING: 'seeking',
    SEEKED: 'seeked',
    WAITING: 'waiting',
    PROGRESS: 'progress',
    QUALITY_CHANGE: 'qualitychange',
    QUALITIES_AVAILABLE: 'qualitiesavailable',
    FULLSCREEN_CHANGE: 'fullscreenchange',
    DURATION_CHANGE: 'durationchange',
    PLAYING: 'playing',
    PLAY: 'play',
    PAUSE: 'pause',
    START: 'start',
    AD_START: 'ad_start',
    AD_END: 'ad_end',
    TIME_UPDATE: 'timeupdate',
    VIDEO_START: 'video_start',
    VIDEO_END: 'video_end',
    ERROR: 'error'
  };

  // @see https://developer.dailymotion.com/player/#player-api-methods
  DM.Command = {
    PLAY: 'play',
    PAUSE: 'pause',
    SEEK: 'seek',
    DURATION: 'duration',
    VOLUME: 'volume',
    CONTROLS: 'controls',
    MUTED: 'muted',
    QUALITY: 'quality',
    FULLSCREEN: 'fullscreen'
  };

  export const canPlay = src => can_play(src);
</script>

<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { PlayerState, MediaType } from '@vime/core';
  import { is_number, is_boolean } from '@vime/utils';
  import DailymotionEmbed from './DailymotionEmbed.svelte';
  import { get_src_id, get_poster, get_duration } from './utils';

  let embed;
  let srcId = null;
  let info = {};
  let qualities = null;
  let isAdsPlaying = false;

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

  export const getEmbed = () => embed;
  export const getEl = () => embed.getIframe();

  export const setPaused = paused => { paused ? send(DM.Command.PAUSE) : send(DM.Command.PLAY); };
  export const setPlaysinline = enabled => { /** noop */ };
  export const setVideoQuality = quality => { send(DM.Command.QUALITY, [quality]); };
  export const setControls = enabled => { send(DM.Command.CONTROLS, [enabled]); };
  export const setFullscreen = active => { send(DM.Command.FULLSCREEN, [active]); };

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
  
  export const setView = enabled => {
    params['ui-logo'] = enabled;
    params['ui-start-screen-info'] = enabled;
  };

  export const supportsPiP = () => false;
  export const supportsFullscreen = () => true;

  onMount(() => { info.origin = embed.getOrigin(); });
  onMount(() => { info.mediaType = MediaType.VIDEO; });
  const onRebuildStart = () => { info.rebuild = true; };
  const onTitleChange = e => { info.title = e.detail; };
  
  const onCurrentSrcChange = e => {
    info.srcId = srcId;
    info.currentSrc = e.detail;
  };

  const onData = e => {
    const data = e.detail;
    const event = data && data.event;
    if (!event) return;
    switch (event) {
      case DM.Event.PLAYBACK_READY:
        startTime = null;
        startVolume = null;
        startMuted = null;
        started = false;
        qualities = null;
        isAdsPlaying = false;
        info.state = PlayerState.CUED;
        break;
      case DM.Event.START:
        info.state = PlayerState.BUFFERING;
        break;
      case DM.Event.VIDEO_START:
        if (is_number(startTime) && startTime > 0) {
          setCurrentTime(startTime);
          info.seeking = true;
        }
        if (is_boolean(startMuted)) setMuted(startMuted);
        if (is_number(startVolume)) setVolume(startVolume);
        started = true;
        break;
      case DM.Event.TIME_UPDATE:
        info.currentTime = parseFloat(data.time);
        break;
      case DM.Event.VOLUME_CHANGE:
        info.muted = (data.muted == 'true');
        info.volume = parseFloat(data.volume) * 100;
        break;
      case DM.Event.SEEKING:
        info.currentTime = parseFloat(data.time);
        info.seeking = true;
        break;
      case DM.Event.SEEKED:
        info.currentTime = parseFloat(data.time);
        info.seeked = true;
        break;
      case DM.Event.WAITING:
        info.state = PlayerState.BUFFERING;
        break;
      case DM.Event.PROGRESS:
        info.buffered = parseFloat(data.time);
        break;
      case DM.Event.QUALITIES_AVAILABLE:
        qualities = data.qualities;
        info.videoQualities = qualities;
        break;
      case DM.Event.QUALITY_CHANGE:
        info.videoQuality = data.quality;
        // Sometimes quality gets messed up before starting and gets set to 144.
        if (!started && qualities && data.quality === 144) {
          setVideoQuality(qualities[1]);
        }
        break;
      case DM.Event.AD_START:
        isAdsPlaying = true;
        break;
      case DM.Event.AD_END:
        isAdsPlaying = false;
        break;
      case DM.Event.PLAY:
        info.play = true;
        break;
      case DM.Event.PLAYING:
        info.state = PlayerState.PLAYING;
        break;
      case DM.Event.PAUSE:
        info.state = PlayerState.PAUSED;
        break;
      case DM.Event.DURATION_CHANGE:
        if (!isAdsPlaying) info.duration = parseFloat(data.duration);
        break;
      case DM.Event.VIDEO_END:
        info.state = PlayerState.ENDED;
        break;
      case DM.Event.FULLSCREEN_CHANGE:
        info.fullscreen = !!data.fullscreen;
        break;
      case DM.Event.ERROR:
        dispatch('error', data);
        break;
    }
  };

  $: srcId = get_src_id(src);
  $: get_poster(src).then(poster => { info.poster = poster; }).catch(e => dispatch('error', e));
  $: get_duration(srcId).then(duration => { info.duration = duration; });

  $: {
    dispatch('update', info);
    info = {};
  }
</script>