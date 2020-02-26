<div bind:this={target}></div>

<script context="module">
  import { is_string } from '~utils/unit';
  import { load_image, load_sdk } from '~utils/load';
  import PluginRole from '~core/PluginRole';
  
  // eslint-disable-next-line
  const YOUTUBE_URL = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/

  const YOUTUBE_QUALITY_MAP = {
    tiny: '144p',
    small: '240p',
    medium: '360p',
    large: '480p',
    hd720: '720p',
    hd1080: '1080p',
    highres: 'max'
  };

  export const ID = 'vYoutube';
  export const ROLE = PluginRole.PROVIDER;

  export const DEFAULT_CONFIG = {
    playerVars: {},
    embedOptions: {}
  };

  export const canPlay = src => is_string(src) && YOUTUBE_URL.test(src);

  export const getSDK = () => load_sdk(
    'https://www.youtube.com/iframe_api',
    'YT',
    'onYouTubeIframeAPIReady',
    YT => YT.loaded
  );

  // TODO: https://www.youtube.com/embed/live_stream?channel={videoID} -> add LiveStream to MediaType
  // TODO: you can set the locale of the youtube player (nativeMode && locale) -> hl param
  export const preconnect = () => {};

  export const getPoster = src => {
    const videoId = src.match(YOUTUBE_URL)[1];
    const posterSrc = quality => `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;

    // We are testing a that the image has a min-width of 121px because if the thumbnail does
    // not exist YouTube returns a blank/error image that is 120px wide.
    return load_image(posterSrc('maxresdefault'), 121) // 1080p (no padding)
      .catch(() => load_image(posterSrc('sddefault'), 121)) // 640p (padded 4:3)
      .catch(() => load_image(posterSrc('hqdefault'), 121)) // 480p (padded 4:3)
      .then(image => ({
        src: image.src,
        size: image.src.includes('maxres') ? 'contain' : 'cover'
      }));
  };
</script>

<script>
  import { tick, onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { parse_start_time, parse_end_time } from '~utils/url';
  import { ORIGIN } from '~utils/support';
  import MediaType from '~core/MediaType';
  import ProviderEvent from './ProviderEvent';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;
  export let config = DEFAULT_CONFIG;

  const logger = player.createLogger(ID);
  const dispatch = createEventDispatcher();
  
  const {
    canInteract, isPaused, isSeeking,
    hasPlaybackStarted, isPlaybackReady
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let YT;
  let target;
  let ytPlayer;

  let src;
  let videoId;
  let controls = 0;
  let playsinline = 0;
  let seekedTime = 0;
  let buffered = 0;
  
  let prevPlayerVars;
  let currentPlayerVars;

  const build = () => {
    ytPlayer = new YT.Player(target, {
      videoId,
      playerVars: currentPlayerVars,
      events: {
        onReady: e => {
          const event = $isPlaybackReady
            ? ProviderEvent.REBUILD_END
            : ProviderEvent.PLAYBACK_READY;
          dispatch(event);
        },
        onPlaybackRateChange: e => dispatch(ProviderEvent.RATE_CHANGE, e.data),
        onPlaybackQualityChange: e => {
          dispatch(ProviderEvent.QUALITY_CHANGE, YOUTUBE_QUALITY_MAP[e.data]);
        },
        // @see https://developers.google.com/youtube/iframe_api_reference#getPlayerState
        onStateChange: e => {
          const code = e.data;
          const state = window.YT.PlayerState;
          dispatch(ProviderEvent.BUFFERING, (code === state.BUFFERING));
          if (code === state.PAUSED) dispatch(ProviderEvent.PAUSE);
          if (code === state.PLAYING) dispatch(ProviderEvent.PLAYING);
          if (code === state.ENDED) dispatch(ProviderEvent.ENDED);
        },
        onError: e => dispatch(ProviderEvent.ERROR, e)
      },
      ...config.embedOptions
    }, e => dispatch(ProviderEvent.ERROR, e));
  };

  export const rebuild = () => {
    onDestroyPlayer();
    if (!videoId) {
      logger.warn(`failed to load \`src\` [${src}], could not extract video id.`);
      $isPlaybackReady && dispatch(ProviderEvent.REBUILD_END);
      return;
    }
    build();
  };

  export const loadMedia = newSrc => {
    src = newSrc;
    videoId = newSrc && newSrc.match(YOUTUBE_URL)[1];
    rebuild();
  };

  $: {
    const newVars = {
      controls,
      disablekb: !controls ? 1 : 0,
      rel: 0,
      fs: 1,
      enablejsapi: 1,
      playsinline,
      cc_load_policy: 0,
      iv_load_policy: 3,
      origin: ORIGIN,
      widget_referrer: window.location.href,
      start: src ? parse_start_time(src) : null,
      end: src ? parse_end_time(src) : null,
      ...config.playerVars
    };
    prevPlayerVars = currentPlayerVars || newVars;
    currentPlayerVars = newVars;
  }

  $: didPlayerVarsChange = Object.keys(currentPlayerVars)
    .some(key => prevPlayerVars[key] !== currentPlayerVars[key]);

  $: if (didPlayerVarsChange) {
    dispatch(ProviderEvent.REBUILD);
    didPlayerVarsChange = false;
  }

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onBuffered = () => {
    const newBuffered = ytPlayer.getVideoLoadedFraction() * ytPlayer.getDuration();
    if (newBuffered && buffered !== newBuffered) {
      buffered = newBuffered;
      dispatch(ProviderEvent.BUFFERED, buffered);
    }
  };

  const onSeek = newTime => {
    seekedTime = newTime;
    dispatch(ProviderEvent.BUFFERING, true);
  };

  const onDestroyPlayer = () => {
    if (ytPlayer) ytPlayer.destroy();
    ytPlayer = null;
  };

  onMount(async () => {
    try {
      YT = await getSDK();
      dispatch(ProviderEvent.PROVIDER_READY);
    } catch (e) { dispatch(ProviderEvent.ERROR, e); }
  });

  onDestroy(() => {
    onDestroyPlayer();
    YT = null;
  });

  // --------------------------------------------------------------
  // Tasks
  // --------------------------------------------------------------

  const scheduler = player.getScheduler();

  // TODO: Don't need this as there is a undocumented `onVolumeChange` event.
  const volumeTaskID = 'ytVolumeUpdate';
  scheduler.add(volumeTaskID, () => {
    dispatch(ProviderEvent.MUTE_CHANGE, ytPlayer.isMuted());
    dispatch(ProviderEvent.VOLUME_CHANGE, ytPlayer.getVolume());
  });
  $: scheduler.pause(volumeTaskID, !$canInteract || !$hasPlaybackStarted || !controls);

  const bufferedTaskID = 'ytBufferedUpdate';
  scheduler.add(bufferedTaskID, onBuffered);
  $: scheduler.pause(bufferedTaskID, !$canInteract || $isPaused);

  // TODO: this doesn't actually work, seeking is fired on seeked because YT doesn't have any
  // updates between.
  let prevTime = 0;
  const seekingTaskID = 'ytSeekingUpdate';
  scheduler.add(seekingTaskID, () => {
    const newTime = ytPlayer.getCurrentTime();
    if (Math.abs(newTime - prevTime) > 1) {
      onSeek(newTime);
      dispatch(ProviderEvent.SEEKING);
    }
    prevTime = newTime;
  });
  $: scheduler.pause(seekingTaskID, !$canInteract);

  const seekedTaskID = 'ytSeekedUpdate';
  scheduler.add(seekedTaskID, () => {
    onBuffered();
    if (seekedTime <= buffered) dispatch(ProviderEvent.BUFFERING, false);
  });
  $: scheduler.pause(seekedTaskID, !$canInteract || !$isSeeking);

  // --------------------------------------------------------------
  // Getters
  // --------------------------------------------------------------

  export const getMediaType = async () => MediaType.VIDEO;
  export const getCurrentTime = async () => ytPlayer.getCurrentTime();
  export const getEl = async () => ytPlayer.getIframe();
  export const getInternalPlayer = async () => ytPlayer;
  export const getDuration = async () => ytPlayer.getDuration();
  export const getQualities = async () => Object.values(YOUTUBE_QUALITY_MAP);
  export const getPlaybackRates = async () => ytPlayer.getAvailablePlaybackRates();

  // --------------------------------------------------------------
  // Setters
  // --------------------------------------------------------------

  export const setCurrentTime = newTime => {
    ytPlayer.seekTo(newTime);
    if ($isPaused) onSeek(newTime);
  };

  export const setPlaysinline = isEnabled => { playsinline = isEnabled ? 1 : 0; };
  export const setControls = isEnabled => { controls = isEnabled ? 1 : 0; };
  export const setMuted = isMuted => { isMuted ? ytPlayer.mute() : ytPlayer.unMute(); };
  export const setPaused = isPaused => { isPaused ? ytPlayer.pauseVideo() : ytPlayer.playVideo(); };
  export const setVolume = newVolume => { ytPlayer.setVolume(newVolume); };
  export const setPlaybackRate = newPlaybackRate => { ytPlayer.setPlaybackRate(newPlaybackRate); };
</script>