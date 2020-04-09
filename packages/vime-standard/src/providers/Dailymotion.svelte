<LitePlayer 
  {src}
  {params}
  providers={[DailymotionProvider]}
  hasWrapper={false}
  on:error
  on:titlechange={onTitleChange}
  on:rebuild={onRebuildStart}
  on:litePlayerurlchange={onEmbedURLChange}
  on:data={onData}
  bind:this={litePlayer}
/>

<script context="module">
  import { can_play } from '@vime-js/core/dailymotion';

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
    AD_PLAY: 'ad_play',
    AD_END: 'ad_end',
    TIME_UPDATE: 'timeupdate',
    VIDEO_START: 'video_start',
    VIDEO_END: 'video_end',
    ERROR: 'error',
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
    FULLSCREEN: 'fullscreen',
  };

  export const canPlay = can_play;
</script>

<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { is_number, is_boolean } from '@vime-js/utils';
  import { Player as LitePlayer, DailymotionProvider } from '@vime-js/lite';
  import { fetch_poster, fetch_video_duration } from '@vime-js/core/dailymotion';
  import MediaType from '../MediaType';
  import PlayerState from '../PlayerState';

  let srcId;
  let litePlayer;
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
  const send = (command, args) => litePlayer && litePlayer.sendCommand(command, args);

  export let src = null;

  export const getLitePlayer = () => litePlayer;
  export const getEl = () => (litePlayer ? litePlayer.getEmbed().getIframe() : null);

  export const setPlaysinline = () => { /** noop */ };
  export const setVideoQuality = (newQuality) => { send(DM.Command.QUALITY, [newQuality]); };
  export const setControls = (isEnabled) => { send(DM.Command.CONTROLS, [isEnabled]); };
  export const setFullscreen = (isActive) => { send(DM.Command.FULLSCREEN, [isActive]); };

  export const setPaused = (isPaused) => {
    isPaused ? send(DM.Command.PAUSE) : send(DM.Command.PLAY);
  };

  export const setMuted = (isMuted) => {
    if (!started) startMuted = isMuted;
    send(DM.Command.MUTED, [isMuted]);
  };

  export const setVolume = (newVolume) => {
    if (!started) startVolume = newVolume;
    send(DM.Command.VOLUME, [newVolume / 100]);
  };

  export const setCurrentTime = (newTime) => {
    if (!started) startTime = newTime;
    send(DM.Command.SEEK, [newTime]);
  };
  
  export const setView = (enabled) => {
    params['ui-logo'] = enabled;
    params['ui-start-screen-info'] = enabled;
  };

  export const supportsPiP = () => false;
  export const supportsFullscreen = () => true;

  onMount(() => { info.origin = litePlayer.getOrigin(); });
  onMount(() => { info.mediaType = MediaType.VIDEO; });
  
  const onRebuildStart = () => { info.rebuild = true; };
  const onTitleChange = (e) => { info.title = e.detail; };
  
  const onEmbedURLChange = (e) => {
    srcId = litePlayer.getSrcId();
    info.currentSrc = e.detail;
    info.srcId = srcId;
  };

  const onData = (e) => {
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
        info.muted = (data.muted === 'true');
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
      case DM.Event.AD_PLAY:
        send(DM.Command.PLAY);
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
      default:
        break;
    }
  };

  const fetchPoster = () => fetch_poster(src)
    .then((poster) => { info.poster = poster; })
    .catch((e) => dispatch('error', e));

  const fetchVideoDuration = () => fetch_video_duration(src)
    .then((duration) => { info.duration = duration; })
    .catch((e) => dispatch('error', e));

  $: fetchPoster(src);
  $: fetchVideoDuration(src);

  $: {
    dispatch('update', info);
    info = {};
  }
</script>