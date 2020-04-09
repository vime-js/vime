<svelte:options accessors />

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
    poster={!playbackStarted ? poster : null}
    preload="metadata"
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
  import { can_play } from '@vime-js/core/file';

  const Html5 = {};

  Html5.PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  // @see https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
  Html5.WebkitPresentationMode = {
    PIP: 'picture-in-picture',
    INLINE: 'inline',
    FULLSCREEN: 'fullscreen',
  };

  // @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
  Html5.TextTrack = {
    Mode: {
      SHOWING: 'showing',
      HIDDEN: 'hidden',
    },
    Event: {
      CHANGE: 'change',
    },
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
    ERROR: 'error',
  };

  export const canPlay = can_play;
</script>

<script>
  import { tick, createEventDispatcher, onDestroy } from 'svelte';
  import Source from './Source.svelte';
  import Tracks from './Tracks.svelte';
  import MediaType from '../../MediaType';
  import PlayerState from '../../PlayerState';
  
  import {
    listen, raf, noop,
    run_all,
  } from 'svelte/internal';

  import {
    is_media_stream, is_qualities_set, run_on_every_src,
    is_audio, is_video,
  } from '@vime-js/core/file';
  
  import {
    can_fullscreen_video, can_use_pip_in_chrome, can_use_pip_in_safari,
    get_computed_width, is_string, can_use_pip, is_number,
  } from '@vime-js/utils';

  let disposal = [];
  
  const dispose = () => {
    run_all(disposal);
    disposal = [];
  };

  onDestroy(dispose);

  const dispatch = createEventDispatcher();

  let info = {};
  let audio = null;
  let video = null;
  let prevMedia = null;
  let poster = null;
  let muted = false;
  let controls = null;
  let playsinline = null;
  let aspectRatio = null;
  let currentSrc = null;
  let playbackReady = false;
  let paused = true;
  let videoQuality = null;
  let playbackStarted = false;

  export let src;
  export let crossorigin = null;

  export const getEl = () => media;
  export const getMedia = () => media;

  export const setCurrentTime = (newTime) => { media.currentTime = newTime; };
  export const setMuted = (isMuted) => { muted = isMuted; };
  export const setPaused = (isPaused) => { isPaused ? media.pause() : media.play().catch(noop); };
  export const setVolume = (newVolume) => { media.volume = parseFloat(newVolume / 100); };
  export const setPlaybackRate = (newRate) => { media.playbackRate = newRate; };
  export const setControls = (isEnabled) => { controls = isEnabled || null; };
  export const setPlaysinline = (isEnabled) => { playsinline = isEnabled || null; };
  export const setAspectRatio = (newRatio) => { aspectRatio = newRatio; };
  export const setVideoQuality = (newVideoQuality) => { videoQuality = newVideoQuality; };

  export const setPoster = (newPoster) => {
    if (poster === newPoster || !is_string(newPoster)) return;
    poster = newPoster || null;
    // eslint-disable-next-line no-use-before-define
    if (poster) rebuild();
  };

  // --------------------------------------------------------------
  // Picture in Picture
  // --------------------------------------------------------------

  const PIP_NOT_SUPPORTED_ERROR_MSG = 'PiP not supported.';

  const setChromePiP = (isActive) => {
    if (!isActive && document.pictureInPictureElement !== video) Promise.reject();
    isActive ? video.requestPictureInPicture() : document.exitPictureInPicture();
  };

  const setSafariPiP = (isActive) => {
    const mode = isActive ? Html5.WebkitPresentationMode.PIP : Html5.WebkitPresentationMode.INLINE;
    if (!video.webkitSupportsPresentationMode(mode)) {
      return Promise.reject(PIP_NOT_SUPPORTED_ERROR_MSG);
    }
    return video.webkitSetPresentationMode(mode);
  };

  export const supportsPiP = () => can_use_pip();

  export const setPiP = (isActive) => {
    if (can_use_pip_in_chrome()) { return setChromePiP(isActive); }
    if (can_use_pip_in_safari()) { return setSafariPiP(isActive); }
    return Promise.reject(PIP_NOT_SUPPORTED_ERROR_MSG);
  };

  // --------------------------------------------------------------
  // Fullscreen
  // --------------------------------------------------------------

  const FULLSCREEN_NOT_SUPPORTED_ERROR_MSG = 'Fullscreen not supported.';

  const onFullscreenChange = () => {
    info.fullscreen = (document.webkitFullscreenElement === video)
      || (document.mozFullScreenElement === video);
  };

  export const setFullscreen = (isActive) => {
    if (!video.webkitSupportsFullscreen) return Promise.reject(FULLSCREEN_NOT_SUPPORTED_ERROR_MSG);
    return isActive ? video.webkitEnterFullscreen() : video.webkitExitFullscreen();
  };

  export const supportsFullscreen = () => can_fullscreen_video();

  // --------------------------------------------------------------
  // Tracks
  // --------------------------------------------------------------

  let tracks = [];
  let currentTrackIndex = -1;

  export const setTracks = (newTracks) => {
    tracks = newTracks || [];
    currentTrackIndex = -1;
  };

  export const setTrack = (newIndex) => {
    const mediaTextTracks = Array.from(media.textTracks);
    if (currentTrackIndex !== -1) {
      mediaTextTracks[currentTrackIndex].mode = Html5.TextTrack.Mode.HIDDEN;
    }
    if (mediaTextTracks.length > 0 && newIndex !== -1) {
      const track = mediaTextTracks[newIndex];
      track.mode = Html5.TextTrack.Mode.SHOWING;
    }
    currentTrackIndex = newIndex;
  };

  const onTracksChange = () => {
    const mediaTextTracks = Array.from(media.textTracks);
    const index = mediaTextTracks.findIndex((t) => t.mode === Html5.TextTrack.Mode.SHOWING);
    if (currentTrackIndex !== index) info.currentTrackIndex = index;
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

  const listenToMedia = (event, cb) => disposal.push(listen(media, event, cb));

  const onBuffered = () => {
    const { buffered } = media;
    const { duration } = media;
    const end = (buffered.length === 0) ? 0 : buffered.end(buffered.length - 1);
    info.buffered = (end > duration) ? duration : end;
  };

  const setupMediaListeners = () => {
    listenToMedia(Html5.Event.LOADED_METADATA, () => {
      info.state = PlayerState.CUED;
      info.playbackRates = Html5.PLAYBACK_RATES;
      info.mediaType = video ? MediaType.VIDEO : MediaType.AUDIO;
      if (srcHasQualities) {
        info.videoQualities = src.map((s) => s.quality);
        info.videoQuality = videoQuality;
      }
      onBuffered();
      playbackReady = true;
    });
    listenToMedia(Html5.Event.PROGRESS, onBuffered);
    listenToMedia(Html5.Event.PLAY, () => {
      paused = false;
      info.play = true;
      playbackStarted = true;
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
      info.volume = parseInt(media.volume * 100, 10);
      info.muted = media.muted;
    });
    listenToMedia(Html5.Event.WAITING, () => { info.state = PlayerState.BUFFERING; });
    listenToMedia(Html5.Event.ENDED, () => { info.state = PlayerState.ENDED; });
    listenToMedia(Html5.Event.ERROR, (e) => dispatch('error', e));
    disposal.push(listen(media.textTracks, Html5.TextTrack.Event.CHANGE, onTracksChange));
  };

  const onEnterPiP = () => { info.pip = true; };
  const onExitPiP = () => { info.pip = false; };

  const onPresentationModeChange = () => {
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
    playbackReady = false;
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
    const didChange = currentSrc.some((s) => s.quality !== videoQuality);
    if (!didChange) return;
    currentSrc = src.filter((s) => s.quality === videoQuality);
    rebuild();
  };

  const calcInitialQuality = () => {
    if (!aspectRatio || videoQuality) return;
    const videoWidth = get_computed_width(video);
    const [w, h] = aspectRatio.split(':');
    const minQuality = (videoWidth / w) * h;
    const qualities = src.map((s) => s.quality);
    // @see https://stackoverflow.com/a/35000557
    const newQuality = qualities.reduce(
      (prev, curr) => (Math.abs(curr - minQuality) < Math.abs(prev - minQuality) ? curr : prev),
    );
    videoQuality = newQuality;
  };

  const loadNewSrc = () => {
    currentSrc = src;
    if (currentSrc) load();
  };

  const onSrcChange = () => {
    playbackReady = false;
    videoQuality = null;
    playbackStarted = false;
    if (is_media_stream(src)) {
      loadMediaStream();
    } else if (!srcHasQualities) {
      loadNewSrc();
    }
  };

  $: media = audio || video;
  $: if (media) media.muted = muted;

  $: onSrcChange(src, srcHasQualities);
  $: srcHasQualities = video && is_qualities_set(src);
  $: if (srcHasQualities) calcInitialQuality(src, aspectRatio);
  $: if (is_number(videoQuality)) loadNewQuality(videoQuality);
  $: shouldUseAudio = run_on_every_src(src, is_audio) && !is_string(poster);
  $: shouldUseVideo = run_on_every_src(src, is_video) || is_media_stream(src) || is_string(poster);
  $: (playbackReady && !paused) ? getTimeUpdates() : cancelTimeUpdates();
  $: tick().then(() => { info.currentSrc = currentSrc; });

  // If media is initialized or changed (audio/video/false).
  $: if (prevMedia !== media) {
    dispose();
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