import { tick, onDestroy, createEventDispatcher } from 'svelte'
import { writable, get } from 'svelte/store'
import { get_current_component, afterUpdate } from 'svelte/internal'
import { currentPlayer } from './GlobalStore'
import PlayerEvent from './PlayerEvent'

import {
  Disposal,
  subscribe,
  subscribe_and_dispatch,
  subscribe_and_dispatch_if_true,
  subscribe_until_true,
  private_writable
} from '@vime/utils'

export default function buildPlayerStore () {
  const player = get_current_component()
  const dispatch = createEventDispatcher()
  const disposal = new Disposal()

  // Storing defaults for values that are reset when the `src` changes.
  const defaults = {
    title: '',
    duration: 0,
    buffered: 0,
    qualities: [],
    quality: null,
    rates: [],
    rate: null,
    started: false,
    ended: false,
    buffering: false,
    paused: true,
    playing: false,
    seeking: false,
    seeked: false,
    currentTime: 0,
    muted: false,
    volume: 30,
    playbackReady: false
  }

  // --------------------------------------------------------------
  // Stores
  // --------------------------------------------------------------

  const src = writable(null)
  const autopause = writable(true)
  const ready = private_writable(false)
  const title = private_writable(defaults.title)
  const duration = private_writable(defaults.duration)
  const buffered = private_writable(defaults.buffered)
  const qualities = private_writable(defaults.qualities)
  const quality = writable(defaults.quality)
  const rates = private_writable(defaults.rates)
  const rate = writable(defaults.rate)
  const started = private_writable(defaults.started)
  const ended = private_writable(defaults.ended)
  const buffering = private_writable(defaults.buffering)
  const paused = writable(defaults.paused)
  const playing = private_writable(defaults.playing)
  const seeking = private_writable(defaults.seeking)
  const seeked = writable(defaults.seeked)
  const internalTime = private_writable(defaults.currentTime)
  const currentTime = writable(defaults.currentTime)
  const muted = writable(defaults.muted)
  const volume = writable(defaults.volume)
  const playbackReady = private_writable(defaults.playbackReady)

  // TODO: add progress / state (stores + events), srcchange, posterchange
  // playedRanges

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onSrcChange = () => {
    paused.set(defaults.paused)
    playing.set(defaults.playing)
    seeking.set(defaults.seeking)
    seeked.set(defaults.seeked)
    internalTime.set(defaults.currentTime)
    currentTime.set(defaults.currentTime)
    muted.set(defaults.muted)
    volume.set(defaults.volume)
    title.set(defaults.title)
    duration.set(defaults.duration)
    buffered.set(defaults.buffered)
    buffering.set(defaults.buffering)
    qualities.set(defaults.qualities)
    quality.set(defaults.quality)
    rates.set(defaults.rates)
    rate.set(defaults.rate)
    started.set(defaults.started)
    ended.set(defaults.ended)
    playbackReady.set(defaults.playbackReady)
    disposal.dispose()
    disposal.add(subscribe_until_true(playing, () => started.set(true)))
    disposal.add(subscribe_until_true(ended, () => paused.set(true)))
  }

  subscribe(src, onSrcChange)
  subscribe_and_dispatch(src, PlayerEvent.SRC_CHANGE)
  subscribe_and_dispatch(duration, PlayerEvent.DURATION_CHANGE)
  subscribe_and_dispatch(currentTime, PlayerEvent.TIME_UPDATE)
  subscribe_and_dispatch(rate, PlayerEvent.RATE_CHANGE)
  subscribe_and_dispatch(rates, PlayerEvent.RATES_CHANGE)
  subscribe_and_dispatch(quality, PlayerEvent.QUALITY_CHANGE)
  subscribe_and_dispatch(qualities, PlayerEvent.QUALITIES_CHANGE)
  subscribe_and_dispatch(volume, PlayerEvent.VOLUME_CHANGE)
  subscribe_and_dispatch(muted, PlayerEvent.MUTE_CHANGE)
  subscribe_and_dispatch(buffered, PlayerEvent.BUFFERED)
  subscribe_and_dispatch_if_true(buffering, PlayerEvent.BUFFERING)
  subscribe_and_dispatch_if_true(started, PlayerEvent.PLAYBACK_STARTED)
  subscribe_and_dispatch_if_true(ended, PlayerEvent.PLAYBACK_ENDED)
  subscribe_and_dispatch_if_true(ready, PlayerEvent.READY)
  subscribe_and_dispatch_if_true(playbackReady, PlayerEvent.PLAYBACK_READY)
  subscribe_and_dispatch_if_true(playing, PlayerEvent.PLAYING)

  let _internalTime
  let _currentTime
  subscribe(internalTime, $t => { _internalTime = $t })
  subscribe(currentTime, $t => { _currentTime = $t })
  afterUpdate(() => {
    if (_currentTime !== _internalTime) {
      internalTime.set(_currentTime)
      seeking.set(true)
      player.seekTo(_currentTime)
    }
  })

  let _seeking
  let mutedStateBeforeSeeking
  let pausedStateBeforeSeeking
  subscribe(seeking, $s => {
    _seeking = $s
    if (!$s) return
    dispatch(PlayerEvent.SEEKING)
    mutedStateBeforeSeeking = get(muted)
    pausedStateBeforeSeeking = get(paused)
    paused.set(true)
    muted.set(true)
  })

  subscribe(buffering, $b => _seeking && !$b && seeked.set(true))
  subscribe(buffered, $b => _seeking && $b >= _currentTime && seeked.set(true))

  subscribe(playing, $p => {
    if (!$p) return
    _seeking && seeked.set(true)
    buffering.set(false)
    paused.set(false)
    const _currentPlayer = get(currentPlayer)
    if (get(autopause) && _currentPlayer && _currentPlayer !== player) _currentPlayer.paused = true
    currentPlayer.set(player)
  })

  subscribe(paused, $p => {
    $p ? dispatch(PlayerEvent.PAUSE) : dispatch(PlayerEvent.PLAY)
    $p && playing.set(false)
  })

  subscribe(seeked, async $s => {
    if (!_seeking || !$s) return
    seeking.set(false)
    buffering.set(false)
    seeked.set(false)
    dispatch(PlayerEvent.SEEKED)
    await tick()
    paused.set(pausedStateBeforeSeeking)
    muted.set(mutedStateBeforeSeeking)
  })

  return {
    src,
    duration,
    buffered,
    qualities,
    quality,
    rates,
    rate,
    started,
    ended,
    buffering,
    paused,
    internalTime,
    currentTime,
    muted,
    volume,
    title,
    ready,
    playing,
    seeking,
    playbackReady,
    autopause,
    params: writable({}),
    events: writable({}),
    aspectRatio: writable(null),
    playsinline: writable(true),
    controls: writable(true),
    autoplay: writable(false),
    loop: writable(false)
  }
}
