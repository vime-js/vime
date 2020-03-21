<svelte:options accessors />

<PlayerWrapper
  hasParent={!!parentEl}
  aspectRatio={($isVideoView && !$isFullscreenActive) ? $aspectRatio : null}
  on:mount="{(e) => { playerWrapper = e.detail; }}"
>
  <svelte:component
    {...props}
    src={$src}
    this={Provider}
    bind:this={$provider}
    on:update={onUpdate}
    on:error
  />
</PlayerWrapper>

<script>
  import { get } from 'svelte/store';
  import { noop, listen, get_current_component } from 'svelte/internal';
  import { currentPlayer } from './sharedStore';
  import { mapPlayerStoreToComponent } from './playerStore';
  import MediaType from './MediaType';
  import PlayerState from './PlayerState';
  import PlayerWrapper from './PlayerWrapper.svelte';

  import {
    tick, onMount, onDestroy,
    afterUpdate,
  } from 'svelte';

  import {
    is_function, is_number, is_boolean,
    is_null,
  } from '@vime-js/utils';

  let self = get_current_component();

  let { store, resetStore, onPropsChange } = mapPlayerStoreToComponent(self);
  $: onPropsChange($$props);

  const {
    playsinline, paused, muted,
    playbackEnded, volume, seeking,
    internalTime, currentTime, isPiPActive,
    playbackRate, videoQuality, src,
    isControlsEnabled, aspectRatio, buffering,
    buffered, autopause, autoplay,
    playing, playbackStarted, poster,
    playbackReady, isVideoView, tracks,
    currentTrackIndex, provider, rebuilding,
    isVideoReady, canInteract, isFullscreenActive,
    useNativeView, useNativeControls, useNativeCaptions,
    duration,
  } = store;

  const {
    canSetPiP, canSetTracks, canSetTrack,
    canAutoplay, canMutedAutoplay, canSetPoster,
    canSetPlaybackRate, canSetVideoQuality,
  } = store;

  let props = {};
  let playerWrapper;

  export let Provider = null;
  export let parentEl = null;

  // TODO: replace this with $$rest when released.
  const filteredProps = Object.keys({ Provider, parentEl });

  // Filter out any player props before passing them to the provider.
  $: Object
    .keys($$props)
    .filter((prop) => !store[prop] && !filteredProps.includes(prop))
    .forEach((prop) => { (props[prop] = $$props[prop]); });

  onDestroy(() => {
    props = {};
    store = {};
    playerWrapper = null;
    Provider = null;
    resetStore = noop;
    onPropsChange = noop;
    if ($currentPlayer === self) $currentPlayer = null;
    self = null;
  });

  $: if (!$currentPlayer) $currentPlayer = self;

  // --------------------------------------------------------------
  // Provider Events
  // --------------------------------------------------------------

  // Temporary states used to normalize player differences.
  let tempMute = false;
  let tempPlay = false;
  let tempPause = false;
  let tempControls = false;
  let updatingVolume = false;
  let updatingTime = false;

  const cancelTempAction = async (cb) => {
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

  const onRestart = () => {
    if (get(store.live) || !$playbackEnded) return;
    $internalTime = 0;
    $currentTime = 0;
    $playbackEnded = false;
    $provider.setCurrentTime(0);
    $paused = false;
  };

  const onTimeUpdate = (time) => {
    if ($seeking || updatingTime || !$canInteract) return;
    $internalTime = time;
    $currentTime = time;
    if ($internalTime === 0 && $playbackEnded) onRestart();
  };

  afterUpdate(() => {
    if (!$playbackReady || $seeking || ($currentTime === $internalTime)) return;
    $internalTime = $currentTime;
    $provider.setCurrentTime($currentTime);
    updatingTime = true;
  });

  const checkIfBuffering = () => {
    if ($buffered < $currentTime || ($playbackStarted && $buffered === 0)) {
      $buffering = true;
    }
  };

  const checkHasSeeked = () => {
    if (!$seeking || ($buffered <= $currentTime && $currentTime < $duration)) return;
    $seeking = false;
    $buffering = false;
    updatingTime = false;
    if (!$playbackStarted) {
      $playbackStarted = true;
      if ($currentTime === $duration) $currentTime = 0;
    }
    if ($playbackEnded) $playbackEnded = false;
    cancelTempAction(() => {
      tempPause = false;
    });
  };

  const onAutoplay = () => {
    if (
      !$autoplay
      || $rebuilding
      || $currentTime > 0
      || (!$canAutoplay || !$canMutedAutoplay)
    ) return;
    $paused = false;
    $playsinline = true;
    if (!$canAutoplay) $muted = true;
  };

  const onRebuildStart = () => {
    if (!$playbackReady) return;
    $rebuilding = true;
    $buffering = true;
  };

  const onRebuildEnd = async () => {
    if (!$playbackReady || !$rebuilding) return;
    if ($currentTime > 0) $provider.setCurrentTime($currentTime);
    await tick();
    $rebuilding = false;
    // eslint-disable-next-line no-use-before-define
    if ($isFullscreenActive) requestFullscreen().catch(noop);
  };

  const onRebuild = async () => {
    if (!$playbackReady) return;
    // Cancel any existing temp states as rebuild may be called multiple times.
    tempMute = false;
    tempPlay = false;
    await tick();
    if ($currentTime > 0 && $canMutedAutoplay) {
      initiateTempPlayback();
      return;
    }
    onRebuildEnd();
  };

  const onPlaybackReady = async () => {
    // Wait a tick incase of any src changes.
    await tick();
    $playbackReady = true;
    $buffering = false;
    onRebuild();
  };

  const onAutopause = () => {
    if (!$autopause || !$currentPlayer || $currentPlayer === self) return;
    $currentPlayer.paused = true;
  };

  // If a provider fires a `pause` event before `seeking` we cancel it to not mess
  // with our internal paused state.
  let firePauseTimer;
  const onPause = () => {
    firePauseTimer = window.setTimeout(() => {
      if ($useNativeControls && !tempPause) {
        $paused = true;
        $buffering = false;
      }
      if (!tempPause) $playing = false;
    }, 100);
  };

  const onVolumeChange = (newVolume) => {
    $volume = newVolume;
    updatingVolume = true;
  };

  const onBuffered = (progress) => {
    if (progress) $buffered = progress;
    if ($seeking) checkHasSeeked();
  };

  const onSeeking = () => {
    if ($seeking) return;
    window.clearTimeout(firePauseTimer);
    $seeking = true;
    checkIfBuffering();
    !$playbackStarted ? initiateTempPlayback() : (tempPause = true);
  };

  const onSeeked = async () => {
    if (!$seeking) return;
    // Wait incase `seeking` and `seeked` are fired immediately after each other.
    await tick();
    onBuffered($buffered);
  };

  const onPlay = () => {
    $paused = false;
    checkIfBuffering();
  };

  const onPlaying = () => {
    $buffering = false;
    $playbackStarted = true;
    onSeeked();
    onAutopause();
    $currentPlayer = self;
    if ($useNativeControls && !tempPlay) $paused = false;
    if (!tempPlay) $playing = true;
    $provider.setPaused($paused);
    $provider.setMuted($muted);
    cancelTempAction(() => {
      tempPlay = false;
      tempMute = false;
    });
    onRebuildEnd();
  };

  const onLoop = async () => {
    if (get(store.live) || !get(store.loop)) return;
    await tick();
    onRestart();
  };

  const onPlaybackEnd = () => {
    $playbackEnded = true;
    $paused = true;
    onLoop();
  };

  const onStateChange = async (state) => {
    await tick();
    switch (state) {
      case PlayerState.CUED:
        onPlaybackReady();
        break;
      case PlayerState.PAUSED:
        if ($rebuilding) return;
        onPause();
        break;
      case PlayerState.BUFFERING:
        $buffering = true;
        break;
      case PlayerState.PLAYING:
        onPlaying();
        break;
      case PlayerState.ENDED:
        onPlaybackEnd();
        break;
      default:
        break;
    }
  };

  // TODO: this is basically a crappy reducer.
  const onUpdate = (e) => {
    const info = e.detail;
    if (info.state) onStateChange(info.state);
    if (info.play && $useNativeControls && !tempPlay) onPlay();
    if (info.rebuild) onRebuildStart();
    if ($rebuilding) return;
    if ((is_null(info.poster) || info.poster)) store.nativePoster.set(info.poster);
    if (is_number(info.duration)) $duration = parseFloat(info.duration);
    if (is_number(info.currentTime)) onTimeUpdate(parseFloat(info.currentTime));
    if (is_number(info.buffered)) onBuffered(parseFloat(info.buffered));
    if (info.seeking) onSeeking();
    if (info.seeked) onSeeked();
    if (is_number(info.mediaType)) store.mediaType.set(info.mediaType);
    if (info.title) store.title.set(info.title);
    if (info.currentSrc) store.currentSrc.set(info.currentSrc);
    if (info.srcId) store.srcId.set(info.srcId);
    if (is_number(info.volume)) onVolumeChange(parseInt(info.volume, 10));
    if (is_boolean(info.muted) && !tempMute) $muted = info.muted;
    if (info.origin) store.origin.set(info.origin);
    if (is_null(info.videoQuality) || info.videoQuality) {
      store.videoQuality.forceSet(info.videoQuality);
    }
    if (info.videoQualities) store.videoQualities.set(info.videoQualities);
    if (info.playbackRate) store.playbackRate.forceSet(info.playbackRate);
    if (info.playbackRates) store.playbackRates.set(info.playbackRates);
    if ($useNativeCaptions) {
      if (info.tracks) $tracks = info.tracks;
      if (is_number(info.currentTrackIndex)) $currentTrackIndex = info.currentTrackIndex;
    }
    if (is_boolean(info.pip)) $isPiPActive = info.pip;
    // eslint-disable-next-line no-use-before-define
    if (is_boolean(info.fullscreen)) onFullscreenChange(info.fullscreen);
  };

  const onSrcChange = () => {
    resetStore();
    // TODO: what if provider can't play the src? Need to stop buffering.
    if ($src && Provider) $buffering = true;
    updatingTime = false;
    tempPlay = false;
    tempPlay = false;
    tempMute = false;
    tempControls = false;
  };

  const onProviderChange = () => {
    onSrcChange();
    store.origin.set(null);
    store.isPiPActive.set(false);
    // eslint-disable-next-line no-use-before-define
    if ($isFullscreenActive) exitFullscreen().catch(noop);
    if (!Provider) store.mediaType.set(MediaType.NONE);
  };

  $: onSrcChange($src);
  $: onProviderChange(Provider);

  // --------------------------------------------------------------
  // State Updates
  // --------------------------------------------------------------

  $: if ($autoplay && $playbackReady) onAutoplay();
  $: if ($provider && !$rebuilding) $provider.setPlaysinline($playsinline);
  $: if ($canSetPoster && !$rebuilding) $provider.setPoster($poster);
  $: if ($provider && is_function($provider.setAspectRatio)) $provider.setAspectRatio($aspectRatio);
  
  $: if ($provider && !$rebuilding && is_function($provider.setView)) {
    $provider.setView($useNativeView);
  }
  
  $: if ($provider && !$rebuilding) {
    $provider.setControls($isControlsEnabled && ($useNativeControls || tempControls));
  }
  
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

  $: if ($canSetTracks && $canInteract) $provider.setTracks($useNativeCaptions ? $tracks : []);
  
  $: if ($canSetTrack && $canInteract) {
    $provider.setTrack($useNativeCaptions ? $currentTrackIndex : -1);
  }

  // --------------------------------------------------------------
  // Picture in Picture
  // --------------------------------------------------------------

  const NO_PIP_SUPPORT_ERROR_MSG = 'Provider does not support PiP.';
  const VIDEO_NOT_READY_ERROR_MSG = 'Action not supported, must be a video that is ready for playback.';
  
  const pipRequest = (active) => {
    if (!$isVideoReady) { return Promise.reject(VIDEO_NOT_READY_ERROR_MSG); }
    if (!$canSetPiP) { return Promise.reject(NO_PIP_SUPPORT_ERROR_MSG); }
    return Promise.resolve($provider.setPiP(active));
  };

  export const requestPiP = () => pipRequest(true);
  export const exitPiP = () => pipRequest(false);

  // --------------------------------------------------------------
  // Fullscreen
  // --------------------------------------------------------------

  import FullscreenApi from './FullscreenApi';

  const FULLSCREEN_NOT_SUPPORTED_ERROR_MSG = 'Fullscreen not supported.';
  const FULLSCREEN_DOC_SUPPORT = !!FullscreenApi.requestFullscreen;

  let onDocFullscreenChangeListener = null;

  const isFullscreen = () => {
    const els = [playerWrapper, parentEl, $provider && $provider.getEl()].filter(Boolean);
    let active = els.includes(document[FullscreenApi.fullscreenElement]);
    if (!active) active = els.some((el) => el.matches && el.matches(`:${FullscreenApi.fullscreen}`));
    return active;
  };

  const onDocumentFullscreenChange = () => {
    const active = isFullscreen();
    $isFullscreenActive = active;
  };

  const onFullscreenChange = (active) => {
    $isFullscreenActive = active;
    if (!$isFullscreenActive) tempControls = false;
    tempPause = false;
    // iOS pauses the video when exiting fullscreen.
    if (!$paused) {
      setTimeout(() => {
        $provider.setPaused(false);
      }, 300);
    }
  };

  const requestDocumentFullscreen = (active) => {
    const el = parentEl || playerWrapper;
    if (!el) return Promise.reject();
    if (active === isFullscreen()) return Promise.resolve();
    const request = active
      ? el[FullscreenApi.requestFullscreen]()
      : document[FullscreenApi.exitFullscreen]();
    return Promise.resolve(request);
  };

  // TODO: the two providers which can set fullscreen at the moment (Html5/Dailymotion) don't
  // require a rebuild when enabling controls, if at some point a provider does this won't work.
  const requestProviderFullscreen = (active) => {
    if (active) tempControls = true;
    tempPause = true;
    return Promise.resolve($provider.setFullscreen(active));
  };

  const fullscreenRequest = (active) => {
    if (!$isVideoReady) {
      return Promise.reject(VIDEO_NOT_READY_ERROR_MSG);
    } if (FULLSCREEN_DOC_SUPPORT) {
      return requestDocumentFullscreen(active);
    } if (canProviderFullscreen) {
      return requestProviderFullscreen(active);
    }
    return Promise.reject(FULLSCREEN_NOT_SUPPORTED_ERROR_MSG);
  };

  export const requestFullscreen = () => fullscreenRequest(true);
  export const exitFullscreen = () => fullscreenRequest(false);

  onMount(() => {
    if (!FULLSCREEN_DOC_SUPPORT) return;
    onDocFullscreenChangeListener = listen(
      document,
      FullscreenApi.fullscreenchange,
      onDocumentFullscreenChange,
    );
  });
  
  onDestroy(() => {
    if (onDocFullscreenChangeListener) onDocFullscreenChangeListener();
    onDocFullscreenChangeListener = null;
  });

  $: canProviderFullscreen = $provider
    && $provider.supportsFullscreen()
    && is_function($provider.setFullscreen);
  
  $: store.canSetFullscreen.set(
    $isVideoReady && (FULLSCREEN_DOC_SUPPORT || canProviderFullscreen),
  );
</script>