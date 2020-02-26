<div bind:this={target}></div>

<script context="module">
  import { is_string } from '~utils/unit';
  import { load_sdk } from '~utils/load';
  import PluginRole from '~core/PluginRole';

  const VIMEO_URL = /vimeo\.com\/.+/;
  const VIMEO_FILE_URL = /vimeo\.com\/external\/[0-9]+\..+/;
  const VIMEO_THUMBNAIL_URL = /vimeocdn\.com\/video\/([0-9]+)/;

  export const ID = 'vVimeo';
  export const ROLE = PluginRole.PROVIDER;

  export const DEFAULT_CONFIG = {
    options: {},
    pro: false
  };

  export const canPlay = src => is_string(src) && !VIMEO_FILE_URL.test(src) && VIMEO_URL.test(src);

  export const getSDK = () => load_sdk('https://player.vimeo.com/api/player.js', 'Vimeo');

  export const getPoster = src => window.fetch(`https://noembed.com/embed?url=${src}`)
    .then(response => response.json())
    .then(data => {
      const thumbnailId = data.thumbnail_url.match(VIMEO_THUMBNAIL_URL)[1];
      return `https://i.vimeocdn.com/video/${thumbnailId}_1920x1080.jpg?r=pad`;
    });
</script>

<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import MediaType from '~core/MediaType';
  import ProviderEvent from './ProviderEvent';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;
  export let config = DEFAULT_CONFIG;

  const logger = player.createLogger(ID);
  const dispatch = createEventDispatcher();
  const { playsinline } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let target;
  let vmPlayer;
  let hasPlayerLoaded = false;

  const loadPlayer = async src => {
    try {
      const Vimeo = await getSDK();

      vmPlayer = new Vimeo.Player(target, {
        url: src,
        playsinline: $playsinline,
        controls: false,
        ...config.options
      });

      vmPlayer.ready().then(() => {
        vmPlayer.disableTextTrack();
        hasPlayerLoaded = true;
      }).catch(() => {});

      vmPlayer.on('loaded', () => dispatch(ProviderEvent.PLAYBACK_READY));
      vmPlayer.on('play', () => dispatch(ProviderEvent.PLAYING));
      vmPlayer.on('ended', () => dispatch(ProviderEvent.ENDED));
      vmPlayer.on('seeked', () => dispatch(ProviderEvent.BUFFERING, false));
      vmPlayer.on('bufferstart', () => dispatch(ProviderEvent.BUFFERING, true));
      vmPlayer.on('bufferend', () => dispatch(ProviderEvent.BUFFERING, false));
      vmPlayer.on('progress', ({ seconds }) => dispatch(ProviderEvent.BUFFERED, seconds));
      vmPlayer.on('error', e => dispatch(ProviderEvent.ERROR, e));
    } catch (e) { dispatch(ProviderEvent.ERROR, e); }
  };

  export const loadMedia = newSrc => {
    if (!hasPlayerLoaded) {
      loadPlayer(newSrc);
      return;
    }

    vmPlayer.loadVideo(newSrc);
  };

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  // Dispatch ready immediately becasue Vimeo can't load without a src.
  onMount(() => { dispatch(ProviderEvent.PROVIDER_READY); });

  onDestroy(() => {
    if (vmPlayer) vmPlayer.destroy();
    vmPlayer = null;
  });

  // --------------------------------------------------------------
  // Getters
  // --------------------------------------------------------------

  export const getMediaType = async () => MediaType.VIDEO;
  export const getCurrentTime = async () => vmPlayer.getCurrentTime();
  export const getEl = async () => vmPlayer.element;
  export const getInternalPlayer = async () => vmPlayer;
  export const getDuration = async () => vmPlayer.getDuration();
  export const getQualities = async () => null;
  export const getPlaybackRates = async () => (config.pro ? [0.25, 0.5, 1, 1.5, 2] : null);
  export const isPiPSupported = async () => false;

  // --------------------------------------------------------------
  // Setters
  // --------------------------------------------------------------

  export const setCurrentTime = newTime => {
    vmPlayer.setCurrentTime(newTime);
    // This method is only called when seeking, so we call the buffering event since Vimeo doesn't
    // when the video is paused.
    if (vmPlayer.getPaused()) dispatch(ProviderEvent.BUFFERING, true);
  };

  export const setMuted = isMuted => { vmPlayer.setMuted(isMuted); };
  export const setPaused = isPaused => {
    isPaused ? vmPlayer.pause() : vmPlayer.play().catch(() => {});
  };
  export const setVolume = newVolume => { vmPlayer.setVolume(newVolume / 100); };

  export const setPlaybackRate = newPlaybackRate => {
    if (!config.pro) {
      logger.warn(
        'adjusting the playback rate is available only to members with a ' +
        'Vimeo PRO subscription or higher.'
      );
      return;
    }
    vmPlayer.setPlaybackRate(newPlaybackRate);
  };

  // export const setQuality = newQuality => {}
  // export const setPiP = isActive => {}
</script>