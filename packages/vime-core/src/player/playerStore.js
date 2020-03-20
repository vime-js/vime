import { createEventDispatcher } from 'svelte';
import { writable, derived } from 'svelte/store';
import { currentPlayer } from './sharedStore';
import PlayerState from './PlayerState';
import MediaType from './MediaType';
import VideoQuality from './VideoQuality';

import {
  private_writable, map_store_to_component, can_autoplay,
  selectable_if, rangeable_if, IS_MOBILE,
  indexable, private_writable_if, is_function,
  rangeable
} from '@vime-js/utils';

// Player defaults used when the `src` changes or `resetStore` is called.
const playerDefaults = () => ({
  paused: true,
  playing: false,
  seeking: false,
  rebuilding: false,
  internalTime: 0,
  currentTime: 0,
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
  isLive: false,
  nativePoster: null,
  isControlsActive: true
});

const buildPlayerStore = player => {
  const store = {};
  const defaults = playerDefaults();

  store.playbackReady = private_writable(defaults.playbackReady);
  store.rebuilding = private_writable_if(defaults.rebuilding, store.playbackReady);
  store.canAutoplay = private_writable(false);
  store.canMutedAutoplay = private_writable(false);
  store.canInteract = derived(
    [store.playbackReady, store.rebuilding],
    ([$playbackReady, $rebuilding]) => $playbackReady && !$rebuilding
  );

  // --------------------------------------------------------------
  // Native
  // --------------------------------------------------------------

  store.useNativeView = writable(true);
  store.useNativeControls = writable(true);
  store.useNativeCaptions = writable(true);
  store.nativePoster = private_writable(defaults.nativePoster);

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

  store.mediaType = private_writable(MediaType.NONE);
  store.isAudio = derived(store.mediaType, $mediaType => $mediaType === MediaType.AUDIO);
  store.isVideo = derived(store.mediaType, $mediaType => $mediaType === MediaType.VIDEO);
  store.isLive = private_writable(false);
  store.playbackRates = private_writable(defaults.playbackRates);
  store.videoQualities = private_writable(defaults.videoQualities);
  store.duration = private_writable(defaults.duration);

  // Used by @vime-js/player.
  store._posterPlugin = writable(false);
  store.isVideoView = derived(
    [store.poster, store.nativePoster, store.canSetPoster, store._posterPlugin, store.isVideo],
    ([$poster, $nativePoster, $canSetPoster, $plugin, $isVideo]) =>
      !!(($canSetPoster || $plugin) && ($poster || $nativePoster)) || $isVideo
  );

  store.isVideoReady = derived(
    [store.playbackReady, store.isVideoView],
    ([$playbackReady, $isVideoView]) => $playbackReady && $isVideoView
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
    [store.provider, store.isVideo, store.videoQualities],
    ([$provider, $isVideo, $videoQualities]) =>
      $provider && $isVideo && $videoQualities.length > 0 && is_function($provider.setVideoQuality)
  );

  store.paused = writable(defaults.paused);
  store.playbackRate = selectable_if(defaults.playbackRate, store.playbackRates, store.canSetPlaybackRate);
  store.videoQuality = selectable_if(defaults.videoQuality, store.videoQualities, store.canSetVideoQuality);
  store.currentTime = rangeable(defaults.currentTime, 0, store.duration);
  store.internalTime = private_writable(defaults.internalTime);
  store.muted = writable(false);
  store.volume = rangeable_if(30, 0, 100, !IS_MOBILE);
  store.buffered = private_writable(defaults.buffered);
  store.isControlsEnabled = writable(true);
  store.isControlsActive = private_writable(defaults.isControlsActive);

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
  store.isPlayerActive = derived(currentPlayer, $currentPlayer => $currentPlayer === player);

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
  // Tracks
  // --------------------------------------------------------------

  store.canSetTracks = derived(
    store.provider,
    $provider => $provider && is_function($provider.setTracks)
  );

  // No needs to block writing of `tracks` as it might be stored and used by a provider when possible.
  store.tracks = writable([]);

  store.canSetTrack = derived(
    [store.provider, store.tracks],
    ([$provider, $tracks]) => $provider && $tracks && $tracks.length > 0 && is_function($provider.setTrack)
  );

  // Can't block current track with `canSetTrack` because it'll stop @vime-js/player from updating
  // the value when a plugin is managing captions.
  store.currentTrackIndex = indexable(store.tracks);

  store.currentTrack = derived(
    [store.tracks, store.currentTrackIndex],
    ([$tracks, $index]) => ($index >= 0) ? $tracks[$index] : null
  );

  store.isCaptionsActive = derived(
    [store.playbackReady, store.isAudio, store.currentTrackIndex],
    ([$playbackReady, $isAudio, $currentTrackIndex]) =>
      $playbackReady && !$isAudio && ($currentTrackIndex !== -1)
  );

  // TODO: add cues support (cues, currentCueIndex, currentCue, activeCues).

  // --------------------------------------------------------------
  // Picture in Picture
  // --------------------------------------------------------------

  store.canSetPiP = derived(
    [store.isVideoReady, store.provider],
    ([$isVideoReady, $provider]) =>
      $isVideoReady && $provider && $provider.supportsPiP() && is_function($provider.setPiP)
  );

  store.isPiPActive = private_writable(false);

  // --------------------------------------------------------------
  // Fullscreen
  // --------------------------------------------------------------

  // Set in the Player.
  store.canSetFullscreen = private_writable(false);
  store.isFullscreenActive = private_writable(false);

  // --------------------------------------------------------------
  // Options
  // --------------------------------------------------------------

  store.autopause = writable(true);
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

export const mapPlayerStoreToComponent = player => {
  const store = buildPlayerStore(player);
  fillStore(store);
  const onPropsChange = map_store_to_component(player, store);
  return {
    store,
    onPropsChange,
    resetStore: () => resetStore(store)
  };
};
