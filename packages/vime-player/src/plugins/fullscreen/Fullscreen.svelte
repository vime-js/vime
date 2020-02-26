<script context="module">
  export const ID = 'vFullscreen';
</script>

<script>
  import { listen } from 'svelte/internal';
  import { onMount, onDestroy } from 'svelte';
  import fs from './FullscreenApi';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const rootEl = player.getEl();
  
  const {
    _isFullscreenSupported: isFullscreenSupported,
    isFullscreenEnabled, isFullscreenActive, errors
  } = player.getStore();

  // if rebuild can we reenter fullscreen??

  // also does the currentProvider support it? -> simple supports check??
  $isFullscreenSupported = !!(fs.requestFullscreen && document[fs.fullscreenEnabled]);
  onDestroy(() => { $isFullscreenSupported = false; });

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  // 'requestFullscreen',
  // 'exitFullscreen',

  // if ios & playsinline & provider.canPlayinline -> show controls, go native on fullscreen
  // else if ios & !playsinline ->  disable custom & go native?
  // hide controls if ios fullscreen

  // @see https://github.com/videojs/video.js/blob/master/src/js/player.js#L2722
  export const enter = async options => {
    // 1. can we go fullscreen using el -> includes video + controls
    // 2. can we go fullscreen using the provider -> native controls + setFullscreen
    // 3. fallback to viewport?
  };

  export const exit = async () => {
  };

  export const el = () => document[fs.fullscreenElement];

  $: isEnabled = $isFullscreenSupported && $isFullscreenEnabled;

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  let errorOff;
  let changeOff;
  let isEventsBound = false;

  const onChange = () => { $isFullscreenActive = !!el(); };
  const onError = e => { $errors = [...errors, e]; };

  const onBindEvents = () => {
    if (document[fs.fullscreenchange]) changeOff = listen(document, fs.fullscreenchange, onChange);
    if (document[fs.fullscreenerror]) errorOff = listen(document, fs.fullscreenerror);
    isEventsBound = true;
  };

  const onUnbindEvents = () => {
    changeOff && changeOff();
    errorOff && errorOff();
    changeOff = null;
    errorOff = null;
    isEventsBound = false;
  };

  onDestroy(onUnbindEvents);

  $: if (isEnabled && !isEventsBound) {
    onBindEvents();
  } else if (!isEnabled && isEventsBound) {
    onUnbindEvents();
  }

  $: if ((isEnabled && $isFullscreenActive) && !el()) {
    enter();
  } else if (el()) {
    exit();
  }
</script>