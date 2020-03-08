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
    poster={useNativePoster ? poster : null}
    preload="metadata"
    bind:videoWidth
    playsinline={playsinline}
    playsInline={playsinline}
    x5-playsinline={playsinline}
    on:mozfullscreenchange={onFullscreenChange}
    on:webkitfullscreenchange={onFullscreenChange}
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
    is_array, is_object, can_use_pip, is_number
  } from '@vime/utils';

  const Html5 = {
    PLAYBACK_RATES: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]
  };

  Html5.Ext = {
    AUDIO: /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i,
    VIDEO: /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i,
    HLS: /\.(m3u8)($|\?)/i
  };

  // @see https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
  Html5.WebkitPresentationMode = {
    PIP: 'picture-in-picture',
    INLINE: 'inline',
    FULLSCREEN: 'fullscreen'
  };

  // @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
  Html5.TextTrack = {
    Mode: {
      SHOWING: 'showing',
      HIDDEN: 'hidden'
    },
    Event: {
      CHANGE: 'change',
      CUE_CHANGE: 'cuechange',
    }
  };

  // @see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
  Html5.Event = {
    LOADED_METADATA: 'loadedmetadata',
    PROGRESS: 'progress',
    PLAY: 'play',
    PAUSE: 'pause',
    PLAYING: 'playing',
    DURATION_CHANGE: 'durationchange',
    RATE_CHANGE: 'ratechange',
    SEEKING: 'seeking',
    SEEKED: 'seeked',
    VOLUME_CHANGE: 'volumechange',
    WAITING: 'waiting',
    ENDED: 'ended',
    ERROR: 'error'
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
  import { Disposal, PlayerState, MediaType } from '@vime/core';
  
  import { 
    is_function, can_fullscreen_video, can_use_pip_in_chrome,
    can_use_pip_in_safari
  } from '@vime/utils';

  const disposal = new Disposal();
  const dispatch = createEventDispatcher();

  let info = {};
  let audio = null;
  let video = null;
  let prevMedia = null;
  let poster = null;
  let muted = false;
  let controls = null;
  let playsinline = null;
  let crossorigin = null;
  let aspectRatio = null;
  let currentSrc = null;
  let playbackReady = false;
  let paused = true;
  let videoWidth = 0;
  let videoQuality = null;
  let useNativePoster = false;

  export let src;

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
  export const setAspectRatio = ratio => { aspectRatio = ratio; };
  export const setVideoQuality = quality => { videoQuality = quality; };
  export const setView = enabled => { useNativePoster = enabled; };

  export const setPoster = newPoster => {
    if (poster === newPoster || !is_string(newPoster)) return;
    poster = newPoster || null;
    if (poster) rebuild();
  };

  // --------------------------------------------------------------
  // Picture in Picture
  // --------------------------------------------------------------

  const PIP_NOT_SUPPORTED_ERROR_MSG = 'Html5 PiP not supported.';

  const setChromePiP = active => active ? video.requestPictureInPicture() : document.exitPictureInPicture();

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

  const onFullscreenChange = () => {
    info.fullscreen = (document.webkitFullscreenElement === video) ||
      (document.mozFullScreenElement === video);
  };

  export const setFullscreen = active => {
    if (!video.webkitSupportsFullscreen) return Promise.reject();
    return active ? video.webkitEnterFullscreen() : video.webkitExitFullscreen();
  };

  export const supportsFullscreen = () => can_fullscreen_video();

  // --------------------------------------------------------------
  // Tracks
  // --------------------------------------------------------------

  let tracks = [];
  let currentTrackIndex = -1;
  let onCueChangeListener = null;

  const unbindCueChangeListener = () => {
    if (onCueChangeListener) onCueChangeListener();
    onCueChangeListener = null;
  };

  onDestroy(unbindCueChangeListener);

  const onCueChange = e => {
    info.activeCues = Array.from(e.target.activeCues);
  };

  const listenToCueChanges = track => {
    info.activeCues = track.activeCues ? Array.from(track.activeCues) : [];
    onCueChangeListener = listen(track, Html5.TextTrack.Event.CUE_CHANGE, onCueChange);
  };

  export const enableTracks = enabled => {
    tracks[currentTrackIndex].mode = enabled 
      ? Html5.TextTrack.Mode.SHOWING 
      : Html5.TextTrack.Mode.HIDDEN;
  };

  export const setTracks = newTracks => {
    unbindCueChangeListener();
    tracks = newTracks || [];
    currentTrackIndex = -1;
  };

  export const setTrack = index => {
    const tracks = Array.from(media.textTracks);
    unbindCueChangeListener();
    if (currentTrackIndex !== -1) tracks[currentTrackIndex].mode = Html5.TextTrack.Mode.HIDDEN;
    const track = tracks[index];
    track.mode = Html5.TextTrack.Mode.SHOWING;
    listenToCueChanges(track);
    currentTrackIndex = index;
  };

  const onTracksChange = e => {
    const tracks = Array.from(media.textTracks);
    const index = tracks.findIndex(t => t.mode === Html5.TextTrack.Mode.SHOWING);
    if (currentTrackIndex !== index) {
      setTrack(index);
      currentTrackIndex = index;
      info.currentTrackIndex = index;
    }
  };

  // --------------------------------------------------------------
  // Media 
  // --------------------------------------------------------------

  let timeRaf;
  
  const cancelTimeUpdates = () => window.cancelAnimationFrame(timeRaf);
  onDestroy(cancelTimeUpdates);
  
  const getTimeUpdates = () => {
    info.currentTime = media.currentTime;
    timeRaf = raf(getTimeUpdates);
  };

  const listenToMedia = (event, cb) => disposal.add(listen(media, event, cb));

  const onBuffered = () => {
    const buffered = media.buffered;
    const duration = media.duration;
    const end = (buffered.length === 0) ? 0 : buffered.end(buffered.length - 1);
    info.buffered = (end > duration) ? duration : end;
  };

  const setupMediaListeners = () => {
    listenToMedia(Html5.Event.LOADED_METADATA, () => {
      info.state = PlayerState.CUED;
      info.playbackRates = Html5.PLAYBACK_RATES;
      info.mediaType = video ? MediaType.VIDEO : MediaType.AUDIO;
      if (srcHasQualities) {
        info.videoQualities = src.map(s => s.quality);
        info.videoQuality = videoQuality;
      }
      onBuffered();
      playbackReady = true;
    });
    listenToMedia(Html5.Event.PROGRESS, onBuffered);
    listenToMedia(Html5.Event.PLAY, () => { 
      paused = false;
      info.play = true; 
    });
    listenToMedia(Html5.Event.PAUSE, () => { 
      paused = true;
      info.state = PlayerState.PAUSED; 
    });
    listenToMedia(Html5.Event.PLAYING, () => { info.state = PlayerState.PLAYING; });
    listenToMedia(Html5.Event.DURATION_CHANGE, () => { info.duration = media.duration; });
    listenToMedia(Html5.Event.RATE_CHANGE, () => { info.playbackRate = media.playbackRate; });
    listenToMedia(Html5.Event.SEEKING, () => {
      info.currentTime = media.currentTime;
      info.seeking = true;
    });
    listenToMedia(Html5.Event.SEEKED, () => { info.seeked = true; });
    listenToMedia(Html5.Event.VOLUME_CHANGE, () => {
      info.volume = parseInt(media.volume * 100);
      info.muted = media.muted;
    });
    listenToMedia(Html5.Event.WAITING, () => { info.state = PlayerState.BUFFERING; });
    listenToMedia(Html5.Event.ENDED, () => { info.state = PlayerState.ENDED; });
    listenToMedia(Html5.Event.ERROR, e => dispatch('error', e));
    disposal.add(listen(media.textTracks, Html5.TextTrack.Event.CHANGE, onTracksChange));
  };

  const onEnterPiP = () => { info.pip = true; };
  const onExitPiP = () => { info.pip = false; };

  const onPresentationModeChange = e => {
    const mode = video.webkitPresentationMode;
    info.pip = (mode === Html5.WebkitPresentationMode.PIP);
    info.fullscreen = (mode === Html5.WebkitPresentationMode.FULLSCREEN);
  };

  const load = async () => {
    // Wait for media to load.
    await tick();
    media.load();
  };

  const rebuild = async () => {
    info.rebuild = true;
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
    playbackReady = false;
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
  $: (playbackReady && !paused) ? getTimeUpdates() : cancelTimeUpdates();
  $: tick().then(() => { info.currentSrc = currentSrc; });

  // If media is initialized or changed (audio/video/false).
  $: if (prevMedia !== media) {
    disposal.dispose();
    unbindCueChangeListener();
    if (media) setupMediaListeners();
    prevMedia = media;
  }

  $: {
    dispatch('update', info);
    info = {};
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