import { createEventDispatcher } from 'svelte';
import { writable, derived } from 'svelte/store';
import { get_current_component } from 'svelte/internal';
import { currentPlayer } from './globalStore';
import PlayerState from './PlayerState';
import MediaType from './MediaType';
import VideoQuality from './VideoQuality';

import {
  private_writable, map_store_to_component, can_autoplay, 
  selectable_if, writable_if, IS_MOBILE,
  indexable, private_writable_if, is_function
} from '@vime/utils';

// Player defaults used when the `src` changes or `resetStore` is called.
const playerDefaults = () => ({
  paused: true,
  playing: false,
  seeking: false,
  rebuilding: false,
  internalTime: 0,
  currentTime: 0,
  volume: 30,
  title: '',
  duration: 0,
  buffered: 0,
  srcId: null,
  currentSrc: null,
  buffering: false,
  videoQuality: VideoQuality.UNKNOWN,
  videoQualities: [],
  playbackRate: 1,
  playbackRates: [1],
  playbackStarted: false,
  playbackEnded: false,
  playbackReady: false,
  live: false,
  activeCues: []
});

const buildPlayerStore = player => {
  const store = {};
  const defaults = playerDefaults();

  store.ready = private_writable(false);
  store.playbackReady = private_writable(defaults.playbackReady);
  store.rebuilding = private_writable_if(defaults.rebuilding, store.playbackReady);
  store.canAutoplay = private_writable(false);
  store.canMutedAutoplay = private_writable(false);
  store.canInteract = derived(
    [store.playbackReady, store.rebuilding],
    ([$playbackReady, $rebuilding]) => $playbackReady && !$rebuilding
  );

  // --------------------------------------------------------------
  // Src
  // --------------------------------------------------------------

  store.src = writable(null);
  store.srcId = private_writable(defaults.srcId);
  store.poster = writable(null);
  store.provider = private_writable(null);
  store.origin = private_writable(null);
  store.title = private_writable(defaults.title);
  store.currentSrc = private_writable(defaults.currentSrc);

  store.canSetPoster = derived(
    store.provider,
    $provider => $provider && is_function($provider.setPoster)
  );

  // --------------------------------------------------------------
  // Metadata
  // --------------------------------------------------------------

  store.live = private_writable(false);
  store.mediaType = private_writable(MediaType.NONE);
  store.audio = derived(store.mediaType, $mediaType => $mediaType === MediaType.AUDIO);
  store.video = derived(store.mediaType, $mediaType => $mediaType === MediaType.VIDEO);
  store.playbackRates = private_writable(defaults.playbackRates);
  store.videoQualities = private_writable(defaults.videoQualities);
  store.duration = private_writable(defaults.duration);

  // Used by @vime/player.
  store._posterPlugin = writable(false);
  store.videoView = derived(
    [store.poster, store.canSetPoster, store._posterPlugin, store.video],
    ([$poster, $canSetPoster, $plugin, $video]) => 
      (($canSetPoster || $plugin) && !!$poster) || $video
  );

  store.videoReady = derived(
    [store.playbackReady, store.videoView],
    ([$playbackReady, $videoView]) => $playbackReady && $videoView
  );

  // --------------------------------------------------------------
  // Playback
  // --------------------------------------------------------------

  store.canSetPlaybackRate = derived(
    [store.provider, store.playbackRates],
    ([$provider, $playbackRates]) => 
      $provider && $playbackRates.length > 1 && is_function($provider.setPlaybackRate)
  );

  store.canSetVideoQuality = derived(
    [store.provider, store.video, store.videoQualities],
    ([$provider, $video, $videoQualities]) => 
      $provider && $video && $videoQualities.length > 0 && is_function($provider.setVideoQuality)
  );

  store.paused = writable(defaults.paused);
  store.playbackRate = selectable_if(defaults.playbackRate, store.playbackRates, store.canSetPlaybackRate);
  store.videoQuality = selectable_if(defaults.videoQuality, store.videoQualities, store.canSetVideoQuality);
  store.currentTime = writable(defaults.currentTime);
  store.internalTime = private_writable(defaults.internalTime);
  store.muted = writable(false);
  store.volume = writable_if(defaults.volume, !IS_MOBILE);
  store.buffered = private_writable(defaults.buffered);
  store.controlsEnabled = writable(true);

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

  // --------------------------------------------------------------
  // State
  // --------------------------------------------------------------

  store.playing = private_writable(defaults.playing);
  store.buffering = private_writable(defaults.buffering);
  store.playbackEnded = private_writable(defaults.playbackEnded);
  store.playbackStarted = private_writable(defaults.playbackStarted);
  store.seeking = private_writable(defaults.seeking);
  store.active = derived(store.currentPlayer, $currentPlayer => $currentPlayer === player);

  store.state = derived(
    [store.playbackStarted, store.playbackEnded, store.paused, store.buffering, store.playbackReady],
    ([$playbackStarted, $playbackEnded, $paused, $buffering, $playbackReady]) => {
      if ($playbackEnded) {
        return PlayerState.ENDED;
      } else if ($buffering) {
        return PlayerState.BUFFERING;
      } else if ($playbackStarted && $paused) {
        return PlayerState.PAUSED;
      } else if ($playbackStarted) {
        return PlayerState.PLAYING;
      } else if ($playbackReady) {
        return PlayerState.CUED;
      } else {
        return PlayerState.IDLE;
      }
    }
  );

  // --------------------------------------------------------------
  // Captions
  // --------------------------------------------------------------

  store.canSetTracks = derived(
    store.provider,
    $provider => $provider && is_function($provider.setTracks)
  );
 
  // No needs to block writing of `tracks` as it might be stored and used by a provider when possible.
  store.tracks = writable([]);

  store.canSetTrack = derived(
    [store.provider, store.tracks],
    ([$provider, $tracks]) => $provider && $tracks.length > 0 && is_function($provider.setTrack)
  );

  // Can't block current track with `canSetTrack` because it'll stop @vime/player from updating
  // the value when a plugin is managing captions.
  store.currentTrack = indexable(store.tracks);
  store.activeCues = private_writable(defaults.activeCues);

  store.captionsActive = derived(
    [store.playbackReady, store.currentTrack], 
    ([$playbackReady, $currentTrack]) => $playbackReady && ($currentTrack !== -1)
  );

  // --------------------------------------------------------------
  // Picture in Picture
  // --------------------------------------------------------------

  store.canSetPiP = derived(
    [store.videoReady, store.provider],
    ([$videoReady, $provider]) => 
      $videoReady && $provider && $provider.supportsPiP() && is_function($provider.setPiP)
  );

  store.pipActive = private_writable(false);
  
  // --------------------------------------------------------------
  // Fullscreen
  // --------------------------------------------------------------

  // Set in the Player.
  store.canSetFullscreen = private_writable(false);
  store.fullscreenActive = private_writable(false);

  // --------------------------------------------------------------
  // Options
  // --------------------------------------------------------------

  store.autopause = writable(true);
  store.nativeMode = writable(true);
  store.aspectRatio = writable('16:9');
  store.playsinline = writable(true);
  store.autoplay = writable(false);
  store.loop = writable(false);

  return store;
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
  const onPropsChange = map_store_to_component(player, store);
  return {
    store,
    onPropsChange,
    resetStore: () => resetStore(store)
  };
};
