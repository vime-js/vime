<File
  {crossorigin}
  {player}
  forceVideo
  on:update
  on:error
  bind:this={fileProvider}
/>

<script context="module">
  import { is_hls } from '@vime-js/core/file';

  export const canPlay = is_hls;
</script>

<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import File from './file/File.svelte';
  import { load_library } from '@vime-js/utils';
  
  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const dispatch = createEventDispatcher();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------
  
  let hls;
  let fileProvider;
  let isHlsAttached = false;

  export let src = null;
  export let config = {};
  export let version = 'latest';
  export let crossorigin = null;

  export const getEl = () => fileProvider.getEl();
  export const getHls = () => hls;
  export const getMedia = () => fileProvider.getMedia();
  export const getFileProvider = () => fileProvider;

  export const setCurrentTime = (newTime) => { fileProvider.setCurrentTime(newTime); };
  export const setMuted = (isMuted) => { fileProvider.setMuted(isMuted); };
  export const setPaused = (isPaused) => { fileProvider.setPaused(isPaused); };
  export const setVolume = (newVolume) => { fileProvider.setVolume(newVolume); };
  export const setPlaybackRate = (newRate) => { fileProvider.setPlaybackRate(newRate); };
  export const setControls = (isEnabled) => { fileProvider.setControls(isEnabled); };
  export const setPlaysinline = (isEnabled) => { fileProvider.setPlaysinline(isEnabled); };
  export const setAspectRatio = (newRatio) => { fileProvider.setAspectRatio(newRatio); };
  export const setTracks = (newTracks) => { fileProvider.setTracks(newTracks); };
  export const setTrack = (newIndex) => { fileProvider.setTrack(newIndex); };
  export const setVideoQuality = (newVideoQuality) => {
    fileProvider.setVideoQuality(newVideoQuality);
  };

  // Can't reload when setting a poster because HLS deattaches from the player.
  export const setPoster = (newPoster) => fileProvider.setPoster(newPoster, false);

  export const supportsPiP = () => fileProvider.supportsPiP();
  export const setPiP = (isActive) => fileProvider.setPiP(isActive);

  export const setFullscreen = (isActive) => fileProvider.setFullscreen(isActive);
  export const supportsFullscreen = () => fileProvider.supportsFullscreen();
  
  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  onMount(async () => {
    try {
      const url = 'https://unpkg.com/hls.js@{V}/dist/hls.min.js'.replace('{V}', version);
      const Hls = await load_library(url, 'Hls');

      if (!Hls.isSupported()) {
        dispatch('error', Error('hls.js is not supported'));
        return;
      }

      hls = new Hls(config);
      hls.attachMedia(fileProvider.getMedia());
      hls.on(window.Hls.Events.MEDIA_ATTACHED, () => { isHlsAttached = true; });
      hls.on(window.Hls.Events.ERROR, (e, data) => { dispatch('error', { e, data }); });
    } catch (e) { dispatch('error', e); }
  });

  const onSrcChange = (newSrc) => {
    hls.loadSource(newSrc);
    dispatch('update', { currentSrc: src });
  };

  onDestroy(() => {
    if (hls) hls.destroy();
    hls = null;
  });

  $: if (isHlsAttached) onSrcChange(src);
</script>