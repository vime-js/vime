<YouTubeEmbed
  {srcId}
  {params}
  {cookies}
  on:error
  on:originchange={onOriginChange}
  on:titlechange={onTitleChange}
  on:rebuild={onRebuildStart}
  on:srcchange={onCurrentSrcChange}
  on:data={onData}
  bind:this={embed}
/>

<script context="module">
  import { is_string, load_image } from '@vime/utils';
  import { VideoQuality } from '@vime/core';

  const YT = {
    SRC: /(?:youtu\.be|youtube|youtube\.com|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|)((?:\w|-){11})/
  };

  // @see https://developers.google.com/youtube/iframe_api_reference#Events
  YT.Event = {
    READY: 'onReady'
  };

  // @see https://developers.google.com/youtube/iframe_api_reference#Playback_status
  YT.State = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5
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
    max: VideoQuality.MAX
  };

  // @see https://developers.google.com/youtube/iframe_api_reference#Playback_controls
  YT.Command = {
    PLAY: 'playVideo',
    PAUSE: 'pauseVideo',
    SEEK_TO: 'seekTo',
    MUTE: 'mute',
    UNMUTE: 'unMute',
    SET_VOLUME: 'setVolume',
    SET_PLAYBACK_RATE: 'setPlaybackRate'
  };

  export const canPlay = src => is_string(src) && YT.SRC.test(src);

  const getPoster = srcId => {
    if (!srcId) return Promise.resolve(null);
    const posterSrc = quality => `https://i.ytimg.com/vi/${srcId}/${quality}.jpg`;
    // We are testing a that the image has a min-width of 121px because if the thumbnail does
    // not exist YouTube returns a blank/error image that is 120px wide.
    return load_image(posterSrc('maxresdefault'), 121) // 1080p (no padding)
      .catch(() => load_image(posterSrc('sddefault'), 121)) // 640p (padded 4:3)
      .catch(() => load_image(posterSrc('hqdefault'), 121)) // 480p (padded 4:3)
      .then(img => img.src || null);
  };
</script>

<script>
  import { tick, onMount, createEventDispatcher } from 'svelte';
  import { PlayerState, MediaType } from '@vime/core';
  import { is_number, is_boolean } from '@vime/utils';
  import YouTubeEmbed from './YouTubeEmbed.svelte';

  let embed;
  let info = {}; 
  let srcId = null;
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
    widget_referrer: window.location.href
  };

  const dispatch = createEventDispatcher();
  const send = (command, args) => embed && embed.sendCommand(command, args);

  export let src = null;
  export let cookies = false;

  export const getEmbed = () => embed;
  export const getEl = () => embed.getIframe();

  export const setPaused = paused => paused ? send(YT.Command.PAUSE) : send(YT.Command.PLAY);
  export const setMuted = muted => muted ? send(YT.Command.MUTE) : send(YT.Command.UNMUTE);
  export const setVolume = volume => send(YT.Command.SET_VOLUME, [volume]);
  export const setPlaybackRate = rate => send(YT.Command.SET_PLAYBACK_RATE, [rate]);
  export const setCurrentTime = time => send(YT.Command.SEEK_TO, [time]);
  export const setPlaysinline = enabled => { params.playsinline = enabled ? 1 : 0; };
  
  export const setControls = enabled => {
    params.controls = enabled ? 1 : 0;
    params.disablekb = enabled ? 0 : 1;
  };

  export const supportsPiP = () => false;
  export const supportsFullscreen = () => true;

  onMount(() => { info.mediaType = MediaType.VIDEO; });
  const onRebuildStart = () => { info.rebuild = true; };
  const onOriginChange = e => { info.origin = e.detail; };
  const onTitleChange = e => { info.title = e.detail; };
  
  const onCurrentSrcChange = e => {
    info.srcId = srcId;
    info.currentSrc = e.detail;
  };

  const onStateChange = state => {
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
    }
  };

  const calcCurrentTime = time => {
    let currentTime = time;
    if (playerState === YT.State.PLAYING) {
      const elapsedTime = (Date.now() / 1E3 - lastTimeUpdate) * playbackRate;
      if (elapsedTime > 0) currentTime += Math.min(elapsedTime, 1);
    }
    return currentTime;
  };

  const onTimeUpdate = time => {
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

  const onBuffered = buffered => {
    info.buffered = buffered;
    // This is the only way to detect `seeked`.
    if (seeking && (buffered > internalTime)) {
      seeking = false;
      info.seeked = true;
    }
  };

  const onInfo = _info => {
    const {
      volume, muted, availablePlaybackRates: rates,
      playbackQuality: quality, playbackRate: rate, videoLoadedFraction: loadedFraction,
      availableQualityLevels: qualities, currentTime,
      duration: newDuration, playerState, currentTimeLastUpdated_
    } = _info;
    if (is_number(playerState)) onStateChange(playerState);
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
      const mappedQualities = qualities.map(q => YT.QualityMap[q]).filter(Boolean);
      info.videoQualities = mappedQualities;
    }
    if (quality) info.videoQuality = YT.QualityMap[quality];
  };

  const onData = e => {
    const { event, info } = e.detail;
    if (info) onInfo(info);
  };

  $: match = src ? src.match(YT.SRC) : null;
  $: srcId = match ? match[1] : src;
  $: getPoster(srcId).then(poster => { info.poster = poster; });

  $: {
    dispatch('update', info);
    info = {};
  }
</script>