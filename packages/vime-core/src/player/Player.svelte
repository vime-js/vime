<PlayerWrapper aspectRatio={$videoView ? $aspectRatio : null} >
  <svelte:component
    {...props}
    src={$src}
    srcId={$srcId}
    this={Provider}
    bind:this={provider}
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
    on:ratechange={onRateChange}
    on:qualitychange={onQualityChange}
    on:pipchange={onPiPChange}
    on:fullscreenchange={onFullscreenChange}
    on:posterchange={onPosterChange}
    on:srcchange={onSrcChange}
    on:titlechange={onTitleChange}
    on:mutechange={onMuteChange}
    on:volumechange={onVolumeChange}
    on:durationchange={onDurationChange}
    on:mediatypechange={onMediaTypeChange}
    on:qualitieschange={onQualitiesChange}
    on:rateschange={onRatesChange}
    on:originchange={onOriginChange}
  />
</PlayerWrapper>

<script>
  import { tick, createEventDispatcher, onDestroy, afterUpdate } from 'svelte';
  import { get } from 'svelte/store';
  import { get_current_component } from 'svelte/internal';
  import { currentPlayer } from './globalStore';
  import { bindPlayerStoreToComponent } from './playerStore';
  import PlayerEvent from './PlayerEvent';
  import PlayerWrapper from './PlayerWrapper.svelte';
  import {
    is_object, is_array, is_function,
    is_number, is_boolean, map_store_to_component
  } from '@vime/utils';

  let self = get_current_component();
  const dispatch = createEventDispatcher();
  
  onDestroy(() => { self = null; });

  const { store, resetStore, onPropsChange } = bindPlayerStoreToComponent();
  $: onPropsChange($$props);

  const {
    playsinline, paused, muted,
    ended, volume, seeking,
    internalTime, currentTime, nativeMode,
    pipActive, rate, quality,
    src, srcId, controls,
    supportsPiP, supportsFullscreen,
    canSetPiP, canSetFullscreen, fullscreenActive,
    canSetRate, canSetQuality, aspectRatio,
    buffering, canAutoplay, canMutedAutoplay,
    buffered, autopause, autoplay,
    playing, started, canSetPoster,
    poster, playbackReady, videoView
  } = store;

  let provider;
  let props = {};

  onDestroy(() => { props = {}; });

  export let Provider;

  export const getProvider = () => provider;

  // Filter out any player props before passing them to the provider.
  $: Object
    .keys($$props)
    .filter(prop => !store[prop] && (prop !== 'Provider'))
    .forEach(prop => (props[prop] = $$props[prop]));

  // --------------------------------------------------------------
  // Provider Events
  // --------------------------------------------------------------

  let rebuilding = false;

  // Avoid infinite loop.
  let updatingVolume = false;

  // Temporary states used to normalize player differences.
  let tempMute = false;
  let tempPlay = false;
  let tempPause = false;

  const cancelTempAction = async cb => {
    // Give some time for the provider to be set to it's original value before we receive
    // event updates.
    await tick();
    setTimeout(() => {
      cb();
    }, 100);
  };

  const initiateTempPlayback = () => {
    if (!$canMutedAutoplay) return;
    tempMute = true;
    tempPlay = true;
    $playsinline = true;
  };

  const onTimeUpdate = e => {
    if ($seeking || rebuilding) return;
    $internalTime = parseFloat(e.detail);
    $currentTime = parseFloat(e.detail);
    if ($internalTime === 0 && $ended) onRestart();
  };

  afterUpdate(() => {
    if (!provider || !$playbackReady || $seeking || ($currentTime === $internalTime)) return;
    $internalTime = $currentTime;
    provider.setCurrentTime($currentTime);
  });

  const onAutoplay = () => {
    if (!$autoplay || (!$canAutoplay || !$canMutedAutoplay)) return;
    $paused = false;
    $playsinline = true;
    if (!$canAutoplay) $muted = true;
  };

  const onPlaybackReady = async () => {
    // Wait a tick incase of any src changes.
    await tick();
    onAutoplay();
    $playbackReady = true;
    if (rebuilding) onRebuild();
  };

  const onRebuildStart = () => {
    rebuilding = true;
    dispatch(PlayerEvent.REBUILD_START);
  };

  const onRebuildEnd = () => {
    if (!rebuilding) return;
    rebuilding = false;
    dispatch(PlayerEvent.REBUILD_END);
  };

  const onRebuild = async () => {
    // Cancel any existing temp states as rebuild may be called multiple times.
    tempMute = false;
    tempPlay = false;
    await tick();
    if ($currentTime > 0 && $canMutedAutoplay) {
      if (!$autoplay) initiateTempPlayback();
      await tick();
      provider.setCurrentTime($currentTime);
      return;
    }
    onRebuildEnd();
  };

  const onAutopause = () => {
    if (!$autopause || !$currentPlayer || $currentPlayer === self) return;
    $currentPlayer.paused = true;
  };

  const onPlay = () => { if (nativeMode && !tempPlay) $paused = false; };

  // If a provider fires a `pause` event before `seeking` we cancel it to not mess
  // with our internal paused state.
  let firePauseTimer;
  const onPause = () => {
    if (rebuilding) return;
    console.log('pause');
    firePauseTimer = window.setTimeout(() => {
      if (nativeMode && !tempPause) $paused = true;
      if (!tempPause) $playing = false;
    }, 100);
  };

  const onSeeking = () => {
    if ($seeking || rebuilding) return;
    console.log('seeking');
    console.log($internalTime);
    window.clearTimeout(firePauseTimer);
    $seeking = true;
    !$started ? initiateTempPlayback() : (tempPause = true);
  };

  const onSeeked = async e => {
    if (!$seeking || rebuilding) return;
    // Wait a tick incase `seeking` and `seeked` are fired immediately after each other.
    await tick();
    console.log('seeked');
    $seeking = false;
    dispatch(PlayerEvent.SEEKED);
    cancelTempAction(() => {
      tempPause = false;
    });
    if (e && is_number(e.detail)) onTimeUpdate(e);
  };

  $: console.log('buffering', $buffering);

  const onPlaying = () => {
    console.log('playing');
    $buffering = false;
    $started = true;
    onSeeked();
    onAutopause();
    $currentPlayer = self;
    if ($nativeMode && !tempPlay) $paused = false;
    if (!tempPlay) $playing = true;
    provider.setPaused($paused);
    provider.setMuted($muted);
    cancelTempAction(() => {
      tempPlay = false;
      tempMute = false;
    });
    onRebuildEnd();
  };

  const onRestart = () => {
    if (get(store.live) || !$ended) return;
    $internalTime = 0;
    $currentTime = 0;
    $ended = false;
    provider.setCurrentTime(0);
    $paused = false;
    dispatch(PlayerEvent.REPLAY);
  };

  const onLoop = async () => {
    if (get(store.live) || !get(store.loop)) return;
    await tick();
    onRestart();
  };

  const onPlaybackEnd = e => {
    $ended = true;
    $paused = true;
    onLoop();
  };

  const onSrcChange = e => {
    const newSrc = e.detail;
    $srcId = is_object(newSrc) ? newSrc.id : null;
    $src = is_object(newSrc) ? newSrc.src : newSrc;
  };

  const onProviderReady = () => {
    store.ready.set(true);
    if (!srcId && !src) { rebuilding = false; }
  };

  const onBuffered = e => { $buffered = parseFloat(e.detail); };
  const onBuffering = e => { $buffering = is_boolean(e.detail) ? e.detail : true; };
  const onTitleChange = e => { store.title.set(e.detail); };
  const onLive = e => { store.live.set(e.detail); };
  const onQualitiesChange = e => { store.qualities.set(e.detail); };
  const onRatesChange = e => { store.rates.set(e.detail); };
  const onOriginChange = e => { store.origin.set(e.detail); };
  const onDurationChange = e => { if (!rebuilding) store.duration.set(parseFloat(e.detail)); };
  const onPiPChange = e => { if (!rebuilding) $pipActive = e.detail; };
  const onFullscreenChange = e => { if (!rebuilding) $fullscreenActive = e.detail; };
  const onMediaTypeChange = e => { if (!rebuilding) store.mediaType.set(e.detail); };
  const onRateChange = e => { if (!rebuilding) store.rate.forceSet(parseFloat(e.detail)); };
  const onPosterChange = e => { if (!rebuilding) store.poster.forceSet(e.detail); };
  const onQualityChange = e => { if (!rebuilding) store.quality.forceSet(e.detail); };
  const onMuteChange = e => { if ($nativeMode && !tempMute && !rebuilding) $muted = e.detail; };
  
  const onVolumeChange = e => {
    if (!$nativeMode || rebuilding) return;
    $volume = parseInt(e.detail);
    updatingVolume = true;
  };

  const onSrcReset = () => {
    resetStore();
    rebuilding = false;
  };

  const onProviderChange = () => {
    onSrcReset();
    store.ready.set(false);
    store.origin.set(null);
  };

  $: onProviderChange(Provider);
  $: onSrcReset($src);

  // --------------------------------------------------------------
  // Support
  // --------------------------------------------------------------

  // TODO: implement this.
  // @see https://github.com/videojs/video.js/blob/master/src/js/player.js#L2722
  // only video
  // const checkFullscreenSupport = () => {
  // }
  
  $: $supportsPiP = provider && provider.supportsPiP();
  $: $supportsFullscreen = provider && provider.supportsFullscreen();
  
  $: $canSetPiP = $supportsPiP && is_function(provider.setPiP);
  $: $canSetFullscreen = $supportsFullscreen && is_function(provider.setFullscreen);
  $: $canSetRate = provider && $playbackReady && is_function(provider.setRate);
  $: $canSetQuality = provider && is_function(provider.setQuality);
  $: $canSetPoster = provider && is_function(provider.setPoster);

  // --------------------------------------------------------------
  // State Updates
  // --------------------------------------------------------------

  $: if (provider && !$paused && $ended) onRestart();
  $: if (provider && !rebuilding) provider.setMuted($muted || tempMute);
  $: if (provider) provider.setPlaysinline($playsinline);
  $: if (provider) provider.setControls($nativeMode && $controls);
  $: if (provider) provider.setNativeMode($nativeMode);
  
  $: if (provider && $playbackReady) {
    provider.setPaused(($paused || tempPause) && !tempPlay);
  } else {
    $paused = true;
  }
  
  $: (provider && !rebuilding && !updatingVolume && $playbackReady)
    ? provider.setVolume($volume)
    : (updatingVolume = false);

  $: $canSetPiP && !rebuilding && provider.setPiP($pipActive);
  $: $canSetFullscreen && !rebuilding && provider.setFullscreen($fullscreenActive);
  $: $canSetPoster && provider.setPoster($poster);
  $: $canSetRate && !rebuilding && provider.setRate($rate);
  $: $canSetQuality && rebuilding && provider.setQuality($quality);
</script>