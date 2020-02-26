<svelte:options accessors />

<svelte:head>
  <!-- TODO: conditionally load this (maybe move to plugins?) -->
  <div style="display: none;">{@html sprite}</div>
</svelte:head>

<div 
  tabindex="0"
  class="vime player{_classes ? ` ${_classes}` : ''}"
  class:audio={_isAudio}
  class:video={!_isAudio}
  class:fullscreen={isFullscreenActive}
  class:hideNativeControls={!nativeMode}
  class:idle={!nativeMode && !isPaused && !_isControlsActive}
  on:contextmenu={onContextMenu}
  bind:this={_el}
>
  <div
    class="provider"
    class:aspectRatio={shouldSetAspectRatio}
    class:fullscreen={isFullscreenActive}
    use:setAspectRatio={shouldSetAspectRatio ? aspectRatio : null}
    bind:this={_providerEl}
  >
    {#if !nativeMode && !_isAudio}
      <div class="blocker"></div>
    {/if}
    <!-- TODO: pause/play when in and out of view -->
    <IntersectionObserver 
      once
      container={_el}
      threshold={0.75}
      let:intersecting 
    >
      {#if _hasMounted && intersecting}
        <svelte:component
          player={self}
          config={buildConfig(_Provider, config.providers)}
          this={_Provider && _Provider.default}
          bind:this={_currentProvider}
          on:providerready={onProviderReady}
          on:playbackready={onPlaybackReady}
          on:rebuild={onRebuild}
          on:rebuildend={onRebuildEnd}
          on:pause={onPause}
          on:playing={onPlaying}
          on:ended={onEnded}
          on:buffered={onBuffered}
          on:buffering={onBuffering}
          on:seeking={onSeeking}
          on:ratechange={onRateChange}
          on:qualitychange={onQualityChange}
          on:pipchange={onPiPChange}
          on:mutechange={onMuteChange}
          on:volumechange={onVolumeChange}
          on:error={onError} 
        />
      {/if}
    </IntersectionObserver>
  </div>
  <IntersectionObserver 
    once
    container={_el}
    threshold={0.75}
    let:intersecting 
  >
    {#if intersecting}
      <Plugins
        player={self}
        {plugins}
        {nativeMode}
        config={config.plugins}
        on:register={onPluginMount}
        on:deregister={onPluginDestroy}
        bind:this={_pluginsManager}
        on:error={onError}
      />
    {/if}
  </IntersectionObserver>
</div>

<script>
  import { get_current_component } from 'svelte/internal';
  import { tick, afterUpdate, onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { get } from 'svelte/store';
  import { create_prop, merge_deep } from '~utils/object';
  import { is_string } from '~utils/unit';
  import * as logger from '~utils/debug';
  import { watch_touch, can_autoplay, IS_MOBILE } from '~utils/support';
  import { map_component_to_store } from '~utils/store';
  import { aspectRatio as setAspectRatio } from '~utils/actions';
  import sprite from '~static/vime.svg';
  import en from '~src/lang/en';
  import * as globalStore from './store';
  import { currentPlayer, autopause as globalAutopause } from './store';
  import Registry from './Registry';
  import Scheduler from './Scheduler';
  import PlayerState from './PlayerState';
  import MediaType from './MediaType';
  import PluginRole from './PluginRole';
  import PlayerEvent from './PlayerEvent';
  import Plugins, { buildConfig } from './components/Plugins.svelte';
  import IntersectionObserver from './components/IntersectionObserver.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  const ID = 'Player';
  const self = get_current_component();
  const store = map_component_to_store();
  const _dispatch = createEventDispatcher();
  const constructor = self.constructor;
  const registry = new Registry(ID);

  if (!constructor.didAttachGlobalStore) {
    Object.keys(globalStore).forEach(prop => {
      create_prop(constructor, prop, {
        get: () => get(globalStore[prop]),
        set: p => globalStore[prop].set(p)
      });
    });
    globalStore.isMobile.set(IS_MOBILE);
    watch_touch(t => { globalStore.isTouch.set(t); });
    constructor.didAttachGlobalStore = true;
  }

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  // Readonly.
  let _el;
  let _providerEl;
  let _pluginsManager;
  let _currentProvider;
  let _classes = null;
  let _duration = -1;
  let _isSeeking = false;
  let _isPiPSupported = false;
  let _isLiveStream = false;
  let _isReadyToRestart = false;
  let _isProviderReady = false;
  let _isPlaybackReady = false;
  let _mediaType = null;
  let _qualities = [];
  let _playbackRates = [];
  let _hasSeeked = false;
  let _buffered = 0;
  let _errors = [];
  let _canInteract = false;
  let _state = PlayerState.IDLE;
  let _hasPlaybackStarted = false;
  let _hasPlaybackEnded = false;
  let _isCurrentPlayer = false;
  let _isBuffering = false;

  export let src = null;
  export let locale = 'en';
  export let languages = { en };
  export let theme = null;
  export let poster = null;
  export let aspectRatio = '16:9';
  export let currentTime = 0;
  export let isMuted = false;
  export let playsinline = true;
  export let crossOrigin = null;
  export let preload = false;
  export let autoplay = false;
  export let autopause = false;
  export let loop = false;
  export let plugins = [];
  export let tracks = [];
  export let currentTrack = -1;
  export let isPaused = true;
  export let playbackRate = 1;
  export let quality = null;
  export let volume = 30;
  export let nativeMode = false;
  export let isPiPActive = false;
  export let isFullscreenActive = false;
  export let isContextMenuEnabled = false;
  export let isControlsEnabled = true;
  export let isPiPEnabled = true;
  export let isFullscreenEnabled = true;
  export let isCaptionsEnabled = true;
  export let isCaptionsActive = false;
  export let debug = (process.env.NODE_ENV !== 'production');

  // Readonly properties set from other plugins.
  export let _isControlsActive = true;
  export let _isFullscreenSupported = false;

  export let config = {
    plugins: {},
    providers: {}
  };

  // TODO: we shouldn't be loading all of this.
  const icon = icon => `#vime-${icon}`;
  export let icons = {
    play: icon('play'),
    pause: icon('pause'),
    captionsOn: icon('captions-on'),
    captionsOff: icon('captions-off'),
    enterFullscreen: icon('enter-fullscreen'),
    exitFullscreen: icon('exit-fullscreen'),
    enterPiP: icon('enter-pip'),
    exitPiP: icon('exit-pip'),
    seekForward: icon('seek-forward'),
    seekBackward: icon('seek-backward'),
    volumeLow: icon('volume-low'),
    volumeHigh: icon('volume-high'),
    volumeMute: icon('volume-mute'),
    settings: icon('settings'),
    checkmark: icon('checkmark')
  };

  // Silences unused export errors.
  const silence = () => {};
  silence(isCaptionsEnabled, isCaptionsActive);

  $: shouldSetAspectRatio = _isVideo || !!poster;
  $: _isLiveStream = _duration > 2 ** 32;
  $: _isAudio = (_mediaType === MediaType.AUDIO);
  $: _isVideo = (_mediaType === MediaType.VIDEO);
  $: _providers = plugins.filter(p => p.ROLE === PluginRole.PROVIDER);
  $: _i18n = languages[locale] || languages.en;
  $: _isControlsSupported = plugins.some(p => p.ROLE === PluginRole.CONTROLS) || nativeMode;
  $: _isCaptionsSupported = plugins.some(p => p.ROLE === PluginRole.CAPTIONS) ||
    (nativeMode && _currentProvider && _currentProvider.setTracks);

  $: if (_el && theme) {
    is_string(theme)
      ? _el.style.setProperty('--theme', theme)
      : Object.keys(theme).forEach(key => { _el.style.setProperty(`--${key}`, theme[key]); });
  }

  let prevConfig = config;
  $: {
    config = merge_deep(prevConfig, config);
    prevConfig = config;
  }

  let prevLanguages = languages;
  $: {
    languages = merge_deep(prevLanguages, languages);
    prevLanguages = languages;
  }

  let prevIcons = icons;
  $: {
    icons = merge_deep(prevIcons, icons);
    prevIcons = icons;
  }

  export { _classes as class };
  export const getEl = () => _el;
  export const getProviderEl = () => _providerEl;
  export const getStore = () => store;
  export const getI18n = () => _i18n;
  export const getGlobalStore = () => globalStore;
  export const getProvider = () => _Provider;
  export const getCurrentProvider = () => _currentProvider;
  export const getProviders = () => _providers;
  export const getBuffered = () => _buffered;
  export const getDuration = () => _duration;
  export const getErrors = () => _errors;
  export const getMediaType = () => _mediaType;
  export const getQualities = () => _qualities;
  export const getPlaybackRates = () => _playbackRates;
  export const getRegistry = () => registry;
  export const getScheduler = () => scheduler;
  export const getPluginsManager = () => _pluginsManager;
  export const getPluginsRegistry = () => _pluginsManager && _pluginsManager.getRegistry();
  export const getProgress = () => _progress;
  export const getState = () => _state;
  export const isAudio = () => _isAudio;
  export const isVideo = () => _isVideo;
  export const isBuffering = () => _isBuffering;
  export const isSeeking = () => _isSeeking;
  export const isReadyToRestart = () => _isReadyToRestart;
  export const isCurrentPlayer = () => _isCurrentPlayer;
  export const isControlsSupported = () => _isControlsSupported;
  export const isControlsActive = () => _isControlsActive;
  export const isCaptionsSupported = () => _isCaptionsSupported;
  export const isFullscreenSupported = () => _isFullscreenSupported;
  export const isLiveStream = () => _isLiveStream;
  export const isPiPSupported = () => _isPiPSupported;
  export const isPlaybackReady = () => _isPlaybackReady;
  export const isProviderReady = () => _isProviderReady;
  export const hasSeeked = () => _hasSeeked;
  export const hasPlaybackStarted = () => _hasPlaybackStarted;
  export const hasPlaybackEnded = () => _hasPlaybackEnded;
  export const canInteract = () => _canInteract;
  export const canPlayinline = () => _canPlayinline;
  export const canAutoplay = () => can_autoplay(false);
  export const canMutedAutoplay = () => can_autoplay(true);
  export const canSetQuality = () => _canSetQuality;
  export const canSetPlaybackRate = () => _canSetPlaybackRate;
  export const extendLanguage = (code, language) => { languages = { [code]: language }; };
  export const dispatch = (event, detail) => _dispatch(event, detail);

  export const createRegistry = id => {
    const _registry = new Registry(id);
    registry.register(id, _registry);
    return _registry;
  };

  export const createLogger = id => ({
    log () { debug && logger.log(id, '::', ...arguments); },
    warn () { debug && logger.warn(id, '::', ...arguments); },
    error () { debug && logger.error(id, '::', ...arguments); }
  });

  let _hasMounted = false;
  onMount(() => {
    dispatch(PlayerEvent.MOUNT);
    _hasMounted = true;
  });
  onDestroy(() => dispatch(PlayerEvent.DESTROY));
  
  const onPluginMount = e => {
    self[e.detail.id] = e.detail.value;
    dispatch(`${e.detail.id}mount`, e.detail);
    dispatch(PlayerEvent.PLUGIN_MOUNT, e.detail);
  };

  const onPluginDestroy = e => {
    delete self[e.detail];
    dispatch(`${e.detail}destroy`, e.detail);
    dispatch(PlayerEvent.PLUGIN_DESTROY, e.detail);
  };

  const onContextMenu = e => {
    if (process.env.NODE_ENV === 'production' && !isContextMenuEnabled) e.preventDefault();
  };

  // --------------------------------------------------------------
  // Time Updates
  // --------------------------------------------------------------
  
  const scheduler = new Scheduler(ID);
  onMount(() => scheduler.start());

  const updateTime = async () => {
    // DM starts incrementing time before playback has even started.
    if (!_hasPlaybackStarted) return;
    internalTimer = await _currentProvider.getCurrentTime();
    currentTime = internalTimer;
  };

  let internalTimer;
  const timeTaskID = 'vTimeUpdate';
  scheduler.add(timeTaskID, () => updateTime());
  $: scheduler.pause(timeTaskID, !_canInteract || isPaused);

  afterUpdate(() => {
    if (!_canInteract || (currentTime === internalTimer)) return;
    internalTimer = currentTime;
    _currentProvider.setCurrentTime(currentTime);
  });

  // --------------------------------------------------------------
  // Provider Events
  // --------------------------------------------------------------

  // Used if preload is set.
  let didSkipFirstPlaybackCall = false;

  // Temporary states used to normalize player differences.
  let _tempMute = false;
  let _tempPlay = false;
  let _tempPause = false;

  const initiateTempPlayback = async () => {
    const canMutedPlay = await canMutedAutoplay();
    if (!canMutedPlay) return;
    _tempMute = true;
    _tempPlay = true;
    playsinline = true;
  };

  const onProviderReady = async () => {
    if (_isProviderReady) return;
    const Provider = _Provider;
    await tick();
    // Check again incase of sudden src switch.
    if (Provider !== _Provider) return;
    _isPiPSupported = await _currentProvider.supportsPiP();
    _isProviderReady = true;
  };

  const onAutoplay = async () => {
    const canPlay = await canAutoplay();
    const canMutedPlay = await canMutedAutoplay();
    if (!autoplay || (!canPlay || !canMutedPlay)) return;
    isPaused = false;
    playsinline = true;
    if (!canPlay) isMuted = true;
  };

  const onPreload = async () => {
    if (autoplay || _isLiveStream || !preload) return;
    await tick();
    initiateTempPlayback();
  };

  const onLoadMetaData = async () => {
    _mediaType = await _currentProvider.getMediaType();
    const newQualities = await _currentProvider.getQualities();
    if (newQualities) _qualities = newQualities;
    const newRates = await _currentProvider.getPlaybackRates();
    if (newRates) _playbackRates = newRates;
    _duration = await _currentProvider.getDuration() || 0;
  };

  const onPlaybackReady = async () => {
    _canInteract = true;
    await tick();
    await onLoadMetaData();
    await onAutoplay();
    await onPreload();
    _isPlaybackReady = true;
  };

  const onRebuild = async () => {
    const canMutedPlay = await canMutedAutoplay();
    if (
      !_isPlaybackReady ||
      !_currentProvider.rebuild ||
      (_hasPlaybackStarted && !canMutedPlay)
    ) return;
    _canInteract = false;
    dispatch(PlayerEvent.REBUILD);
    await tick();
    _currentProvider.rebuild();
  };

  const onRebuildEnd = async () => {
    if (currentTime > 0) {
      initiateTempPlayback();
      await tick();
      _currentProvider.setCurrentTime(currentTime);
    }
    _canInteract = true;
    dispatch(PlayerEvent.REBUILD_END);
  };

  const onSeeking = () => {
    if (_isSeeking) return;
    window.clearTimeout(firePauseTimer);
    updateTime();
    _isSeeking = true;
    dispatch(PlayerEvent.SEEKING);
    !_hasPlaybackStarted ? initiateTempPlayback() : (_tempPause = true);
  };

  const onSeeked = seeked => {
    if (!_isSeeking || !seeked) return;
    _isSeeking = false;
    _hasSeeked = true;
    _tempPause = false;
    dispatch(PlayerEvent.SEEKED);
  };

  const onPlaybackStarting = async () => {
    if (_hasPlaybackStarted) return;
    // Sometimes we can get better accuracy once the video starts playing.
    _duration = await _currentProvider.getDuration();
    if (!autoplay && !_isLiveStream && preload && !didSkipFirstPlaybackCall) {
      didSkipFirstPlaybackCall = true;
      return;
    }
    _hasPlaybackStarted = true;
  };

  const onAutopause = () => {
    if ((!autopause || !$globalAutopause) || $currentPlayer === self) return;
    $currentPlayer.isPaused = true;
  };

  const onPlaying = async () => {
    onSeeked(true);
    if (nativeMode && !_tempPlay) isPaused = false;
    _currentProvider.setPaused(isPaused);
    _currentProvider.setMuted(isMuted);
    onPlaybackStarting();
    onAutopause();
    $currentPlayer = self;
    await tick();
    // Give some time for the provider to be set to it's original value before we receive
    // event updates.
    setTimeout(() => {
      _tempPlay = false;
      _tempMute = false;
    }, 100);
  };

  const onEnded = async e => {
    _hasPlaybackEnded = true;
    await tick();
    isPaused = true;
    if (!_isLiveStream) _isReadyToRestart = true;
    if (!_isLiveStream && loop) {
      await tick();
      isPaused = false;
    }
  };

  const onBuffered = e => { _buffered = e.detail; };
  const onBuffering = e => { _isBuffering = e.detail; };
  const onPiPChange = e => { isPiPActive = e.detail; };
  const onMuteChange = e => { if (nativeMode && !_tempMute) isMuted = e.detail; };
  const onVolumeChange = e => { if (nativeMode) volume = e.detail; };

  // If a provider fires a `pause` event before `seeking` we cancel it.
  let firePauseTimer;
  const onPause = () => {
    firePauseTimer = window.setTimeout(() => {
      if (nativeMode && !_tempPause) isPaused = true;
    }, 100);
  };

  const onRateChange = e => {
    playbackRate = e.detail;
    _prevRate = e.detail;
    dispatch(PlayerEvent.RATE_CHANGE, playbackRate);
  };

  const onQualityChange = e => {
    quality = e.detail;
    _prevQuality = e.detail;
    dispatch(PlayerEvent.QUALITY_CHANGE, quality);
  };

  const onError = e => {
    if (debug) logger.error(e);
    _errors = [..._errors, e.detail];
    dispatch(PlayerEvent.ERROR, e);
  };

  const onRestartPlayback = () => {
    _hasPlaybackEnded = false;
    _isReadyToRestart = false;
    currentTime = 0;
    isPaused = false;
  };

  const onSrcChange = async () => {
    _isPlaybackReady = false;
    _canInteract = false;
    _hasPlaybackStarted = false;
    _hasPlaybackEnded = false;
    _hasSeeked = false;
    _isReadyToRestart = false;
    internalTimer = 0;
    currentTime = 0;
    isPaused = true;
    _prevQuality = null;
    quality = null;
    _buffered = 0;
    _duration = -1;
    _qualities = [];
    _prevRate = 1;
    playbackRate = 1;
    didSkipFirstPlaybackCall = false;
    if (_isProviderReady) {
      await tick();
      _currentProvider.loadMedia(src);
    }
  };

  const onProviderChange = () => {
    _isProviderReady = false;
    _playbackRates = [1];
    onSrcChange();
  };

  $: _Provider = src && _providers.find(p => p.canPlay(src));
  $: onProviderChange(_Provider);
  $: if (_isProviderReady) onSrcChange(src);
  $: _isCurrentPlayer = !$currentPlayer || $currentPlayer === self;
  
  $: if (src && !_Provider) {
    logger.warn(`${ID} :: there is no provider that can play this \`src\` [${src}]`);
  }

  // --------------------------------------------------------------
  // Build Updates
  // --------------------------------------------------------------
  
  $: _canPlayinline = _currentProvider && _currentProvider.setPlaysinline;
  $: if (_canPlayinline) _currentProvider.setPlaysinline(playsinline);
  
  $: if (_currentProvider) _currentProvider.setControls(nativeMode && isControlsEnabled);
  
  $: if (_currentProvider && _currentProvider.setCrossOrigin) {
    _currentProvider.setCrossOrigin(crossOrigin);
  }
  
  $: if (is_string(poster) && _currentProvider && _currentProvider.setPoster) {
    _currentProvider.setPoster(nativeMode && poster);
  }
  
  // --------------------------------------------------------------
  // State Updates
  // --------------------------------------------------------------

  $: if (_isReadyToRestart && !isPaused) onRestartPlayback();
  $: if (_canInteract && _isSeeking) onSeeked(!_isBuffering);
  $: if (_canInteract) _currentProvider.setVolume(volume);
  $: if (_canInteract) _currentProvider.setMuted(isMuted || _tempMute);
  $: if (_canInteract) _currentProvider.setPaused((isPaused || _tempPause) && !_tempPlay);
  $: if (_canInteract && _isPiPSupported) _currentProvider.setPiP(isPiPEnabled && isPiPActive);

  $: _currentProvider
    ? _currentProvider.getMediaType().then(type => { _mediaType = type; })
    : (_mediaType = null);

  // --------------------------------------------------------------
  // Quality + Playback Rate
  // --------------------------------------------------------------
  
  $: _canSetQuality = _currentProvider && _currentProvider.setQuality;
  $: _canSetPlaybackRate = _currentProvider && _currentProvider.setPlaybackRate;

  let _prevQuality = quality;
  $: if (
    _canInteract &&
    _canSetQuality &&
    _qualities.includes(quality) &&
    quality !== _prevQuality
  ) {
    _currentProvider.setQuality(quality);
    _prevQuality = quality;
  } else if (quality !== _prevQuality) {
    quality = _prevQuality;
  }

  let _prevRate = playbackRate;
  $: if (
    _canInteract &&
    _canSetPlaybackRate &&
    _playbackRates.includes(playbackRate) &&
    _prevRate !== playbackRate
  ) {
    _currentProvider.setPlaybackRate(playbackRate);
    _prevRate = playbackRate;
  } else if (playbackRate !== _prevRate) {
    playbackRate = _prevRate;
  }

  // --------------------------------------------------------------
  // Player Events
  // --------------------------------------------------------------

  $: _progress = {
    played: {
      seconds: currentTime,
      percent: (_duration > 0) ? ((currentTime / _duration) * 100) : 0
    },
    buffered: {
      seconds: _buffered,
      percent: (_duration > 0) ? ((_buffered / _duration) * 100) : 0
    }
  };

  $: if (_hasPlaybackEnded) {
    _state = PlayerState.ENDED;
    dispatch(PlayerEvent.PLAYBACK_END);
  } else if (_hasPlaybackStarted && isPaused) {
    _state = PlayerState.PAUSED;
    dispatch(PlayerEvent.PAUSE);
  } else if (_hasPlaybackStarted && _isBuffering) {
    _state = PlayerState.BUFFERING;
    dispatch(PlayerEvent.BUFFERING);
  } else if (_hasPlaybackStarted) {
    _state = PlayerState.PLAYING;
    dispatch(PlayerEvent.PLAYING);
  } else if (_isPlaybackReady) {
    _state = PlayerState.CUED;
    dispatch(PlayerEvent.CUE);
  } else {
    _state = PlayerState.IDLE;
  }

  $: dispatch(PlayerEvent.SRC_CHANGE, src);
  $: dispatch(PlayerEvent.LOCALE_CHANGE, locale);
  $: dispatch(PlayerEvent.POSTER_CHANGE, poster);
  $: dispatch(PlayerEvent.TIME_UPDATE, currentTime);
  $: dispatch(PlayerEvent.DURATION_CHANGE, _duration);
  $: dispatch(PlayerEvent.CONFIG_CHANGE, config);
  $: dispatch(PlayerEvent.LANGUAGES_CHANGE, languages);
  $: dispatch(PlayerEvent.TRACK_CHANGE, currentTrack);
  $: dispatch(PlayerEvent.TRACKS_CHANGE, tracks);
  $: dispatch(PlayerEvent.BUFFERED, _buffered);
  $: dispatch(PlayerEvent.PROGRESS_UPDATE, _progress);
  $: dispatch(PlayerEvent.STATE_CHANGE, _state);
  $: dispatch(PlayerEvent.RATES_CHANGE, _playbackRates);
  $: dispatch(PlayerEvent.QUALITIES_CHANGE, _qualities);
  $: dispatch(PlayerEvent.VOLUME_CHANGE, { isMuted, volume });
  $: if (!isPaused) dispatch(PlayerEvent.PLAY);
  $: if (_isPlaybackReady) dispatch(PlayerEvent.READY);
  $: if (_hasPlaybackStarted) dispatch(PlayerEvent.PLAYBACK_START);
  $: if (_isPiPSupported && isPiPEnabled && isPiPActive) dispatch(PlayerEvent.ENTER_PIP);
  $: if (!_isPiPSupported || !isPiPEnabled || !isPiPActive) dispatch(PlayerEvent.EXIT_PIP);
  $: dispatch(PlayerEvent.PROVIDER_CHANGE, { Provider: _Provider, currentProvider: _currentProvider });
  
  $: if (
    _isControlsSupported && isControlsEnabled && _isControlsActive
  ) dispatch(PlayerEvent.SHOW_CONTROLS);
  
  $: if (
    !_isControlsSupported || !isControlsEnabled || !_isControlsActive
  ) dispatch(PlayerEvent.HIDE_CONTROLS);
  
  $: if (
    _isFullscreenSupported && isFullscreenEnabled && isFullscreenActive
  ) dispatch(PlayerEvent.ENTER_FULLSCREEN);
  
  $: if (
    !_isFullscreenSupported || !isFullscreenEnabled || !isFullscreenActive
  ) dispatch(PlayerEvent.EXIT_FULLSCREEN);

  // --------------------------------------------------------------
  // Native Mode
  // --------------------------------------------------------------

  setTimeout(() => {
    // console.log('switch to native')
    // nativeMode = false
  }, 5000);

  // onPause (make sure not fired when seeking)
  // onMuteChange
  // onVolumeChange
  // onRateChange
  // seeking

  // supportsFullscreenViaApi?
  // isFullscreenSupported()
  // setControls -> enable/disable
  // setPlaysinline - > enable/disable
  // setCrossOrigin?
  // setFullscreen -> active

  // @see https://github.com/videojs/video.js/blob/master/src/js/tech/html5.js#L1059
  // getTracks -> when playback ready?
  // setTrack (an index) ?
  // setTracks -> isCaptionsEnabled && isCaptionsActive ? tracks : null ()
  // onTrackChange
</script>

<style type="text/scss">
  @import '../style/common';
  @import '../style/slider';

  // List of CSS custom properties.
  // --theme
  // --fontFamily
  // --fontSizeSmall
  // --fontSizeMedium
  // --fontSizeLarge
  // --fontSizeExtraLarge
  // --fontWeightLight
  // --fontWeightRegular
  // --fontWeighBold
  // --baseLineHeight

  .player {
    --fontFamily: 'Helvetica Neue', 'Segoe UI', Helvetica, Arial, sans-serif;
  }

  .player {
    box-sizing: border-box;
    direction: ltr;
    font-family: var(--fontFamily);
    -moz-osx-font-smoothing: auto;
    -webkit-font-smoothing: subpixel-antialiased;
    -webkit-tap-highlight-color: transparent;
    font-variant-numeric: tabular-nums;
    font-weight: $font-weight-bold;
    line-height: var(--baseLineHeight, 1.7);
    max-width: 100%;
    min-width: 300px;
    position: relative;
    text-shadow: none;
    transition: box-shadow 0.3s ease;

    &:focus {
      outline: 0;
    }

    :global(*),
    :global(*::after),
    :global(*::before) {
      box-sizing: inherit;
    }

    :global(video),
    :global(audio) {
      border-radius: inherit;
      vertical-align: middle;
      width: 100%;
    }

    :global(video) {
      height: auto;
    }

    :global(button) {
      font: inherit;
      line-height: inherit;
      width: auto;

      &::-moz-focus-inner {
        border:0;
      }
    }

    // Fix 300ms delay
    :global(a),
    :global(button),
    :global(input),
    :global(label) {
      touch-action: manipulation;
    }

    &.hideNativeControls {
      :global(::-webkit-media-controls) {
        display: none !important;
        -webkit-appearance: none;
      }
    }

    &.fullscreen {
      background: #000;
      border-radius: 0 !important;
      height: 100%;
      margin: 0;
      width: 100%;

      :global(video) {
        height: 100%;
      }
    }

    &.idle {
      cursor: none;
    }

    &.video {
      background: #000;
      overflow: hidden;
    }
  }

  .blocker {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: inline-block;
  }

  .provider {
    border-radius: inherit;
    overflow: hidden;
    position: relative;
    width: 100%;
    z-index: 0; // Require z-index to force border-radius

    &.fullscreen {
      height: 100%;
      position: static;
    }

    &.aspectRatio {
      height: 0;

      :global(iframe),
      :global(video) {
        border: 0;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        user-select: none;
        width: 100%;
      }
    }
  }
</style>
