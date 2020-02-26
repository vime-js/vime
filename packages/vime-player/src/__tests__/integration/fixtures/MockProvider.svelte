<div></div>

<script context="module">
  import ProviderEvent from '~providers/ProviderEvent';

  export const canPlay = src => true;
  export const getPoster = src => Promise.resolve('image');
</script>

<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let config;
  export let playsinline;

  // Just to stop unused-export warning.
  $: if (config && playsinline) {}

  export const firePlayerReady = () => dispatch(ProviderEvent.PLAYER_READY);
  export const firePlaybackReady = () => dispatch(ProviderEvent.PLAYBACK_READY);
  export const fireBuffered = buffered => dispatch(ProviderEvent.BUFFERED, buffered);
  export const fireQualityChange = quality => dispatch(ProviderEvent.QUALITY_CHANGE, quality);
  export const fireBuffering = isBuffering => dispatch(ProviderEvent.BUFFERING, isBuffering);
  export const firePlaying = () => dispatch(ProviderEvent.PLAYING);
  export const fireEnded = () => dispatch(ProviderEvent.ENDED);
  export const fireError = e => dispatch(ProviderEvent.ERROR);

  export const loadMedia = newSrc => {};

  export const getMediaType = () => {};
  export const getCurrentTime = async () => {};
  export const getRef = async () => {};
  export const getInternalPlayer = async () => {};
  export const getDuration = async () => {};
  export const getQualities = async () => {};
  export const getPlaybackRates = async () => {};
  export const getPiPEnabled = async () => {};

  export const setCurrentTime = newTime => {};
  export const setMuted = isMuted => {};
  export const setPaused = isPaused => {};
  export const setVolume = newVolume => {};
  export const setPlaybackRate = newPlaybackRate => {};
  export const setPiP = isActive => {};
  export const setQuality = newQuality => {};
</script>