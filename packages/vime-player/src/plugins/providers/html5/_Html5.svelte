<!-- Common events between the media elements (audio/video) are setup in `setupMediaListeners` -->
{#if shouldUseAudio}
  <audio
    {controls}
    {crossorigin}
    bind:paused={paused}
    bind:this={audio}
  >
    <Source src={currentSrc} />
  </audio>
{:else if shouldUseVideo}
  <video
    {controls}
    {crossorigin}
    poster={!$hasPlaybackStarted ? poster : null}
    playsinline={playsinline}
    playsInline={playsinline}
    webkit-playsinline={playsinline}
    x5-playsinline={playsinline}
    bind:paused={paused}
    bind:this={video}
    on:enterpictureinpicture="{() => dispatch(ProviderEvent.PIP_CHANGE, true)}"
    on:leavepictureinpicture="{() => dispatch(ProviderEvent.PIP_CHANGE, false)}"
    on:webkitpresentationmodechanged={onPresentationModeChange}
  >
    <Source src={currentSrc} />
  </video>
{/if}

<script context="module">
  import { is_array, is_string, is_instance_of } from '~utils/unit';
  import { can_use_pip, can_play_hls_natively, can_autoplay } from '~utils/support';
  import PluginRole from '~core/PluginRole';

  export const ID = 'vHtml5';
  export const ROLE = PluginRole.PROVIDER;

  export const DEFAULT_CONFIG = {
    forceAudio: false,
    forceVideo: false
  };

  const AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
  const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i;
  const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;
  const DROPBOX_URL = /www\.dropbox\.com\/.+/;

  const extractSrcValue = src => {
    if (!src) return '';
    return is_array(src) ? (src[0].src || src[0]) : (src.src || src);
  };

  const isMediaStream = src => is_instance_of(src, window.MediaStream);
  const isQualitiesSet = src => is_array(src) && src.every(mediaResource => mediaResource.quality);
  const isAudio = src => AUDIO_EXTENSIONS.test(extractSrcValue(src));
  const isDropboxUrl = src => is_string(src) && DROPBOX_URL.test(src);
  const isVideo = src => VIDEO_EXTENSIONS.test(extractSrcValue(src)) ||
                         (can_play_hls_natively && HLS_EXTENSIONS.test(extractSrcValue(src)));

  const canPlayResource = resource => {
    if (isMediaStream(resource)) return true;
    if (!is_string(resource.src || resource)) return false;
    return isAudio(resource) || isVideo(resource);
  };

  // Extended checks are used by the Hls and Dash providers.
  export const canPlay = (src, extensionCanPlay = () => false) => is_array(src)
    ? src.some(resource => canPlayResource(resource) || extensionCanPlay(resource))
    : canPlayResource(src) || extensionCanPlay(src);
</script>

<script>
  import { listen } from 'svelte/internal';
  import { tick, onMount, onDestroy, createEventDispatcher } from 'svelte';
  import MediaType from '~core/MediaType';
  import ProviderEvent from '../ProviderEvent';
  import Source from './Source.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;
  export let config = DEFAULT_CONFIG;

  const dispatch = createEventDispatcher();
  const { isPlaybackReady, hasPlaybackStarted } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let video;
  let audio;
  let src;
  let prevMedia;
  let currentSrc;
  let paused;

  let quality;
  let poster;
  let playsinline;
  let crossorigin;
  let controls;
  
  $: media = audio || video;
  
  $: shouldUseAudio = config.forceAudio || (!poster && isAudio(src) && !config.forceVideo);
  $: shouldUseVideo = config.forceVideo ||
    (!config.forceAudio && (!!poster || isMediaStream(src) || isVideo(src)));

  // --------------------------------------------------------------
  // Media Events
  // --------------------------------------------------------------

  let dispose = [];
  const listenToMedia = (event, cb) => dispose.push(listen(media, event, cb));
  const setupMediaListeners = () => {
    listenToMedia('loadedmetadata', () => {
      onBuffered();
      $isPlaybackReady
        ? dispatch(ProviderEvent.REBUILD_END)
        : dispatch(ProviderEvent.PLAYBACK_READY);
    });
    listenToMedia('progress', onBuffered);
    listenToMedia('playing', () => {
      dispatch(ProviderEvent.PLAYING);
      dispatch(ProviderEvent.BUFFERING, false);
    });
    listenToMedia('ratechange', () => {
      dispatch(ProviderEvent.RATE_CHANGE, media.playbackRate);
    });
    listenToMedia('volumechange', () => {
      dispatch(ProviderEvent.MUTE_CHANGE, media.muted);
      dispatch(ProviderEvent.VOLUME_CHANGE, parseInt(media.volume * 100));
    });
    listenToMedia('pause', () => dispatch(ProviderEvent.PAUSE));
    listenToMedia('seeking', () => {
      dispatch(ProviderEvent.SEEKING);
      dispatch(ProviderEvent.BUFFERING, true);
    });
    listenToMedia('seeked', () => dispatch(ProviderEvent.BUFFERING, false));
    listenToMedia('waiting', () => dispatch(ProviderEvent.BUFFERING, true));
    listenToMedia('ended', () => dispatch(ProviderEvent.ENDED));
    listenToMedia('error', e => dispatch(ProviderEvent.ERROR, e));
  };

  const destroyMediaListeners = () => {
    dispose.forEach(dispose => dispose());
    dispose = [];
  };

  // If media is initialized or changed (audio/video/null).
  $: if (prevMedia !== media) {
    destroyMediaListeners();
    if (media) setupMediaListeners();
    prevMedia = media;
  }

  onDestroy(() => destroyMediaListeners());

  const onBuffered = () => {
    const buffered = media.buffered;
    const duration = media.duration;
    const end = (buffered.length === 0) ? 0 : buffered.end(buffered.length - 1);
    dispatch(ProviderEvent.BUFFERED, (end > duration) ? duration : end);
  };

  const onPresentationModeChange = e => {
    if (!can_use_pip) return;
    const mode = video.webkitPresentationMode;
    dispatch(ProviderEvent.PIP_CHANGE, (mode === 'picture-in-picture'));
  };

  // --------------------------------------------------------------
  // Load Media
  // --------------------------------------------------------------

  onMount(() => dispatch(ProviderEvent.PROVIDER_READY));

  export const rebuild = () => media.load();

  const loadMediaStream = async () => {
    currentSrc = null;
    await tick();
    try {
      media.srcObject = src;
    } catch (e) {
      media.src = window.URL.createObjectURL(src);
    }
  };

  const loadNewQuality = () => {
    quality = quality || src[0].quality;
    const newSrc = src.find(s => s.quality === quality);
    currentSrc = newSrc;
    dispatch(ProviderEvent.QUALITY_CHANGE, quality);
    rebuild();
  };

  const loadNewSrc = () => {
    const newSrc = isDropboxUrl(src)
      ? src.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
      : src;
    currentSrc = newSrc;
    rebuild();
  };

  export const loadMedia = async newSrc => {
    src = newSrc;
    // Wait for media to load.
    await tick();
    if (isMediaStream(src)) {
      loadMediaStream();
    } else if (isQualitiesSet(src)) {
      loadNewQuality();
    } else {
      loadNewSrc();
    }
  };

  // --------------------------------------------------------------
  // Getters
  // --------------------------------------------------------------

  export const getMediaType = async () => {
    await tick();
    if (shouldUseAudio) return MediaType.AUDIO;
    if (shouldUseVideo) return MediaType.VIDEO;
    return null;
  };

  export const getQualities = async () => {
    return isQualitiesSet(src) ? src.map(s => s.quality) : null;
  };

  export const getCurrentTime = async () => media.currentTime;
  export const getEl = async () => media;
  export const getInternalPlayer = async () => media;
  export const getDuration = async () => media.duration;
  export const getPlaybackRates = async () => [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
  export const supportsPiP = async () => can_use_pip;
  export const supportsFullscreen = async () => !!(media && media.webkitEnterFullscreen);

  // --------------------------------------------------------------
  // Setters
  // --------------------------------------------------------------

  export const setCurrentTime = newTime => { media.currentTime = newTime; };
  export const setMuted = isMuted => { media.muted = isMuted; };
  export const setPaused = isPaused => { isPaused ? media.pause() : media.play(); };
  export const setVolume = newVolume => { media.volume = (newVolume / 100); };
  export const setPlaybackRate = newPlaybackRate => { media.playbackRate = newPlaybackRate; };
  export const setCrossOrigin = newOrigin => { crossorigin = newOrigin; };
  export const setControls = isEnabled => { controls = isEnabled || null; };
  export const setPlaysinline = isEnabled => { playsinline = isEnabled || null; };
  
  export const setPoster = newPoster => {
    if (poster === newPoster) return;
    poster = newPoster || null;
    if (poster) dispatch(ProviderEvent.REBUILD);
  };
  
  export const setFullscreen = isActive => {
    isActive ? media.webkitEnterFullscreen() : media.webkitExitFullScreen();
  };

  export const setQuality = newQuality => {
    quality = newQuality;
    loadNewQuality();
  };

  export const setPiP = isActive => {
    if (isActive) media.requestPictureInPicture();
    if (!isActive && (document.pictureInPictureElement === media)) document.exitPictureInPicture();
  };
</script>