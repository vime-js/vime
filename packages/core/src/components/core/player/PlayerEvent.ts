import { EventEmitter } from '@stencil/core';
import { PlayerProp, PlayerProps } from './PlayerProp';

// Events that toggle state and the prop is named `is{PropName}Active`.
const isToggleStateEvent = new Set([
  PlayerProp.isFullscreenActive,
  PlayerProp.isControlsActive,
  PlayerProp.isPiPActive,
  PlayerProp.isLive,
  PlayerProp.isTouch,
  PlayerProp.isAudio,
  PlayerProp.isVideo,
  PlayerProp.isAudioView,
  PlayerProp.isVideoView,
]);

// Events that are emitted without the 'Change' postfix.
const hasShortenedEventName = new Set([
  PlayerProp.ready,
  PlayerProp.mounted,
  PlayerProp.destroyed,
  PlayerProp.playbackStarted,
  PlayerProp.playbackEnded,
  PlayerProp.playbackReady,
]);

export const getEventName = (prop: PlayerProp): PlayerEvent => {
  // Example: isFullscreenActive -> vFullscreenChange
  if (isToggleStateEvent.has(prop)) {
    return `v${prop.replace('is', '').replace('Active', '')}Change` as any;
  }

  // Example: playbackStarted -> vPlaybackStarted
  if (hasShortenedEventName.has(prop)) {
    return `v${prop.charAt(0).toUpperCase()}${prop.slice(1)}` as any;
  }

  // Example: currentTime -> vCurrentTimeChange
  return `v${prop.charAt(0).toUpperCase()}${prop.slice(1)}Change` as any;
};

export enum PlayerEvent {
  themeChange = 'vThemeChange',
  pausedChange = 'vPausedChange',
  play = 'vPlay',
  playingChange = 'vPlayingChange',
  seekingChange = 'vSeekingChange',
  seeked = 'vSeeked',
  mutedChange = 'vMutedChange',
  bufferingChange = 'vBufferingChange',
  durationChange = 'vDurationChange',
  currentTimeChange = 'vCurrentTimeChange',
  ready = 'vReady',
  mounted = 'vMounted',
  destroyed = 'vDestroyed',
  playbackReady = 'vPlaybackReady',
  playbackStarted = 'vPlaybackStarted',
  playbackEnded = 'vPlaybackEnded',
  bufferedChange = 'vBufferedChange',
  currentSrcChange = 'vCurrentSrcChange',
  currentPosterChange = 'vCurrentPosterChange',
  mediaTitleChange = 'vMediaTitleChange',
  errorsChange = 'vErrorsChange',
  textTracksChange = 'vTextTracksChange',
  loadStart = 'vLoadStart',
  playbackRateChange = 'vPlaybackRateChange',
  playbackRatesChange = 'vPlaybackRatesChange',
  playbackQualityChange = 'vPlaybackQualityChange',
  playbackQualitiesChange = 'vPlaybackQualitiesChange',
  volumeChange = 'vVolumeChange',
  mediaTypeChange = 'vMediaTypeChange',
  viewTypeChange = 'vViewTypeChange',
  controlsChange = 'vControlsChange',
  liveChange = 'vLiveChange',
  touchChange = 'vTouchChange',
  languageChange = 'vLanguageChange',
  languagesChange = 'vLanguagesChange',
  fullscreenChange = 'vFullscreenChange',
  pipChange = 'vPiPChange'
}

export interface PlayerEvents {
  /**
   * Emitted when the `theme` prop changes value.
   */
  [PlayerEvent.themeChange]: EventEmitter<PlayerProps[PlayerProp.theme]>;

  /**
   * Emitted when the `paused` prop changes value.
   */
  [PlayerEvent.pausedChange]: EventEmitter<PlayerProps[PlayerProp.paused]>

  /**
   * Emitted when the media is transitioning from `paused` to `playing`. Event flow: `paused` ->
   * `play` -> `playing`. The media starts `playing` once enough content has buffered to
   * begin/resume playback.
   */
  [PlayerEvent.play]: EventEmitter<void>

  /**
   * Emitted when the `playing` prop changes value.
   */
  [PlayerEvent.playingChange]: EventEmitter<PlayerProps[PlayerProp.playing]>

  /**
   * Emitted when the `seeking` prop changes value.
   */
  [PlayerEvent.seekingChange]: EventEmitter<PlayerProps[PlayerProp.seeking]>

  /**
   * Emitted directly after the player has successfully transitioned/seeked to a new time position.
   * Event flow: `seeking` -> `seeked`.
   */
  [PlayerEvent.seeked]: EventEmitter<void>

  /**
   * Emitted when the `buffering` prop changes value.
   */
  [PlayerEvent.bufferingChange]: EventEmitter<PlayerProps[PlayerProp.buffering]>

  /**
   * Emitted when the `duration` prop changes value.
   */
  [PlayerEvent.durationChange]: EventEmitter<PlayerProps[PlayerProp.duration]>

  /**
   * Emitted when the `currentTime` prop changes value.
   */
  [PlayerEvent.currentTimeChange]: EventEmitter<PlayerProps[PlayerProp.currentTime]>

  /**
   * Emitted when the player has loaded and is ready to be interacted with.
   */
  [PlayerEvent.ready]: EventEmitter<void>;

  /**
   * Emitted when the player has mounted the DOM.
   */
  [PlayerEvent.mounted]: EventEmitter<void>;

  /**
   * Emitted when the player has disconnected from the DOM and been destroyed.
   */
  [PlayerEvent.destroyed]: EventEmitter<void>;

  /**
   * Emitted when the media is ready to begin playback. The following props are guaranteed to be
   * defined when this fires: `mediaTitle`, `currentSrc`, `currentPoster`, `duration`, `mediaType`,
   * `viewType`.
   */
  [PlayerEvent.playbackReady]: EventEmitter<void>;

  /**
   * Emitted when the media initiates playback.
   */
  [PlayerEvent.playbackStarted]: EventEmitter<void>

  /**
   * Emitted when playback reaches the end of the media.
   */
  [PlayerEvent.playbackEnded]: EventEmitter<void>

  /**
   * Emitted when the `buffered` prop changes value.
   */
  [PlayerEvent.bufferedChange]: EventEmitter<PlayerProps[PlayerProp.buffered]>

  /**
   * Emitted when the `currentSrc` prop changes value.
   */
  [PlayerEvent.currentSrcChange]: EventEmitter<PlayerProps[PlayerProp.currentSrc]>

  /**
   * Emitted when the `currentPoster` prop changes value.
   */
  [PlayerEvent.currentPosterChange]: EventEmitter<PlayerProps[PlayerProp.currentPoster]>

  /**
   * Emitted when the `mediaTitle` prop changes value.
   */
  [PlayerEvent.mediaTitleChange]: EventEmitter<PlayerProps[PlayerProp.mediaTitle]>

  /**
   * Emitted when the `errors` prop changes value.
   */
  [PlayerEvent.errorsChange]: EventEmitter<PlayerProps[PlayerProp.errors]>

  /**
   * Emitted when the `textTracks` prop changes value.
   */
  [PlayerEvent.textTracksChange]: EventEmitter<PlayerProps[PlayerProp.textTracks]>

  /**
   * Emitted when the provider starts loading a media resource.
   */
  [PlayerEvent.loadStart]: EventEmitter<void>

  /**
   * Emitted when the `playbackRate` prop changes value.
   */
  [PlayerEvent.playbackRateChange]: EventEmitter<PlayerProps[PlayerProp.playbackRate]>

  /**
   * Emitted when the `playbackRates` prop changes value.
   */
  [PlayerEvent.playbackRatesChange]: EventEmitter<PlayerProps[PlayerProp.playbackRates]>

  /**
   *
   * Emitted when the `playbackQuality` prop changes value.
   */
  [PlayerEvent.playbackQualityChange]: EventEmitter<PlayerProps[PlayerProp.playbackQuality]>

  /**
   * Emitted when the `playbackQualities` prop changes value.
   */
  [PlayerEvent.playbackQualitiesChange]: EventEmitter<PlayerProps[PlayerProp.playbackQualities]>

  /**
   * Emitted when the `muted` prop changes value.
   */
  [PlayerEvent.mutedChange]: EventEmitter<PlayerProps[PlayerProp.muted]>

  /**
   * Emitted when the `volume` prop changes value.
   */
  [PlayerEvent.volumeChange]: EventEmitter<PlayerProps[PlayerProp.volume]>

  /**
   * Emitted when the `mediaType` prop changes value.
   */
  [PlayerEvent.mediaTypeChange]: EventEmitter<PlayerProps[PlayerProp.mediaType]>

  /**
   * Emitted when the `viewType` prop changes value.
   */
  [PlayerEvent.viewTypeChange]: EventEmitter<PlayerProps[PlayerProp.viewType]>

  /**
   * Emitted when the `isControlsActive` prop changes value.
   */
  [PlayerEvent.controlsChange]: EventEmitter<PlayerProps[PlayerProp.isControlsActive]>

  /**
   * Emitted when the `isLive` prop changes value.
   */
  [PlayerEvent.liveChange]: EventEmitter<PlayerProps[PlayerProp.isLive]>

  /**
   * Emitted when the `isTouch` prop changes value.
   */
  [PlayerEvent.touchChange]: EventEmitter<PlayerProps[PlayerProp.isTouch]>

  /**
   * Emitted when the `language` prop changes value.
   */
  [PlayerEvent.languageChange]: EventEmitter<PlayerProps[PlayerProp.language]>

  /**
   * Emitted when the `languages` prop changes value.
   */
  [PlayerEvent.languagesChange]: EventEmitter<PlayerProps[PlayerProp.languages]>

  /**
   * Emitted when the `isFullscreenActive` prop changes value.
   */
  [PlayerEvent.fullscreenChange]: EventEmitter<PlayerProps[PlayerProp.isFullscreenActive]>

  /**
   * Emitted when the `isPiPActive` prop changes value.
   */
  [PlayerEvent.pipChange]: EventEmitter<PlayerProps[PlayerProp.isPiPActive]>
}
