{#if shouldUseAudio}
  <audio
    {controls}
    {crossorigin}
    bind:this={audio}
  >
    <Source src={currentSrc} />
  </audio>
{:else if shouldUseVideo}
  <video
    {controls}
    {crossorigin}
    {poster}
    preload="metadata"
    bind:videoWidth
    playsinline={playsinline}
    playsInline={playsinline}
    x5-playsinline={playsinline}
    webkit-playsinline={playsinline}
    on:enterpictureinpicture={onEnterPiP}
    on:leavepictureinpicture={onExitPiP}
    on:webkitpresentationmodechanged={onPresentationModeChange}
    bind:this={video}
  >
    <Source src={currentSrc} />
  </video>
{/if}

<script context="module">
  import { 
    is_instance_of, is_string, can_play_hls_natively,
    is_array, is_object, can_use_pip , is_number
  } from '@vime/utils';

  const Html5 = {
    PLAYBACK_RATES: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2],
    Ext: {
      AUDIO: /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i,
      VIDEO: /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i,
      HLS: /\.(m3u8)($|\?)/i
    },
    Url: {
      DROPBOX: /www\.dropbox\.com\/.+/
    },
    WebkitPresentationMode: {
      ACTIVE: 'picture-in-picture',
      INACTIVE: 'inline'
    },
    Event: {
      LOADED_METADATA: 'loadedmetadata',
      WAITING: 'waiting',
      ENDED: 'ended'
    }
  };

  const isMediaStream = src => is_instance_of(src, window.MediaStream);
  const isQualitiesSet = src => is_array(src) && src.every(resource => is_number(resource.quality));
  const isDropboxUrl = src => is_string(src) && Html5.Url.DROPBOX.test(src);
  const isAudio = src => Html5.Ext.AUDIO.test(src);
  const isVideo = src => Html5.Ext.VIDEO.test(src) || 
    (can_play_hls_natively() && Html5.Ext.HLS.test(src));

  const extractResource = resource => {
    if (is_string(resource) || isMediaStream(resource)) {
      return resource;
    } else if (is_object(resource)) {
      return resource.src;
    } else {
      return '';
    }
  };

  const everySrc = (src, cb) => is_array(src) 
    ? src.every(resource => cb(extractResource(resource)))
    : cb(extractResource(src));

  export const canPlay = (src, extensionCanPlay = () => false) => isMediaStream(src) ||
    everySrc(src, isAudio) ||
    everySrc(src, isVideo);
</script>

<script>
  import { tick, createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { run_all, listen, raf } from 'svelte/internal';
  import Source from './Source.svelte';
  import { Disposal, PlayerEvent, MediaType } from '@vime/core';
  
  import { 
    is_function, can_fullscreen_video_in_safari, can_use_pip_in_chrome,
    can_use_pip_in_safari
  } from '@vime/utils';

  const disposal = new Disposal();
  const dispatch = createEventDispatcher();

  let audio = null;
  let video = null;
  let prevMedia = null;
  let poster = null;
  let muted = false;
  let quality = null;
  let controls = null;
  let playsinline = null;
  let crossorigin = null;
  let currentSrc = null;
  let ready = false;
  let paused = true;
  let videoWidth = 0;

  export let src;
  export let aspectRatio = null;

  export const getEl = () => media;
  export const getMedia = () => media;

  export const setCurrentTime = time => { media.currentTime = time; };
  export const setMuted = isMuted => { muted = isMuted; };
  export const setPaused = paused => { paused ? media.pause() : media.play(); }; 
  export const setVolume = volume => { media.volume = parseFloat(volume / 100); };
  export const setRate = rate => { media.playbackRate = rate; };
  export const setCrossOrigin = origin => { crossorigin = origin || null; };
  export const setControls = enabled => { controls = enabled || null; };
  export const setPlaysinline = enabled => { playsinline = enabled || null; };
  export const setNativeMode = nativeMode => { /** noop */ };
  export const setQuality = newQuality => { quality = newQuality; };

  export const setPoster = newPoster => {
    if (poster === newPoster) return;
    poster = newPoster || null;
    if (poster) rebuild();
  };

  export const setPiP = active => {
    if (!supportsPiP()) return;
    let fn;
    let isActive;
    if (can_use_pip_in_chrome()) {
      isActive = document.pictureInPictureElement;
      fn = active ? video.requestPictureInPicture : video.exitPictureInPicture;
    } else if (can_use_pip_in_safari()) {
      isActive = (video.webkitPresentationMode === Html5.WebkitPresentationMode.ACTIVE);
      fn = active 
        ? () => video.webkitSetPresentationMode(Html5.WebkitPresentationMode.ACTIVE)
        : () => video.webkitSetPresentationMode(Html5.WebkitPresentationMode.INACTIVE);
    }
    if ((active && !isActive) || (!active && isActive)) return fn();
  };

  export const setFullscreen = active => {
    const isActive = video.webkitDisplayingFullscreen;
    if (active && !isActive) return video.webkitEnterFullscreen();
    if (!active && isActive) return video.webkitExitFullscreen();
  };

  export const supportsPiP = () => can_use_pip();
  export const supportsFullscreen = () => can_fullscreen_video_in_safari();

  let timeRaf;
  const cancelTimeUpdates = () => window.cancelAnimationFrame(timeRaf);
  onDestroy(cancelTimeUpdates);
  const getTimeUpdates = () => {
    dispatch(PlayerEvent.TIME_UPDATE, media.currentTime);
    timeRaf = raf(getTimeUpdates);
  };

  const listenToMedia = (event, cb) => disposal.add(listen(media, event, cb));
  const forwardMediaEvent = (event, to, data) => listenToMedia(
    event, e => dispatch(to || event, data ? data(e) : null)
  );

  const onBuffered = () => {
    const buffered = media.buffered;
    const duration = media.duration;
    const end = (buffered.length === 0) ? 0 : buffered.end(buffered.length - 1);
    dispatch(PlayerEvent.BUFFERED, (end > duration) ? duration : end);
  };

  onMount(() => dispatch(PlayerEvent.READY));

  const setupMediaListeners = () => {
    listenToMedia(Html5.Event.LOADED_METADATA, () => {
      onBuffered();
      dispatch(PlayerEvent.PLAYBACK_READY);
      dispatch(PlayerEvent.RATES_CHANGE, Html5.PLAYBACK_RATES);
      dispatch(PlayerEvent.MEDIA_TYPE_CHANGE, video ? MediaType.VIDEO : MediaType.AUDIO);
      ready = true;
    });
    listenToMedia(PlayerEvent.PROGRESS, onBuffered);
    forwardMediaEvent(PlayerEvent.PLAY, null, () => { paused = false; });
    forwardMediaEvent(PlayerEvent.PAUSE, null, () => { paused = true; });
    forwardMediaEvent(PlayerEvent.PLAYING);
    forwardMediaEvent(PlayerEvent.DURATION_CHANGE, null, () => media.duration);
    forwardMediaEvent(PlayerEvent.RATE_CHANGE, null, () => media.playbackRate);
    forwardMediaEvent(PlayerEvent.SEEKING, PlayerEvent.TIME_UPDATE, () => media.currentTime);
    forwardMediaEvent(PlayerEvent.SEEKING);
    forwardMediaEvent(PlayerEvent.SEEKED);
    forwardMediaEvent(PlayerEvent.VOLUME_CHANGE, null, () => (media.volume * 100));
    forwardMediaEvent(PlayerEvent.VOLUME_CHANGE, PlayerEvent.MUTE_CHANGE, () => media.muted);
    forwardMediaEvent(Html5.Event.WAITING, PlayerEvent.BUFFERING);
    forwardMediaEvent(Html5.Event.ENDED, PlayerEvent.PLAYBACK_END);
    forwardMediaEvent(PlayerEvent.ERROR, null, e => e);
  };

  const onEnterPiP = () => dispatch(PlayerEvent.PIP_CHANGE, true);
  const onExitPiP = () => dispatch(PlayerEvent.PIP_CHANGE, false);

  const onPresentationModeChange = e => {
    if (!can_use_pip()) return;
    const mode = video.webkitPresentationMode;
    dispatch(PlayerEvent.PIP_CHANGE, (mode === Html5.WebkitPresentationMode.ACTIVE));
  };

  const load = async () => {
    // Wait for media to load.
    await tick();
    media.load();
  };

  const rebuild = async () => {
    dispatch(PlayerEvent.REBUILD_START);
    load();
  };

  const loadMediaStream = () => {
    currentSrc = null;
    try {
      media.srcObject = src;
    } catch (e) {
      media.src = window.URL.createObjectURL(src);
    }
  };

  const loadNewQuality = async () => {
    currentSrc = src.filter(s => s.quality === quality);
    // Wait for player store to reset.
    await tick();
    dispatch(PlayerEvent.QUALITIES_CHANGE, src.map(s => s.quality));
    dispatch(PlayerEvent.QUALITY_CHANGE, quality);
    rebuild();
  };

  const calcQuality = () => {
    if (videoWidth <= 0) return;
    let i = 0;
    let newQuality = src[i].quality;
    const [w, h] = aspectRatio.split(':');
    const minQuality = videoWidth / (w/h);
    while (i < (src.length - 1) && newQuality < minQuality) {
      i += 1;
      newQuality = src[i].quality;
    }
    quality = newQuality;
  };

  const loadNewSrc = () => {
    const newSrc = isDropboxUrl(src)
      ? src.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
      : src;
    currentSrc = newSrc;
    load();
  };

  const onSrcChange = () => {
    ready = false;
    quality = null;
    if (isMediaStream(src)) {
      loadMediaStream();
    } else if (!srcHasQualities) {
      loadNewSrc();
    }
  };

  $: media = audio || video;
  $: if (media) media.muted = muted;

  $: onSrcChange(src, srcHasQualities);
  $: srcHasQualities = video && isQualitiesSet(src);
  $: if (srcHasQualities) calcQuality(videoWidth, aspectRatio);
  $: if (is_number(quality)) loadNewQuality(quality);
  $: shouldUseAudio = everySrc(src, isAudio) && !is_string(poster);
  $: shouldUseVideo = everySrc(src, isVideo) || isMediaStream(src) || is_string(poster);
  $: (ready && !paused) ? getTimeUpdates() : cancelTimeUpdates();
  $: dispatch(PlayerEvent.CURRENT_SRC_CHANGE, currentSrc);

  // If media is initialized or changed (audio/video/false).
  $: if (prevMedia !== media) {
    disposal.dispose();
    if (media) setupMediaListeners();
    prevMedia = media;
  }
</script>

<style>
  audio, video {
    border-radius: inherit;
    vertical-align: middle;
    width: 100%;
  }

  video {
    position: absolute;
    top: 0;
    left: 0;
    border: 0;
    width: 100%;
    height: 100%;
    user-select: none;
  }
</style>