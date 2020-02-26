{#if shouldUseAudio}
  <audio
    {controls}
    {crossorigin}
    bind:currentTime
    bind:this={audio}
  >
    <Source src={currentSrc} />
  </audio>
{:else if shouldUseVideo}
  <video
    {controls}
    {crossorigin}
    {poster}
    playsinline={playsinline}
    playsInline={playsinline}
    x5-playsinline={playsinline}
    webkit-playsinline={playsinline}
    on:enterpictureinpicture={onEnterPiP}
    on:leavepictureinpicture={onExitPiP}
    on:webkitpresentationmodechanged={onPresentationModeChange}
    bind:currentTime
    bind:this={video}
  >
    <Source src={currentSrc} />
  </video>
{/if}

<script context="module">
  import { 
    is_instance_of, is_string, can_play_hls_natively,
    is_array, can_use_pip 
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
    Event: {
      LOADED_METADATA: 'loadedmetadata',
      WAITING: 'waiting',
      ENDED: 'ended'
    }
  };

  const isMediaStream = src => is_instance_of(src, window.MediaStream);
  const isQualitiesSet = src => is_array(src) && src.every(mediaResource => mediaResource.quality);
  const isDropboxUrl = src => is_string(src) && Html5.Url.DROPBOX.test(src);
  const isAudio = src => Html5.Ext.AUDIO.test(src);
  const isVideo = src => {
    return Html5.Ext.VIDEO.test(src) || (can_play_hls_natively() && Html5.Ext.HLS.test(src));
  };

  const canPlayResource = resource => {
    if (isMediaStream(resource)) return true;
    const src = is_string(resource) ? resource : resource.src;
    if (!is_string(src)) return false;
    return isAudio(src) || isVideo(src);
  };

  export const canPlay = (src, extensionCanPlay = () => false) => is_array(src)
    ? src.some(resource => canPlayResource(resource) || extensionCanPlay(resource))
    : canPlayResource(src) || extensionCanPlay(src);
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  import { run_all, listen } from 'svelte/internal';
  import Source from './Source.svelte';
  import { Disposal, PlayerEvent, MediaType } from '@vime/core';
  import { is_function } from '@vime/utils';

  const disposal = new Disposal();
  const dispatch = createEventDispatcher();

  let currentTime = 0;
  let audio = null;
  let video = null;
  let prevMedia = null;
  const poster = null;
  let muted = false;
  let controls = null;
  let playsinline = null;
  let crossorigin = null;
  let currentSrc = null;
  const quality = null;

  export let src;

  export const getMedia = () => media;

  export const setCurrentTime = time => { currentTime = time; };
  export const setMuted = isMuted => { muted = isMuted; };
  export const setPaused = paused => { paused ? media.pause() : media.play(); }; 
  export const setVolume = volume => { media.volume = parseFloat(volume / 100); };
  export const setRate = rate => { media.playbackRate = rate; };
  export const setCrossOrigin = origin => { crossorigin = origin || null; };
  export const setControls = enabled => { controls = enabled || null; };
  export const setPlaysinline = enabled => { playsinline = enabled || null; };
  export const setNativeMode = nativeMode => { /** noop */ };

  export const setFullscreen = active => {
    active ? video.webkitEnterFullscreen() : video.webkitExitFullscreen();
  };

  export const supportsPiP = () => can_use_pip();
  
  export const supportsFullscreen = () => video && 
    video.webkitSupportsFullscreen &&
    is_function(video.webkitEnterFullscreen);

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

  const setupMediaListeners = () => {
    listenToMedia(Html5.Event.LOADED_METADATA, () => {
      onBuffered();
      dispatch(PlayerEvent.PLAYBACK_READY);
      dispatch(PlayerEvent.MEDIA_TYPE_CHANGE, video ? MediaType.VIDEO : MediaType.AUDIO);
      dispatch(PlayerEvent.RATES_CHANGE, Html5.PLAYBACK_RATES);
    });
    forwardMediaEvent(PlayerEvent.PLAY);
    forwardMediaEvent(PlayerEvent.PAUSE);
    forwardMediaEvent(PlayerEvent.PLAYING);
    forwardMediaEvent(PlayerEvent.DURATION_CHANGE, null, () => media.duration);
    forwardMediaEvent(PlayerEvent.RATE_CHANGE, null, () => media.playbackRate);
    // forwardMediaEvent(PlayerEvent.SEEKING)
    // forwardMediaEvent(PlayerEvent.SEEKED)
    listenToMedia(PlayerEvent.SEEKING, () => console.log('internal-seeking'));
    forwardMediaEvent(PlayerEvent.SEEKED, PlayerEvent.BUFFERING, () => false);
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
    dispatch(PlayerEvent.PIP_CHANGE, (mode === 'picture-in-picture'));
  };

  const onSrcChange = () => {
    currentSrc = src;
  };

  $: media = audio || video;
  $: if (media) media.muted = muted;

  $: onSrcChange(src);
  $: shouldUseAudio = isAudio(currentSrc) && !is_string(poster);
  $: shouldUseVideo = isVideo(currentSrc) || isMediaStream(currentSrc) || is_string(poster);
  $: dispatch(PlayerEvent.TIME_UPDATE, currentTime);
  $: console.log(currentTime);

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