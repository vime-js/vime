import { createEventDispatcher } from 'svelte'
import { writable, derived, get, readable } from 'svelte/store'
import { get_current_component } from 'svelte/internal'
import PlayerEvent from './PlayerEvent'
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
const defaults = {
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
  quality: VideoQuality.UNKNOWN,
  qualities: [],
  rate: 1,
  rates: [1],
  started: false,
  ended: false,
  playbackReady: false,
  mediaType: MediaType.NONE,
  live: false
}

// TODO: add progress / state (stores + events), posterchange
// const state = derived([], ()), nativeMode
// $: shouldSetAspectRatio = _isVideo || !!poster

const buildPlayerStore = () => {
  const mediaType = writable(defaults.mediaType)
  const qualities = private_writable(defaults.qualities)
  const rates = private_writable(defaults.rates)

  return {
    src: writable(null),
    mediaType,
    audio: derived(mediaType, ($mediaType) => $mediaType === MediaType.AUDIO),
    video: derived(mediaType, ($mediaType) => $mediaType === MediaType.VIDEO),
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
    paused: writable(defaults.paused),
    muted: writable(defaults.muted),
    duration: private_writable(defaults.duration),
    buffered: private_writable(defaults.buffered),
    qualities,
    quality: selectable(defaults.quality, qualities),
    canSetQuality: writable(false),
    rates,
    rate: selectable(defaults.rate, rates),
    canSetRate: writable(false),
    started: private_writable(defaults.started),
    ended: private_writable(defaults.ended),
    buffering: private_writable(defaults.buffering),
    playing: private_writable(defaults.playing),
    seeking: private_writable(defaults.seeking),
    currentTime: writable(defaults.currentTime),
    internalTime: private_writable(defaults.internalTime),
    volume: writable(defaults.volume),
    playbackReady: private_writable(defaults.playbackReady),
    live: writable(defaults.live),
    aspectRatio: writable(null),
    playsinline: writable(true),
    controls: writable(true),
    autoplay: writable(false),
    loop: writable(false),
    canAutoplay: private_writable(false),
    canMutedAutoplay: private_writable(false)
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
  subscribe_and_dispatch(store.buffered, PlayerEvent.BUFFERED)
  subscribe_and_dispatch(store.pipActive, PlayerEvent.PIP_CHANGE)
  subscribe_and_dispatch(store.mediaType, PlayerEvent.MEDIA_TYPE_CHANGE)
  subscribe_and_dispatch(store.fullscreenActive, PlayerEvent.FULLSCREEN_CHANGE)
  subscribe_and_dispatch_if_true(store.buffering, PlayerEvent.BUFFERING)
  subscribe_and_dispatch_if_true(store.started, PlayerEvent.PLAYBACK_STARTED)
  subscribe_and_dispatch_if_true(store.ended, PlayerEvent.PLAYBACK_ENDED)
  subscribe_and_dispatch_if_true(store.ready, PlayerEvent.READY)
  subscribe_and_dispatch_if_true(store.playbackReady, PlayerEvent.PLAYBACK_READY)
  subscribe_and_dispatch_if_true(store.seeking, PlayerEvent.SEEKING)
  subscribe_and_dispatch_if_true(store.playing, PlayerEvent.PLAYING)
  subscribe(store.paused, $p => $p ? dispatch(PlayerEvent.PAUSE) : dispatch(PlayerEvent.PLAY))
}

const resetStore = store => Object
  .keys(defaults)
  .forEach(prop => store[prop] && store[prop].set(defaults[prop]))

const fillStore = async store => {
  store.canAutoplay.set(await can_autoplay(false))
  store.canMutedAutoplay.set(await can_autoplay(true))
}

export const bindPlayerStoreToComponent = () => {
  const player = get_current_component()
  const store = buildPlayerStore()
  fillStore(store)
  dispatchPlayerEvents(store)
  const onPropsChange = map_store_to_component(store)
  return {
    store,
    onPropsChange,
    resetStore: () => resetStore(store)
  }
}
