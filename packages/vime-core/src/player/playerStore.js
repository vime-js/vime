import { createEventDispatcher } from 'svelte';
import { writable, derived, get, readable } from 'svelte/store';
import { get_current_component, current_component } from 'svelte/internal';
import { currentPlayer } from './globalStore';
import PlayerEvent from './PlayerEvent';
import PlayerState from './PlayerState';
import MediaType from './MediaType';
import VideoQuality from './VideoQuality';

import {
  is_array, is_string, private_writable,
  map_store_to_component, can_autoplay, selectable_if,
  writable_if, subscribe, subscribe_and_dispatch,
  subscribe_and_dispatch_if_true, IS_MOBILE,
  private_writable_with_fallback, indexable
} from '@vime/utils';

// Player defaults used when the `src` changes or `resetStore`
const playerDefaults = () => ({
  paused: true,
  playing: false,
  seeking: false,
  internalTime: 0,
  currentTime: 0,
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
  mediaType: MediaType.NONE,
  pipActive: false,
  playbackReady: false,
  live: false,
  activeCues: []
});

const buildPlayerStore = player => {
  const store = {};
  const defaults = playerDefaults();

  store.canSetTrack = private_writable(false);
  store.canSetTracks = private_writable(false);
  store.canSetRate = private_writable(false);
  store.canSetPoster = private_writable(false);
  store.canSetPiP = private_writable(false);
  store.canSetFullscreen = private_writable(false);
  store.canSetQuality = private_writable(false);
  store.canAutoplay = private_writable(false);
  store.canMutedAutoplay = private_writable(false);

  store.src = writable(null);
  store.srcId = writable(null);
  store.provider = private_writable(null);
  store.currentSrc = private_writable_with_fallback(null, store.src);
  store.origin = private_writable(null);
  store.mediaType = private_writable(defaults.mediaType);
  store.audio = derived(store.mediaType, $mediaType => $mediaType === MediaType.AUDIO);
  store.video = derived(store.mediaType, $mediaType => $mediaType === MediaType.VIDEO);
  store.qualities = private_writable(defaults.qualities);
  store.rates = private_writable(defaults.rates);
  store.currentTime = writable(defaults.currentTime);
  store.duration = private_writable(defaults.duration);
  store.buffered = private_writable(defaults.buffered);
  store.started = private_writable(defaults.started);
  store.ended = private_writable(defaults.ended);
  store.buffering = private_writable(defaults.buffering);
  store.paused = writable(defaults.paused);
  store.playbackReady = private_writable(defaults.playbackReady);
  store.tracks = writable([]);
  store.currentTrack = indexable(store.tracks);
  store.captionsActive = derived(store.currentTrack, $currentTrack => $currentTrack !== -1);
  store.activeCues = private_writable(defaults.activeCues);
  store.poster = writable(null);
  store.pipActive = private_writable(defaults.pipActive);
  store.fullscreenActive = private_writable(false);
  store.autopause = writable(true);
  store.ready = private_writable(false);
  store.nativeMode = private_writable(true);
  store.title = private_writable(defaults.title);
  store.muted = writable(defaults.muted);
  store.quality = selectable_if(defaults.quality, store.qualities, store.canSetQuality);
  store.rate = selectable_if(defaults.rate, store.rates, store.canSetRate);
  store.playing = private_writable(defaults.playing);
  store.seeking = private_writable(defaults.seeking);
  store.internalTime = private_writable(defaults.internalTime);
  store.volume = writable_if(defaults.volume, !IS_MOBILE);
  store.live = writable(defaults.live);
  store.aspectRatio = writable('16:9');
  store.playsinline = writable(true);
  store.controlsEnabled = writable(true);
  store.autoplay = writable(false);
  store.loop = writable(false);
  store.videoView = derived(
    [store.poster, store.canSetPoster, store.video],
    ([$poster, $canSetPoster, $video]) => ($canSetPoster && is_string($poster)) || $video
  );
  store.active = derived(store.currentPlayer, $currentPlayer => $currentPlayer === player);
  store.progress = derived(
    [store.currentTime, store.duration, store.buffered],
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
  );
  store.state = derived(
    [store.started, store.ended, store.paused, store.buffering, store.playbackReady],
    ([$started, $ended, $paused, $buffering, $playbackReady]) => {
      if ($ended) {
        return PlayerState.ENDED;
      } else if ($started && $buffering) {
        return PlayerState.BUFFERING;
      } else if ($started && $paused) {
        return PlayerState.PAUSED;
      } else if ($started) {
        return PlayerState.PLAYING;
      } else if ($playbackReady) {
        return PlayerState.CUED;
      } else {
        return PlayerState.IDLE;
      }
    }
  );

  return store;
};

// NOTE: not all events are fired here, some are fired directly from the player.
// Events not fired here: SEEKED, REPLAY, REBUILD_START, REBUILD_END.
const dispatchPlayerEventsFromStore = store => {
  const dispatch = createEventDispatcher();
  subscribe_and_dispatch(store.src, PlayerEvent.SRC_CHANGE);
  subscribe_and_dispatch(store.currentSrc, PlayerEvent.CURRENT_SRC_CHANGE);
  subscribe_and_dispatch(store.provider, PlayerEvent.PROVIDER_CHANGE);
  subscribe_and_dispatch(store.title, PlayerEvent.TITLE_CHANGE);
  subscribe_and_dispatch(store.tracks, PlayerEvent.TRACKS_CHANGE);
  subscribe_and_dispatch(store.currentTrack, PlayerEvent.TRACK_CHANGE);
  subscribe_and_dispatch(store.activeCues, PlayerEvent.CUE_CHANGE);
  subscribe_and_dispatch(store.captionsActive, PlayerEvent.CAPTIONS_CHANGE);
  subscribe_and_dispatch(store.duration, PlayerEvent.DURATION_CHANGE);
  subscribe_and_dispatch(store.currentTime, PlayerEvent.TIME_UPDATE);
  subscribe_and_dispatch(store.rate, PlayerEvent.RATE_CHANGE);
  subscribe_and_dispatch(store.rates, PlayerEvent.RATES_CHANGE);
  subscribe_and_dispatch(store.quality, PlayerEvent.QUALITY_CHANGE);
  subscribe_and_dispatch(store.qualities, PlayerEvent.QUALITIES_CHANGE);
  subscribe_and_dispatch(store.videoView, PlayerEvent.VIEWING_MODE_CHANGE);
  subscribe_and_dispatch(store.volume, PlayerEvent.VOLUME_CHANGE);
  subscribe_and_dispatch(store.origin, PlayerEvent.ORIGIN_CHANGE);
  subscribe_and_dispatch(store.muted, PlayerEvent.MUTE_CHANGE);
  subscribe_and_dispatch(store.poster, PlayerEvent.POSTER_CHANGE);
  subscribe_and_dispatch(store.buffered, PlayerEvent.BUFFERED);
  subscribe_and_dispatch(store.pipActive, PlayerEvent.PIP_CHANGE);
  subscribe_and_dispatch(store.mediaType, PlayerEvent.MEDIA_TYPE_CHANGE);
  subscribe_and_dispatch(store.fullscreenActive, PlayerEvent.FULLSCREEN_CHANGE);
  subscribe_and_dispatch(store.state, PlayerEvent.STATE_CHANGE);
  subscribe_and_dispatch(store.progress, PlayerEvent.PROGRESS);
  subscribe_and_dispatch(store.active, PlayerEvent.ACTIVE_CHANGE);
  subscribe_and_dispatch(store.buffering, PlayerEvent.BUFFERING);
  subscribe_and_dispatch(store.live, PlayerEvent.LIVE);
  subscribe_and_dispatch_if_true(store.started, PlayerEvent.PLAYBACK_START);
  subscribe_and_dispatch_if_true(store.ended, PlayerEvent.PLAYBACK_END);
  subscribe_and_dispatch_if_true(store.ready, PlayerEvent.READY);
  subscribe_and_dispatch_if_true(store.playbackReady, PlayerEvent.PLAYBACK_READY);
  subscribe_and_dispatch_if_true(store.seeking, PlayerEvent.SEEKING);
  subscribe_and_dispatch_if_true(store.playing, PlayerEvent.PLAYING);
  subscribe(store.paused, $p => $p ? dispatch(PlayerEvent.PAUSE) : dispatch(PlayerEvent.PLAY));
};

const resetStore = store => {
  const defaults = playerDefaults();
  Object.keys(defaults)
    .forEach(prop => store[prop] && store[prop].set(defaults[prop]));
};

const fillStore = async store => {
  store.canAutoplay.set(await can_autoplay(false));
  store.canMutedAutoplay.set(await can_autoplay(true));
};

export const mapPlayerStoreToComponent = () => {
  const player = get_current_component();
  const store = buildPlayerStore(player);
  fillStore(store);
  dispatchPlayerEventsFromStore(store);
  const onPropsChange = map_store_to_component(player, store);
  return {
    store,
    onPropsChange,
    resetStore: () => resetStore(store)
  };
};
