import { createEventDispatcher } from 'svelte'
import { writable, derived, get, readable } from 'svelte/store'
import { get_current_component, current_component } from 'svelte/internal'
import { currentPlayer } from './globalStore'
import PlayerEvent from './PlayerEvent'
import PlayerState from './PlayerState'
import MediaType from './MediaType'
import VideoQuality from './VideoQuality'

import {
  subscribe,
  subscribe_and_dispatch,
  subscribe_and_dispatch_if_true,
  private_writable,
  map_store_to_component,
  can_autoplay,
  selectable
} from '@vime/utils'

// Player defaults used when the `src` changes or `resetStore`
const playerDefaults = () => ({
  paused: true,
  playing: false,
  seeking: false,
  internalTime: 0,
  currentTime: 0,
  muted: false,
  volume: 30,
  title: '',
  duration: 0,
  buffered: 0,
  buffering: false,
  poster: null,
  quality: VideoQuality.UNKNOWN,
  qualities: [],
  rate: 1,
  rates: [1],
  started: false,
  ended: false,
  playbackReady: false,
  mediaType: MediaType.NONE,
  live: false
})

const buildPlayerStore = player => {
  const defaults = playerDefaults()
  const mediaType = writable(defaults.mediaType)
  const qualities = private_writable(defaults.qualities)
  const rates = private_writable(defaults.rates)
  const currentTime = writable(defaults.currentTime)
  const duration = private_writable(defaults.duration)
  const buffered = private_writable(defaults.buffered)
  const started = private_writable(defaults.started)
  const ended = private_writable(defaults.ended)
  const buffering = private_writable(defaults.buffering)
  const paused = writable(defaults.paused)
  const playbackReady = private_writable(defaults.playbackReady)

  return {
    src: writable(null),
    mediaType,
    currentTime,
    duration,
    buffered,
    started,
    ended,
    buffering,
    paused,
    playbackReady,
    audio: derived(mediaType, ($mediaType) => $mediaType === MediaType.AUDIO),
    video: derived(mediaType, ($mediaType) => $mediaType === MediaType.VIDEO),
    poster: writable(defaults.poster),
    pipActive: writable(false),
    supportsPiP: writable(false),
    canSetPiP: writable(false),
    fullscreenActive: writable(false),
    supportsFullscreen: writable(false),
    canSetFullscreen: writable(false),
    autopause: writable(true),
    ready: private_writable(false),
    nativeMode: private_writable(true),
    title: private_writable(defaults.title),
    muted: writable(defaults.muted),
    qualities,
    quality: selectable(defaults.quality, qualities),
    canSetQuality: writable(false),
    rates,
    rate: selectable(defaults.rate, rates),
    canSetRate: writable(false),
    playing: private_writable(defaults.playing),
    seeking: private_writable(defaults.seeking),
    internalTime: private_writable(defaults.internalTime),
    volume: writable(defaults.volume),
    live: writable(defaults.live),
    aspectRatio: writable('16:9'),
    playsinline: writable(true),
    controls: writable(true),
    autoplay: writable(false),
    loop: writable(false),
    canAutoplay: private_writable(false),
    canMutedAutoplay: private_writable(false),
    active: derived(currentPlayer, $currentPlayer => $currentPlayer === player),
    progress: derived(
      [currentTime, duration, buffered],
      ([$currentTime, $duration, $buffered]) => ({
        played: {
          seconds: $currentTime,
          percent: ($currentTime / $duration) * 100
        },
        buffered: {
          seconds: $buffered,
          percent: ($buffered / $duration) * 100
        }
      })
    ),
    state: derived(
      [started, ended, paused, buffering, playbackReady],
      ([$started, $ended, $paused, $buffering, $playbackReady]) => {
        if ($ended) {
          return PlayerState.ENDED
        } else if ($started && $buffering) {
          return PlayerState.BUFFERING
        } else if ($started && $paused) {
          return PlayerState.PAUSED
        } else if ($started) {
          return PlayerState.PLAYING
        } else if ($playbackReady) {
          return PlayerState.CUED
        } else {
          return PlayerState.IDLE
        }
      }
    )
  }
}

// NOTE: not all events are fired here, some are fired directly from the player
// Events not fired here: SEEKED, REBUILD_START, REBUILD_END.
const dispatchPlayerEvents = store => {
  const dispatch = createEventDispatcher()
  subscribe_and_dispatch(store.src, PlayerEvent.SRC_CHANGE)
  subscribe_and_dispatch(store.title, PlayerEvent.TITLE_CHANGE)
  subscribe_and_dispatch(store.duration, PlayerEvent.DURATION_CHANGE)
  subscribe_and_dispatch(store.currentTime, PlayerEvent.TIME_UPDATE)
  subscribe_and_dispatch(store.rate, PlayerEvent.RATE_CHANGE)
  subscribe_and_dispatch(store.rates, PlayerEvent.RATES_CHANGE)
  subscribe_and_dispatch(store.quality, PlayerEvent.QUALITY_CHANGE)
  subscribe_and_dispatch(store.qualities, PlayerEvent.QUALITIES_CHANGE)
  subscribe_and_dispatch(store.volume, PlayerEvent.VOLUME_CHANGE)
  subscribe_and_dispatch(store.muted, PlayerEvent.MUTE_CHANGE)
  subscribe_and_dispatch(store.poster, PlayerEvent.POSTER_CHANGE)
  subscribe_and_dispatch(store.buffered, PlayerEvent.BUFFERED)
  subscribe_and_dispatch(store.pipActive, PlayerEvent.PIP_CHANGE)
  subscribe_and_dispatch(store.mediaType, PlayerEvent.MEDIA_TYPE_CHANGE)
  subscribe_and_dispatch(store.fullscreenActive, PlayerEvent.FULLSCREEN_CHANGE)
  subscribe_and_dispatch(store.state, PlayerEvent.STATE_CHANGE)
  subscribe_and_dispatch(store.progress, PlayerEvent.PROGRESS_UPDATE)
  subscribe_and_dispatch(store.active, PlayerEvent.ACTIVE_CHANGE)
  subscribe_and_dispatch_if_true(store.buffering, PlayerEvent.BUFFERING)
  subscribe_and_dispatch_if_true(store.started, PlayerEvent.PLAYBACK_STARTED)
  subscribe_and_dispatch_if_true(store.ended, PlayerEvent.PLAYBACK_ENDED)
  subscribe_and_dispatch_if_true(store.ready, PlayerEvent.READY)
  subscribe_and_dispatch_if_true(store.playbackReady, PlayerEvent.PLAYBACK_READY)
  subscribe_and_dispatch_if_true(store.seeking, PlayerEvent.SEEKING)
  subscribe_and_dispatch_if_true(store.playing, PlayerEvent.PLAYING)
  subscribe(store.paused, $p => $p ? dispatch(PlayerEvent.PAUSE) : dispatch(PlayerEvent.PLAY))
}

const resetStore = store => {
  const defaults = playerDefaults()
  Object.keys(defaults)
    .forEach(prop => store[prop] && store[prop].set(defaults[prop]))
}

const fillStore = async store => {
  store.canAutoplay.set(await can_autoplay(false))
  store.canMutedAutoplay.set(await can_autoplay(true))
}

export const bindPlayerStoreToComponent = () => {
  const player = get_current_component()
  const store = buildPlayerStore(player)
  fillStore(store)
  dispatchPlayerEvents(store)
  const onPropsChange = map_store_to_component(store)
  return {
    store,
    onPropsChange,
    resetStore: () => resetStore(store)
  }
}
