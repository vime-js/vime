<svelte:options accessors />

<PlayerWrapper 
  aspectRatio={$videoView ? $aspectRatio : null}
  on:mount="{e => { playerWrapper = e.detail; }}"
>
  <svelte:component
    src={$src}
    aspectRatio={$aspectRatio}
    this={Provider}
    bind:this={$provider}
    on:error
    on:ready={onProviderReady}
    on:playbackready={onPlaybackReady}
    on:play={onPlay}
    on:pause={onPause}
    on:playing={onPlaying}
    on:live={onLive}
    on:timeupdate={onTimeUpdate}
    on:playbackend={onPlaybackEnd}
    on:buffered={onBuffered}
    on:buffering={onBuffering}
    on:seeking={onSeeking}
    on:seeked={onSeeked}
    on:rebuildstart={onRebuildStart}
    on:playbackratechange={onPlaybackRateChange}
    on:videoqualitychange={onVideoQualityChange}
    on:pipchange={onPiPChange}
    on:fullscreenchange={onProviderFullscreenChange}
    on:posterchange={onPosterChange}
    on:srcidchange={onSrcIdChange}
    on:currentsrcchange={onCurrentSrcChange}
    on:titlechange={onTitleChange}
    on:mutechange={onMuteChange}
    on:volumechange={onVolumeChange}
    on:durationchange={onDurationChange}
    on:mediatypechange={onMediaTypeChange}
    on:videoqualitieschange={onVideoQualitiesChange}
    on:playbackrateschange={onPlaybackRatesChange}
    on:originchange={onOriginChange}
    on:trackschange={onTracksChange}
    on:trackchange={onTrackChange}
    on:cuechange={onCueChange}
  />
</PlayerWrapper>

<script>
  import { tick, createEventDispatcher, onMount, onDestroy, afterUpdate } from 'svelte';
  import { get } from 'svelte/store';
  import { noop, listen, get_current_component } from 'svelte/internal';
  import { currentPlayer } from './globalStore';
  import { mapPlayerStoreToComponent } from './playerStore';
  import MediaType from './MediaType';
  import PlayerEvent from './PlayerEvent';
  import PlayerWrapper from './PlayerWrapper.svelte';
  import {
    is_array, is_function, is_number, 
    is_boolean, map_store_to_component, deferred
  } from '@vime/utils';

  let self = get_current_component();
  const dispatch = createEventDispatcher();
  
  onDestroy(() => { self = null; });

  let { store, resetStore, onPropsChange } = mapPlayerStoreToComponent();
  $: onPropsChange($$props);

  const {
    playsinline, paused, muted,
    playbackEnded, volume, seeking,
    internalTime, currentTime, nativeMode,
    pipActive, playbackRate, videoQuality,
    src, controlsEnabled, aspectRatio, 
    buffering, buffered, autopause, 
    autoplay, playing, playbackStarted, 
    poster, playbackReady, videoView, 
    currentSrc, tracks, currentTrack, 
    provider, rebuilding, videoReady, 
    canInteract, video,
  } = store;

  const {
    canSetPiP, fullscreenActive, canSetTracks, 
    canSetTrack, canSetPoster, canSetPlaybackRate, 
    canSetVideoQuality, canAutoplay, canMutedAutoplay
  } = store;

  let props = {};
  let playerWrapper;

  export let Provider;

  // TODO: wait for next Svelte release because it's bugged right now.
  // Filter out any player props before passing them to the provider.
  $: Object
    .keys($$props)
    .filter(prop => !store[prop] && (prop !== 'Provider'))
    .forEach(prop => (props[prop] = $$props[prop]));

  onDestroy(() => { 
    props = {};
    store = {};
    playerWrapper = null;
    Provider = null;
    resetStore = noop;
    onPropsChange = noop;
  });

  // --------------------------------------------------------------
  // Provider Events
  // --------------------------------------------------------------

  // Avoid infinite loop.
  let updatingVolume = false;

  // Temporary states used to normalize player differences.
  let tempMute = false;
  let tempPlay = false;
  let tempPause = false;
  let tempControls = false;

  const cancelTempAction = async cb => {
    // Give some time for the provider to be set to it's original value before we receive
    // event updates.
    await tick();
    setTimeout(() => {
      cb();
    }, 100);
  };

  const initiateTempPlayback = () => {
    if (!$playbackReady || !$canMutedAutoplay) return;
    tempMute = true;
    tempPlay = true;
    $playsinline = true;
  };

  const onTimeUpdate = e => {
    if ($seeking || !$canInteract) return;
    $internalTime = parseFloat(e.detail);
    $currentTime = parseFloat(e.detail);
    if ($internalTime === 0 && $playbackEnded) onRestart();
  };

  afterUpdate(() => {
    if (!$playbackReady || $seeking || ($currentTime === $internalTime)) return;
    $internalTime = $currentTime;
    $provider.setCurrentTime($currentTime);
  });

  const onAutoplay = () => {
    if (!$autoplay || (!$canAutoplay || !$canMutedAutoplay)) return;
    $paused = false;
    $playsinline = true;
    if (!$canAutoplay) $muted = true;
  };

  const onRebuildStart = () => {
    if (!$playbackReady) return;
    $rebuilding = true;
    $buffering = true;
  };

  const onRebuild = async () => {
    if (!$canInteract) return;
    // Cancel any existing temp states as rebuild may be called multiple times.
    tempMute = false;
    tempPlay = false;
    await tick();
    if ($currentTime > 0 && $canMutedAutoplay) {
      if (!$autoplay) initiateTempPlayback();
      await tick();
      $provider.setCurrentTime($currentTime);
      return;
    }
    onRebuildEnd();
  };

  const onRebuildEnd = () => {
    if (!$canInteract) return;
    $rebuilding = false;
    if ($fullscreenActive) requestFullscreen().catch(noop);
  };

  const onPlaybackReady = async () => {
    // Wait a tick incase of any src changes.
    await tick();
    onAutoplay();
    $playbackReady = true;
    $buffering = false;
    onRebuild();
  };

  const onAutopause = () => {
    if (!$autopause || !$currentPlayer || $currentPlayer === self) return;
    $currentPlayer.paused = true;
  };

  const onPlay = () => { if (!$rebuilding && $nativeMode && !tempPlay) $paused = false; };

  // If a provider fires a `pause` event before `seeking` we cancel it to not mess
  // with our internal paused state.
  let firePauseTimer;
  const onPause = () => {
    if ($rebuilding) return;
    firePauseTimer = window.setTimeout(() => {
      if ($nativeMode && !tempPause) $paused = true;
      if (!tempPause) $playing = false;
    }, 100);
  };

  const onSeeking = () => {
    if ($seeking || $rebuilding) return;
    window.clearTimeout(firePauseTimer);
    $seeking = true;
    !$playbackStarted ? initiateTempPlayback() : (tempPause = true);
  };

  const onSeeked = async e => {
    if (!$seeking || $rebuilding) return;
    // Wait incase `seeking` and `seeked` are fired immediately after each other.
    await tick();
    $seeking = false;
    dispatch(PlayerEvent.SEEKED);
    cancelTempAction(() => {
      tempPause = false;
    });
    if (e && is_number(e.detail)) onTimeUpdate(e);
  };

  const onPlaying = () => {
    if (!$playbackReady) return;
    $buffering = false;
    $playbackStarted = true;
    onSeeked();
    onAutopause();
    $currentPlayer = self;
    if ($nativeMode && !tempPlay) $paused = false;
    if (!tempPlay) $playing = true;
    $provider.setPaused($paused);
    $provider.setMuted($muted);
    cancelTempAction(() => {
      tempPlay = false;
      tempMute = false;
    });
    onRebuildEnd();
  };

  const onRestart = () => {
    if (get(store.live) || !$playbackEnded) return;
    $internalTime = 0;
    $currentTime = 0;
    $playbackEnded = false;
    $provider.setCurrentTime(0);
    $paused = false;
    dispatch(PlayerEvent.REPLAY);
  };

  const onLoop = async () => {
    if (get(store.live) || !get(store.loop)) return;
    await tick();
    onRestart();
  };

  const onPlaybackEnd = e => {
    $playbackEnded = true;
    $paused = true;
    onLoop();
  };

  const onProviderReady = () => { store.ready.set(true); };
  const onPosterChange = e => { $poster = e.detail; };
  const onSrcIdChange = e => { store.srcId.set(e.detail); };
  const onCurrentSrcChange = e => { if (!$rebuilding) $currentSrc = e.detail; };
  const onMediaTypeChange = e => { store.mediaType.set(parseInt(e.detail)); };
  const onBuffered = e => { if (!$rebuilding) $buffered = parseFloat(e.detail); };
  const onBuffering = e => { if (!$rebuilding) $buffering = is_boolean(e.detail) ? e.detail : true; };
  const onTitleChange = e => { if (!$rebuilding) store.title.set(e.detail); };
  const onLive = e => { if (!$rebuilding) store.live.set(e.detail); };
  const onVideoQualitiesChange = e => { if (!$rebuilding) store.videoQualities.set(e.detail); };
  const onPlaybackRatesChange = e => { if (!$rebuilding) store.playbackRates.set(e.detail); };
  const onOriginChange = e => { if (!$rebuilding) store.origin.set(e.detail); };
  const onDurationChange = e => { if (!$rebuilding) store.duration.set(parseFloat(e.detail)); };
  const onPlaybackRateChange = e => { if (!$rebuilding) store.playbackRate.forceSet(parseFloat(e.detail)); };
  const onVideoQualityChange = e => { if (!$rebuilding) store.videoQuality.forceSet(e.detail || null); };
  const onMuteChange = e => { if (!$rebuilding && !tempMute) $muted = e.detail; };
  const onTrackChange = e => { if (!$rebuilding) store.currentTrack.set(e.detail); };
  const onTracksChange = e => { if (!$rebuilding) $tracks = e.detail; };
  const onCueChange = e => { if (!$rebuilding) store.activeCues.set(e.detail); };

  const onVolumeChange = e => {
    if ($rebuilding) return;
    $volume = parseInt(e.detail);
    updatingVolume = true;
  };

  const onSrcReset = () => {
    resetStore();
    // TODO: what if provider can't play the src? Need to stop buffering.
    if ($src && Provider) $buffering = true;
  };

  const onProviderChange = () => {
    onSrcReset();
    store.ready.set(false);
    store.origin.set(null);
    store.pipActive.set(false);
    if ($fullscreenActive) exitFullscreen().catch(noop);
    if (!Provider) store.mediaType.set(MediaType.NONE);
  };

  $: onSrcReset($src);
  $: onProviderChange(Provider);

  // --------------------------------------------------------------
  // State Updates
  // --------------------------------------------------------------

  $: if ($provider && !$rebuilding) $provider.setPlaysinline($playsinline);
  $: if ($provider && !$rebuilding) $provider.setControls(($nativeMode && $controlsEnabled) || tempControls);
  $: if ($provider && !$rebuilding) $provider.setNativeMode($nativeMode);
  $: if ($canSetPoster && !$rebuilding) $provider.setPoster($poster);
  
  $: if ($provider && !$paused && $playbackEnded) onRestart();
  $: if ($provider && $playbackReady) $provider.setPaused(($paused || tempPause) && !tempPlay);
  $: if ($provider && $canInteract) $provider.setMuted($muted || tempMute);
  $: if ($canSetPlaybackRate && $canInteract) $provider.setPlaybackRate($playbackRate);
  $: if ($canSetVideoQuality && $canInteract) $provider.setVideoQuality($videoQuality);

  $: ($provider && $canInteract && !updatingVolume)
    ? $provider.setVolume($volume)
    : (updatingVolume = false);
  
  // --------------------------------------------------------------
  // Tracks
  // --------------------------------------------------------------
  
  $: if ($canSetTracks && $canInteract) $provider.setTracks($nativeMode ? $tracks : []);
  $: if ($canSetTrack && $canInteract) $provider.setTrack($nativeMode ? $currentTrack : -1);
  $: if ($tracks.length === 0 || $currentTrack === -1 || !$nativeMode) store.activeCues.set([]);
 
  // --------------------------------------------------------------
  // Picture in Picture
  // --------------------------------------------------------------

  const NO_PIP_SUPPORT_ERROR_MSG = 'Provider does not support PiP.';
  const VIDEO_NOT_READY_ERROR_MSG = 'Action not supported, must be a video that is ready for playback.';
  
  const onPiPChange = e => { if (!$rebuilding) $pipActive = e.detail; };

  const pipRequest = active => {
    if (!$videoReady) {
      return Promise.reject(VIDEO_NOT_READY_ERROR_MSG);
    } else if (!$canSetPiP) {
      return Promise.reject(NO_PIP_SUPPORT_ERROR_MSG);
    } else {
      return Promise.resolve($provider.setPiP(active));
    }
  };

  export const requestPiP = () => pipRequest(true);
  export const exitPiP = () => pipRequest(false);

  // --------------------------------------------------------------
  // Fullscreen
  // --------------------------------------------------------------

  import FullscreenApi from './FullscreenApi';

  const FULLSCREEN_NOT_SUPPORTED_ERROR_MSG = 'Fullscreen not supported.';
  const FULLSCREEN_DOC_SUPPORT = !!FullscreenApi.requestFullscreen;

  let fsChangeListener = null;

  export let fullscreenEl = null;

  const isFullscreen = () => {
    const els = [playerWrapper, fullscreenEl, $provider && $provider.getEl()].filter(Boolean);
    let active = els.includes(document[FullscreenApi.fullscreenElement]);
    if (!active) active = els.some(el => el.matches && el.matches(':' + FullscreenApi.fullscreen));
    return active;
  };

  const onDocumentFullscreenChange = () => {
    const active = isFullscreen();
    $fullscreenActive = active;
  };

  const onProviderFullscreenChange = e => { 
    if (!$rebuilding) $fullscreenActive = (e.detail == 'true');
    if (!$fullscreenActive) tempControls = false;
  };

  const requestDocumentFullscreen = active => {
    const el = fullscreenEl || playerWrapper;
    if (!el) return Promise.reject();
    if (active === isFullscreen()) return Promise.resolve();
    return active ? el[FullscreenApi.requestFullscreen]() : document[FullscreenApi.exitFullscreen]();
  };

  const requestProviderFullscreen = active => {
    if (active) tempControls = true;
    return Promise.resolve($provider.setFullscreen(active));
  };

  const fullscreenRequest = active => {
    if (!$videoReady) {
      return Promise.reject(VIDEO_NOT_READY_ERROR_MSG);
    } else if (FULLSCREEN_DOC_SUPPORT) {
      return requestDocumentFullscreen(active);
    } else if (canProviderFullscreen) {
      return requestProviderFullscreen(active);
    }
    return Promise.reject(FULLSCREEN_NOT_SUPPORTED_ERROR_MSG);
  };

  export const requestFullscreen = () => fullscreenRequest(true);
  export const exitFullscreen = () => fullscreenRequest(false);

  onMount(() => {
    if (!FULLSCREEN_DOC_SUPPORT) return;
    fsChangeListener = listen(document, FullscreenApi.fullscreenchange, onDocumentFullscreenChange);
  });
  
  onDestroy(() => {
    fsChangeListener && fsChangeListener();
    fsChangeListener = null;
  });

  $: canProviderFullscreen = $provider && $provider.supportsFullscreen() && is_function($provider.setFullscreen);
  $: store.canSetFullscreen.set($videoReady && (FULLSCREEN_DOC_SUPPORT || canProviderFullscreen));
</script>