<Lazy let:intersecting>
  {#if intersecting}
    <svelte:component
      {...props}
      this={Provider}
      bind:this={provider}
      on:load
      on:data
      on:message
      on:reload
      on:rebuildstart
      on:rebuildend
      on:error
      on:ready={onProviderReady}
      on:playbackready={onPlaybackReady}
      on:rebuildend={onRebuildEnd}
      on:pause={onPause}
      on:playing={onPlaying}
      on:timeupdate={onTimeUpdate}
      on:ended={onEnded}
      on:buffered={onBuffered}
      on:buffering={onBuffering}
      on:seeking={onSeeking}
      on:ratechange={onRateChange}
      on:qualitychange={onQualityChange}
      on:pipchange={onPiPChange}
      on:fullscreenchange={onFullscreenChange}
      on:srcchange={onSrcChange}
      on:titlechange={onTitleChange}
      on:mutechange={onMuteChange}
      on:volumechange={onVolumeChange}
      on:durationchange={onDurationChange}
      on:mediatypechange={onMediaTypeChange}
      on:qualitieschange={onQualitiesChange}
      on:rateschange={onRatesChange}
    />
  {/if}
</Lazy>

<script>
  import { tick, createEventDispatcher, onDestroy, afterUpdate } from 'svelte'
  import { get_current_component } from 'svelte/internal'
  import Lazy from '../components/Lazy.svelte'
  import PlayerEvent from './PlayerEvent'
  import { currentPlayer } from './globalStore'
  import { is_function, map_store_to_component } from '@vime/utils'
  import { bindPlayerStoreToComponent } from './playerStore'

  let self = get_current_component()
  const dispatch = createEventDispatcher()
  
  onDestroy(() => { self = null })

  const { store, resetStore, onPropsChange } = bindPlayerStoreToComponent()
  $: onPropsChange($$props)

  const {
    playsinline, canAutoplay, canMutedAutoplay,
    paused, muted, autoplay, playbackReady,
    started, ended, volume,
    seeking, internalTime,
    currentTime, autopause, nativeMode,
    live, loop, buffered,
    buffering, pipActive, rate,
    quality, qualities, rates,
    mediaType, duration, ready,
    src, controls, title,
    supportsPiP, supportsFullscreen, canSetPiP,
    canSetFullscreen, fullscreenActive, canSetRate,
    canSetQuality, playing
  } = store

  let provider
  let props = {}

  onDestroy(() => { props = {} })

  export let Provider

  // Filter out any player props before passing them to the provider.
  $: Object
    .keys($$props)
    .filter(prop => !store[prop] && (prop !== 'Provider'))
    .forEach(prop => (props[prop] = $$props[prop]))

  // --------------------------------------------------------------
  // Provider Events
  // --------------------------------------------------------------

  // Temporary states used to normalize player differences.
  let _tempMute = false
  let _tempPlay = false
  let _tempPause = false

  const initiateTempPlayback = () => {
    if (!$canAutoplay) return
    _tempMute = true
    _tempPlay = true
    $playsinline = true
  }

  const onTimeUpdate = e => {
    if ($seeking) return
    $internalTime = e.detail
    $currentTime = e.detail
  }

  afterUpdate(() => {
    if (!provider || $seeking || ($currentTime === $internalTime)) return
    $internalTime = $currentTime
    onSeeking()
    provider.setCurrentTime($currentTime)
  })

  const onPlaybackReady = async () => {
    // Wait a tick incase of any src changes.
    await tick()
    onAutoplay()
    $playbackReady = true
  }

  const onRebuildEnd = async () => {
    if ($currentTime > 0) {
      initiateTempPlayback()
      await tick()
      provider.setCurrentTime($currentTime)
    }
  }

  const onAutopause = () => {
    if ((!$autopause) || !$currentPlayer || $currentPlayer === self) return
    $currentPlayer.paused = true
  }

  const onAutoplay = () => {
    if (!$autoplay || (!$canAutoplay || !$canMutedAutoplay)) return
    $paused = false
    $playsinline = true
    if (!$canAutoplay) $muted = true
  }

  // If a provider fires a `pause` event before `seeking` we cancel it to not mess with our paused
  // state.
  let firePauseTimer
  const onPause = () => {
    firePauseTimer = window.setTimeout(() => {
      if (nativeMode && !_tempPause) $paused = true
      if (!_tempPause) $playing = false
    }, 100)
  }

  const onPlaying = async () => {
    $buffering = false
    if ($nativeMode && !_tempPlay) $paused = false
    provider.setPaused($paused)
    provider.setMuted($muted)
    if (!_tempPlay) {
      $playing = true
      $started = true
      onAutopause()
      $currentPlayer = self
    }
    // Give some time for the provider to be set to it's original value before we receive
    // event updates.
    await tick()
    setTimeout(() => {
      _tempPlay = false
      _tempMute = false
    }, 100)
  }

  const onSeeking = () => {
    if ($seeking) return
    window.clearTimeout(firePauseTimer)
    $seeking = true
    $buffering = true
    !$started ? initiateTempPlayback() : (_tempPause = true)
  }

  const onSeeked = () => {
    if (!$seeking || $buffering) return
    $seeking = false
    _tempPause = false
    dispatch(PlayerEvent.SEEKED)
  }

  const onRestart = async () => {
    if ($live || !$ended) return
    $internalTime = 0
    $currentTime = 0
    $ended = true
    provider.setCurrentTime(0)
    await tick()
    $paused = false
  }

  const onLoop = async () => {
    if ($live || !$loop) return
    await tick()
    onRestart()
  }

  const onEnded = async e => {
    $ended = true
    $paused = true
    onLoop()
  }

  const onBuffered = e => {
    $buffered = e.detail
    $buffering = $buffered < $internalTime
  }

  const onProviderReady = () => { $ready = true }
  const onSrcChange = e => { $src = e.detail }
  const onTitleChange = e => { $title = e.detail }
  const onRateChange = e => { $rate = e.detail }
  const onQualityChange = e => { $quality = e.detail }
  const onVolumeChange = e => { if ($nativeMode) $volume = e.detail }
  const onBuffering = e => { $buffering = e.detail }
  const onMuteChange = e => { if ($nativeMode && !_tempMute) $muted = e.detail }
  const onQualitiesChange = e => { $qualities = e.detail }
  const onRatesChange = e => { $rates = e.detail }
  const onDurationChange = e => { $duration = e.detail }
  const onPiPChange = e => { $pipActive = e.detail }
  const onFullscreenChange = e => { $fullscreenActive = e.detail }
  const onMediaTypeChange = e => { $mediaType = e.detail }

  const onProviderChange = () => {
    resetStore()
    $ready = false
  }

  const _onSrcChange = () => {
    prevRate = 1
    prevQuality = null
    resetStore()
  }

  $: onProviderChange(Provider)
  $: _onSrcChange($src)

  // --------------------------------------------------------------
  // Build Updates
  // --------------------------------------------------------------
  
  $: if (provider) provider.setPlaysinline($playsinline)
  $: if (provider) provider.setControls($nativeMode && $controls)
  
  $: $supportsPiP = provider && provider.supportsPiP()
  $: $supportsFullscreen = provider && provider.supportsFullscreen()
  
  $: $canSetPiP = $supportsPiP && is_function(provider.setPiP)
  $: $canSetFullscreen = $supportsFullscreen && is_function(provider.setFullscreen)
  $: $canSetRate = provider && is_function(provider.setRate)
  $: $canSetQuality = provider && is_function(provider.setQuality)
  
  // --------------------------------------------------------------
  // State Updates
  // --------------------------------------------------------------

  $: if ($seeking) onSeeked($buffering)
  $: if (provider) provider.setVolume($volume)
  $: if (provider) provider.setMuted($muted || _tempMute)
  $: if (provider) provider.setPaused(($paused || _tempPause) && !_tempPlay)
  $: if (!$paused && $ended) onRestart()
  $: $canSetPiP ? provider.setPiP($pipActive) : ($pipActive = false)
  $: $canSetFullscreen ? provider.setFullscreen($fullscreenActive) : ($fullscreenActive = false)

  let prevRate = 1
  $: if ($canSetRate) {
    provider.setRate($rate)
    prevRate = $rate
  } else {
    $rate = prevRate
  }

  let prevQuality = null
  $: if ($canSetQuality) {
    provider.setQuality($quality)
    prevQuality = $quality
  } else {
    $quality = $prevQuality
  }
</script>