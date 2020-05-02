<LitePlayer 
  {src}
  {params}
  {cookies}
  providers={[YouTubeProvider]}
  hasWrapper={false}
  on:error
  on:originchange={onOriginChange}
  on:titlechange={onTitleChange}
  on:rebuild={onRebuildStart}
  on:embedurlchange={onEmbedURLChange}
  on:data={onData}
  bind:this={litePlayer}
/>

<script context="module">
  import VideoQuality from '../VideoQuality';
  import { can_play } from '@vime-js/core/youtube';

  const YT = {};

  // @see https://developers.google.com/youtube/iframe_api_reference#Events
  YT.Event = {
    READY: 'onReady',
  };

  // @see https://developers.google.com/youtube/iframe_api_reference#Playback_status
  YT.State = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
  };

  // @see https://developers.google.com/youtube/iframe_api_reference#Events
  YT.QualityMap = {
    unknown: VideoQuality.UNKNOWN,
    tiny: VideoQuality.XXS,
    small: VideoQuality.XS,
    medium: VideoQuality.S,
    large: VideoQuality.M,
    hd720: VideoQuality.L,
    hd1080: VideoQuality.XL,
    highres: VideoQuality.XXL,
    max: VideoQuality.MAX,
  };

  // @see https://developers.google.com/youtube/iframe_api_reference#Playback_controls
  YT.Command = {
    PLAY: 'playVideo',
    PAUSE: 'pauseVideo',
    SEEK_TO: 'seekTo',
    MUTE: 'mute',
    UNMUTE: 'unMute',
    SET_VOLUME: 'setVolume',
    SET_PLAYBACK_RATE: 'setPlaybackRate',
  };

  export const canPlay = can_play;
</script>

<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { is_number, is_boolean } from '@vime-js/utils';
  import { fetch_poster } from '@vime-js/core/youtube';
  import { Player as LitePlayer, YouTubeProvider } from '@vime-js/lite';
  import MediaType from '../MediaType';
  import PlayerState from '../PlayerState';

  let litePlayer;
  let info = {};
  let duration = 0;
  let seeking = false;
  let internalTime = 0;
  let lastTimeUpdate = 0;
  let playbackRate = 1;
  let playerState = -1;

  const params = {
    rel: 0,
    fs: 1,
    iv_load_policy: 3,
    widget_referrer: window.location.href,
  };

  const dispatch = createEventDispatcher();
  const send = (command, args) => litePlayer && litePlayer.sendCommand(command, args);

  export let src = null;
  export let cookies = false;

  export const getLitePlayer = () => litePlayer;
  export const getEl = () => (litePlayer ? litePlayer.getEmbed().getIframe() : null);

  export const setMuted = (isMuted) => { isMuted ? send(YT.Command.MUTE) : send(YT.Command.UNMUTE); };
  export const setVolume = (newVolume) => { send(YT.Command.SET_VOLUME, [newVolume]); };
  export const setPlaybackRate = (newRate) => { send(YT.Command.SET_PLAYBACK_RATE, [newRate]); };
  export const setCurrentTime = (newTime) => { send(YT.Command.SEEK_TO, [newTime]); };
  export const setPlaysinline = (isEnabled) => { params.playsinline = isEnabled ? 1 : 0; };

  export const setPaused = (isPaused) => {
    isPaused ? send(YT.Command.PAUSE) : send(YT.Command.PLAY);
  };
  
  export const setControls = (isEnabled) => {
    params.controls = isEnabled ? 1 : 0;
    params.disablekb = isEnabled ? 0 : 1;
  };

  export const supportsPiP = () => false;
  export const supportsFullscreen = () => true;

  let hasMounted = false;
  onMount(() => {
    info.mediaType = MediaType.VIDEO;
    hasMounted = true;
  });
  
  const onRebuildStart = () => { info.rebuild = true; };
  const onOriginChange = (e) => { info.origin = e.detail; };
  const onTitleChange = (e) => { info.title = e.detail; };
  
  const onEmbedURLChange = (e) => {
    info.currentSrc = e.detail;
    info.mediaId = litePlayer.getMediaId();
  };

  const onStateChange = (state) => {
    playerState = state;
    switch (state) {
      case YT.State.ENDED:
        info.state = PlayerState.ENDED;
        break;
      case YT.State.PLAYING:
        info.state = PlayerState.PLAYING;
        break;
      case YT.State.BUFFERING:
        info.state = PlayerState.BUFFERING;
        break;
      case YT.State.PAUSED:
        info.state = PlayerState.PAUSED;
        break;
      case YT.State.CUED:
        duration = 0;
        lastTimeUpdate = 0;
        internalTime = 0;
        playbackRate = 1;
        seeking = false;
        info.state = PlayerState.CUED;
        break;
      default:
        break;
    }
  };

  const calcCurrentTime = (time) => {
    let currentTime = time;
    if (playerState === YT.State.PLAYING) {
      const elapsedTime = (Date.now() / 1E3 - lastTimeUpdate) * playbackRate;
      if (elapsedTime > 0) currentTime += Math.min(elapsedTime, 1);
    }
    return currentTime;
  };

  const onTimeUpdate = (time) => {
    const currentTime = calcCurrentTime(time);
    info.currentTime = currentTime;
    // Unfortunately while the player is `paused` `seeking` and `seeked` will fire at the
    // same time, there are no updates at all inbetween -_-.
    if (Math.abs(internalTime - currentTime) > 2) {
      seeking = true;
      info.seeking = true;
    }
    internalTime = currentTime;
  };

  const onBuffered = (buffered) => {
    info.buffered = buffered;
    // This is the only way to detect `seeked`.
    if (seeking && (buffered > internalTime)) {
      seeking = false;
      info.seeked = true;
    }
  };

  const onInfo = (_info) => {
    const {
      volume, muted, availablePlaybackRates: rates,
      playbackQuality: quality, playbackRate: rate, videoLoadedFraction: loadedFraction,
      availableQualityLevels: qualities, currentTime,
      duration: newDuration, playerState: state, currentTimeLastUpdated_,
    } = _info;
    if (is_number(state)) onStateChange(state);
    if (is_number(newDuration)) {
      duration = parseFloat(newDuration);
      info.duration = duration;
    }
    if (rates) info.playbackRates = rates;
    if (rate) {
      playbackRate = parseFloat(rate);
      info.playbackRate = playbackRate;
    }
    if (is_number(currentTimeLastUpdated_)) lastTimeUpdate = currentTimeLastUpdated_;
    if (is_number(currentTime)) onTimeUpdate(parseFloat(currentTime));
    if (is_number(loadedFraction)) onBuffered(parseFloat(loadedFraction) * duration);
    if (is_number(volume)) info.volume = volume;
    if (is_boolean(muted)) info.muted = muted;
    if (qualities) {
      const mappedQualities = qualities.map((q) => YT.QualityMap[q]).filter(Boolean);
      info.videoQualities = mappedQualities;
    }
    if (quality) info.videoQuality = YT.QualityMap[quality];
  };

  const onData = (e) => {
    const dInfo = e.detail.info;
    if (dInfo) onInfo(dInfo);
  };

  const fetchPoster = () => fetch_poster(src)
    .then((poster) => { info.poster = poster; })
    .catch((e) => dispatch('error', e));

  $: if (hasMounted) fetchPoster(src);

  $: if (hasMounted) {
    dispatch('update', info);
    info = {};
  }
</script>