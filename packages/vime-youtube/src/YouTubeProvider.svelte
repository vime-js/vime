<YouTubeEmbed
  {srcId}
  {params}
  {cookies}
  on:srcchange
  on:originchange
  on:titlechange
  on:rebuild={onRebuildStart}
  on:data={onData}
  bind:this={embed}
/>

<script context="module">
  import { is_string, load_image } from '@vime/utils';
  import { VideoQuality } from '@vime/core';

  const YT = {
    URL: /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/,
    // @see https://developers.google.com/youtube/iframe_api_reference#Events
    Event: {
      READY: 'onReady'
    },
    // @see https://developers.google.com/youtube/iframe_api_reference#Playback_status
    State: {
      UNSTARTED: -1,
      ENDED: 0,
      PLAYING: 1,
      PAUSED: 2,
      BUFFERING: 3,
      CUED: 5
    },
    // @see https://developers.google.com/youtube/iframe_api_reference#Events
    QualityMap: {
      unknown: VideoQuality.UNKNOWN,
      tiny: VideoQuality.XXS,
      small: VideoQuality.XS,
      medium: VideoQuality.S,
      large: VideoQuality.M,
      hd720: VideoQuality.L,
      hd1080: VideoQuality.XL,
      highres: VideoQuality.XXL,
      max: VideoQuality.MAX
    },
    // @see https://developers.google.com/youtube/iframe_api_reference#Playback_controls
    Command: {
      PLAY: 'playVideo',
      PAUSE: 'pauseVideo',
      SEEK_TO: 'seekTo',
      MUTE: 'mute',
      UNMUTE: 'unMute',
      SET_VOLUME: 'setVolume',
      SET_PLAYBACK_RATE: 'setPlaybackRate'
    }
  };

  export const canPlay = src => is_string(src) && YT.URL.test(src);

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
  import { createEventDispatcher } from 'svelte';
  import { PlayerEvent, MediaType } from '@vime/core';
  import { is_number, is_boolean } from '@vime/utils';
  import YouTubeEmbed from './YouTubeEmbed.svelte';

  let embed;
  let internalTime = 0;
  let duration = 0;
  let seeking = false;
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
  export let srcId = null;
  export let cookies = false;

  export const getEmbed = () => embed;
  export const getEl = () => embed.getIframe();

  export const setPaused = paused => paused ? send(YT.Command.PAUSE) : send(YT.Command.PLAY);
  export const setMuted = muted => muted ? send(YT.Command.MUTE) : send(YT.Command.UNMUTE);
  export const setVolume = volume => send(YT.Command.SET_VOLUME, [volume]);
  export const setRate = rate => send(YT.Command.SET_PLAYBACK_RATE, [rate]);
  export const setCurrentTime = time => send(YT.Command.SEEK_TO, [time]);
  export const setPlaysinline = enabled => { params.playsinline = enabled ? 1 : 0; };
  export const setNativeMode = nativeMode => { /** noop */ };
  
  export const setControls = enabled => {
    params.controls = enabled ? 1 : 0;
    params.disablekb = enabled ? 0 : 1;
  };

  export const supportsPiP = () => false;
  export const supportsFullscreen = () => true;

  const onRebuildStart = () => dispatch(PlayerEvent.REBUILD_START);

  const onEvent = event => {
    if (event === YT.Event.READY) dispatch(PlayerEvent.READY);
  };

  const onStateChange = state => {
    playerState = state;
    dispatch(PlayerEvent.BUFFERING, state === YT.State.BUFFERING);
    switch (state) {
      case YT.State.ENDED:
        dispatch(PlayerEvent.PLAYBACK_END);
        break;
      case YT.State.PLAYING:
        dispatch(PlayerEvent.PLAYING);
        break;
      case YT.State.PAUSED:
        dispatch(PlayerEvent.PAUSE);
        break;
      case YT.State.CUED:
        duration = 0;
        lastTimeUpdate = 0;
        internalTime = 0;
        playbackRate = 1;
        seeking = false;
        dispatch(PlayerEvent.PLAYBACK_READY);
        dispatch(PlayerEvent.MEDIA_TYPE_CHANGE, MediaType.VIDEO);
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
    dispatch(PlayerEvent.TIME_UPDATE, currentTime);
    // Unfortunately while the player is `paused` `seeking` and `seeked` will fire at the
    // same time, there are no updates at all inbetween -_-.
    if (Math.abs(internalTime - currentTime) > 2) {
      seeking = true;
      dispatch(PlayerEvent.SEEKING);
    }
    internalTime = currentTime;
  };

  const onBuffered = buffered => {
    dispatch(PlayerEvent.BUFFERED, buffered);
    // This is the only way to detect `seeked`.
    if (seeking && (buffered > internalTime)) {
      seeking = false;
      dispatch(PlayerEvent.SEEKED);
    }
  };

  const onInfo = info => {
    const {
      volume, muted, availablePlaybackRates: rates,
      playbackQuality: quality, playbackRate: rate, videoLoadedFraction: loadedFraction,
      availableQualityLevels: qualities, currentTime,
      duration: newDuration, playerState, currentTimeLastUpdated_
    } = info;
    if (is_number(playerState)) onStateChange(playerState);
    if (is_number(newDuration)) {
      duration = parseFloat(newDuration);
      dispatch(PlayerEvent.DURATION_CHANGE, duration);
    }
    if (rates) dispatch(PlayerEvent.RATES_CHANGE, rates);
    if (rate) {
      playbackRate = parseFloat(rate);
      dispatch(PlayerEvent.RATE_CHANGE, rate);
    }
    if (is_number(currentTimeLastUpdated_)) lastTimeUpdate = currentTimeLastUpdated_;
    if (is_number(currentTime)) onTimeUpdate(parseFloat(currentTime));
    if (is_number(loadedFraction)) onBuffered(parseFloat(loadedFraction) * duration);
    if (is_number(volume)) dispatch(PlayerEvent.VOLUME_CHANGE, volume);
    if (is_boolean(muted)) dispatch(PlayerEvent.MUTE_CHANGE, muted);
    if (qualities) {
      const mappedQualities = qualities.map(q => YT.QualityMap[q]).filter(Boolean);
      dispatch(PlayerEvent.QUALITIES_CHANGE, mappedQualities);
    }
    if (quality) dispatch(PlayerEvent.QUALITY_CHANGE, YT.QualityMap[quality]);
  };

  const onData = e => {
    const { event, info } = e.detail;
    if (event) onEvent(event);
    if (info) onInfo(info);
    // TODO: not sure how to map the error event.
  };

  $: if (!srcId && src) srcId = src.match(YT.URL)[1] || null;
  $: getPoster(srcId).then(poster => dispatch(PlayerEvent.POSTER_CHANGE, poster));
</script>