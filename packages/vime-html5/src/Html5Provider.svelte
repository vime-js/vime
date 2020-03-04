{#if shouldUseAudio}
  <audio
    {controls}
    {crossorigin}
    bind:this={audio}
  >
    <Source src={currentSrc} />
    <Tracks {tracks} />
    Media not supported.
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
    <Tracks {tracks} />
    Media not supported.
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
    WebkitPresentationMode: {
      PIP: 'picture-in-picture',
      INLINE: 'inline',
      FULLSCREEN: 'fullscreen'
    },
    TextTrack: {
      Mode: {
        SHOWING: 'showing',
        HIDDEN: 'hidden'
      },
      Event: {
        CHANGE: 'change',
        CUE_CHANGE: 'cuechange'
      }
    },
    Event: {
      LOADED_METADATA: 'loadedmetadata',
      WAITING: 'waiting',
      ENDED: 'ended'
    }
  };

  const Dropbox = {
    URL: /www\.dropbox\.com\/.+/,
    ORIGIN: 'www.dropbox.com',
    CONTENT_ORIGIN: 'dl.dropboxusercontent.com'
  };

  const isMediaStream = src => is_instance_of(src, window.MediaStream);
  const isQualitiesSet = src => is_array(src) && src.every(resource => is_number(resource.quality));
  const isDropboxUrl = src => is_string(src) && Dropbox.URL.test(src);
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
  import { run_all, listen, raf, noop } from 'svelte/internal';
  import Source from './Source.svelte';
  import Tracks from './Tracks.svelte';
  import { Disposal, PlayerEvent, MediaType } from '@vime/core';
  
  import { 
    is_function, can_fullscreen_video, can_use_pip_in_chrome,
    can_use_pip_in_safari
  } from '@vime/utils';

  const disposal = new Disposal();
  const dispatch = createEventDispatcher();

  let audio = null;
  let video = null;
  let prevMedia = null;
  let poster = null;
  let muted = false;
  let controls = null;
  let playsinline = null;
  let crossorigin = null;
  let currentSrc = null;
  let ready = false;
  let paused = true;
  let videoWidth = 0;
  let videoQuality = null;

  export let src;
  export let aspectRatio = null;

  export const getEl = () => media;
  export const getMedia = () => media;

  export const setCurrentTime = time => { media.currentTime = time; };
  export const setMuted = isMuted => { muted = isMuted; };
  export const setPaused = paused => { paused ? media.pause() : media.play().catch(noop); }; 
  export const setVolume = volume => { media.volume = parseFloat(volume / 100); };
  export const setPlaybackRate = rate => { media.playbackRate = rate; };
  export const setCrossOrigin = origin => { crossorigin = origin || null; };
  export const setControls = enabled => { controls = enabled || null; };
  export const setPlaysinline = enabled => { playsinline = enabled || null; };
  export const setNativeMode = nativeMode => { /** noop */ };
  export const setVideoQuality = quality => { videoQuality = quality; };

  export const setPoster = newPoster => {
    if (poster === newPoster) return;
    poster = newPoster || null;
    if (poster) rebuild();
  };

  // --------------------------------------------------------------
  // Picture in Picture
  // --------------------------------------------------------------

  const PIP_NOT_SUPPORTED_ERROR_MSG = 'Html5 PiP not supported.';

  const setChromePiP = active => active ? video.requestPictureInPicture() : video.exitPictureInPicture();

  const setSafariPiP = active => {
    const mode = active ? Html5.WebkitPresentationMode.PIP : Html5.WebkitPresentationMode.INLINE;
    if (!video.webkitSupportsPresentationMode(mode)) return Promise.reject(PIP_NOT_SUPPORTED_ERROR_MSG);
    return video.webkitSetPresentationMode(mode);
  };

  export const setPiP = active => {
    if (!supportsPiP()) return Promise.reject(PIP_NOT_SUPPORTED_ERROR_MSG);
    if (can_use_pip_in_chrome()) {
      return setChromePiP(active);
    } else if (can_use_pip_in_safari()) {
      return setSafariPiP(active);
    }
  };

  export const supportsPiP = () => can_use_pip();

  // --------------------------------------------------------------
  // Fullscreen
  // --------------------------------------------------------------

  export const setFullscreen = active => {
    if (!video.webkitSupportsFullscreen) return Promise.reject();
    return active ? video.webkitEnterFullscreen() : video.webkitExitFullscreen();
  };

  export const supportsFullscreen = () => can_fullscreen_video();

  // --------------------------------------------------------------
  // Tracks
  // --------------------------------------------------------------

  let tracks = [];
  let currentTrack = -1;
  let onCueChangeListener = null;

  const removeOnCueChangeListener = () => {
    if (onCueChangeListener) onCueChangeListener();
    onCueChangeListener = null;
  };

  onDestroy(removeOnCueChangeListener);

  const onCueChange = e => {
    const activeCues = Array.from(e.target.activeCues);
    dispatch(PlayerEvent.CUE_CHANGE, activeCues);
  };

  const listenToCueChanges = track => {
    dispatch(PlayerEvent.CUE_CHANGE, track.activeCues ? Array.from(track.activeCues) : []);
    onCueChangeListener = listen(track, Html5.TextTrack.Event.CUE_CHANGE, onCueChange);
  };

  export const setTracks = newTracks => { 
    removeOnCueChangeListener();
    tracks = newTracks || [];
    currentTrack = -1;
  };

  export const setTrack = newTrack => {
    const tracks = Array.from(media.textTracks);
    if (tracks.length === 0 || currentTrack == newTrack) return;
    removeOnCueChangeListener();
    if (currentTrack > -1) tracks[currentTrack].mode = Html5.TextTrack.Mode.HIDDEN;
    if (newTrack > -1) {
      const track = tracks[newTrack];
      track.mode = Html5.TextTrack.Mode.SHOWING;
      listenToCueChanges(track);
    }
    currentTrack = newTrack;
  };

  const onTracksChange = e => {
    const tracks = Array.from(media.textTracks);
    const newTrack = tracks.findIndex(t => t.mode === Html5.TextTrack.Mode.SHOWING);
    if (currentTrack !== newTrack) {
      dispatch(PlayerEvent.TRACK_CHANGE, newTrack);
      setTrack(newTrack);
      currentTrack = newTrack;
    }
  };

  // --------------------------------------------------------------
  // Media 
  // --------------------------------------------------------------

  onMount(() => dispatch(PlayerEvent.READY));

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

  const setupMediaListeners = () => {
    listenToMedia(Html5.Event.LOADED_METADATA, () => {
      dispatch(PlayerEvent.PLAYBACK_READY);
      dispatch(PlayerEvent.PLAYBACK_RATES_CHANGE, Html5.PLAYBACK_RATES);
      dispatch(PlayerEvent.MEDIA_TYPE_CHANGE, video ? MediaType.VIDEO : MediaType.AUDIO);
      if (srcHasQualities) {
        dispatch(PlayerEvent.VIDEO_QUALITIES_CHANGE, src.map(s => s.quality));
        dispatch(PlayerEvent.VIDEO_QUALITY_CHANGE, videoQuality);
      }
      onBuffered();
      ready = true;
    });
    listenToMedia(PlayerEvent.PROGRESS, onBuffered);
    forwardMediaEvent(PlayerEvent.PLAY, null, () => { paused = false; });
    forwardMediaEvent(PlayerEvent.PAUSE, null, () => { paused = true; });
    forwardMediaEvent(PlayerEvent.PLAYING);
    forwardMediaEvent(PlayerEvent.DURATION_CHANGE, null, () => media.duration);
    forwardMediaEvent(PlayerEvent.PLAYBACK_RATE_CHANGE, null, () => media.playbackRate);
    forwardMediaEvent(PlayerEvent.SEEKING, PlayerEvent.TIME_UPDATE, () => media.currentTime);
    forwardMediaEvent(PlayerEvent.SEEKING);
    forwardMediaEvent(PlayerEvent.SEEKED);
    forwardMediaEvent(PlayerEvent.VOLUME_CHANGE, null, () => (media.volume * 100));
    forwardMediaEvent(PlayerEvent.VOLUME_CHANGE, PlayerEvent.MUTE_CHANGE, () => media.muted);
    forwardMediaEvent(Html5.Event.WAITING, PlayerEvent.BUFFERING);
    forwardMediaEvent(Html5.Event.ENDED, PlayerEvent.PLAYBACK_END);
    forwardMediaEvent(PlayerEvent.ERROR, null, e => e);
    disposal.add(listen(media.textTracks, Html5.TextTrack.Event.CHANGE, onTracksChange));
  };

  const onEnterPiP = () => dispatch(PlayerEvent.PIP_CHANGE, true);
  const onExitPiP = () => dispatch(PlayerEvent.PIP_CHANGE, false);

  const onPresentationModeChange = e => {
    const mode = video.webkitPresentationMode;
    dispatch(PlayerEvent.PIP_CHANGE, (mode === Html5.WebkitPresentationMode.PIP));
    dispatch(PlayerEvent.FULLSCREEN_CHANGE, (mode === Html5.WebkitPresentationMode.FULLSCREEN));
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
    const didChange = currentSrc.some(s => s.quality !== videoQuality);
    if (!didChange) return;
    currentSrc = src.filter(s => s.quality === videoQuality);
    rebuild();
  };

  const calcQuality = () => {
    if (videoQuality || videoWidth <= 0) return;
    let i = 0;
    let newQuality = src[i].quality;
    const [w, h] = aspectRatio.split(':');
    const minQuality = videoWidth / (w/h);
    while (i < (src.length - 1) && newQuality < minQuality) {
      i += 1;
      newQuality = src[i].quality;
    }
    videoQuality = newQuality;
  };

  const loadNewSrc = () => {
    const newSrc = isDropboxUrl(src)
      ? src.replace(Dropbox.ORIGIN, Dropbox.CONTENT_ORIGIN)
      : src;
    currentSrc = newSrc;
    load();
  };

  const onSrcChange = () => {
    ready = false;
    videoQuality = null;
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
  $: if (is_number(videoQuality)) loadNewQuality(videoQuality);
  $: shouldUseAudio = everySrc(src, isAudio) && !is_string(poster);
  $: shouldUseVideo = everySrc(src, isVideo) || isMediaStream(src) || is_string(poster);
  $: (ready && !paused) ? getTimeUpdates() : cancelTimeUpdates();
  $: tick().then(() => dispatch(PlayerEvent.CURRENT_SRC_CHANGE, currentSrc));

  // If media is initialized or changed (audio/video/false).
  $: if (prevMedia !== media) {
    disposal.dispose();
    removeOnCueChangeListener();
    if (media) setupMediaListeners();
    prevMedia = media;
  }
</script>

<style>
  audio, 
  video {
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