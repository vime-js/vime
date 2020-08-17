import { EventEmitter } from '@stencil/core';
import { PlayerProp, PlayerProps } from './PlayerProp';

// Events that toggle state and the prop is named `is{PropName}Active`.
const isToggleStateEvent = new Set([
  PlayerProp.IsFullscreenActive,
  PlayerProp.IsControlsActive,
  PlayerProp.IsPiPActive,
  PlayerProp.IsLive,
  PlayerProp.IsTouch,
  PlayerProp.IsAudio,
  PlayerProp.IsVideo,
  PlayerProp.IsAudioView,
  PlayerProp.IsVideoView,
]);

// Events that are emitted without the 'Change' postfix.
const hasShortenedEventName = new Set([
  PlayerProp.Ready,
  PlayerProp.PlaybackStarted,
  PlayerProp.PlaybackEnded,
  PlayerProp.PlaybackReady,
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
  PausedChange = 'vPausedChange',
  Play = 'vPlay',
  PlayingChange = 'vPlayingChange',
  SeekingChange = 'vSeekingChange',
  Seeked = 'vSeeked',
  MutedChange = 'vMutedChange',
  BufferingChange = 'vBufferingChange',
  DurationChange = 'vDurationChange',
  CurrentTimeChange = 'vCurrentTimeChange',
  Ready = 'vReady',
  PlaybackReady = 'vPlaybackReady',
  PlaybackStarted = 'vPlaybackStarted',
  PlaybackEnded = 'vPlaybackEnded',
  BufferedChange = 'vBufferedChange',
  CurrentSrcChange = 'vCurrentSrcChange',
  CurrentPosterChange = 'vCurrentPosterChange',
  MediaTitleChange = 'vMediaTitleChange',
  ErrorsChange = 'vErrorsChange',
  TextTracksChange = 'vTextTracksChange',
  LoadStart = 'vLoadStart',
  PlaybackRateChange = 'vPlaybackRateChange',
  PlaybackRatesChange = 'vPlaybackRatesChange',
  PlaybackQualityChange = 'vPlaybackQualityChange',
  PlaybackQualitiesChange = 'vPlaybackQualitiesChange',
  VolumeChange = 'vVolumeChange',
  MediaTypeChange = 'vMediaTypeChange',
  ViewTypeChange = 'vViewTypeChange',
  ControlsChange = 'vControlsChange',
  LiveChange = 'vLiveChange',
  TouchChange = 'vTouchChange',
  LanguageChange = 'vLanguageChange',
  LanguagesChange = 'vLanguagesChange',
  FullscreenChange = 'vFullscreenChange',
  PiPChange = 'vPiPChange'
}

export interface PlayerEvents {
  /**
   * Emitted when the `paused` prop changes value.
   */
  [PlayerEvent.PausedChange]: EventEmitter<PlayerProps[PlayerProp.Paused]>

  /**
   * Emitted when the media is transitioning from `paused` to `playing`. Event flow: `paused` ->
   * `play` -> `playing`. The media starts `playing` once enough content has buffered to
   * begin/resume playback.
   */
  [PlayerEvent.Play]: EventEmitter<void>

  /**
   * Emitted when the `playing` prop changes value.
   */
  [PlayerEvent.PlayingChange]: EventEmitter<PlayerProps[PlayerProp.Playing]>

  /**
   * Emitted when the `seeking` prop changes value.
   */
  [PlayerEvent.SeekingChange]: EventEmitter<PlayerProps[PlayerProp.Seeking]>

  /**
   * Emitted directly after the player has successfully transitioned/seeked to a new time position.
   * Event flow: `seeking` -> `seeked`.
   */
  [PlayerEvent.Seeked]: EventEmitter<void>

  /**
   * Emitted when the `buffering` prop changes value.
   */
  [PlayerEvent.BufferingChange]: EventEmitter<PlayerProps[PlayerProp.Buffering]>

  /**
   * Emitted when the `duration` prop changes value.
   */
  [PlayerEvent.DurationChange]: EventEmitter<PlayerProps[PlayerProp.Duration]>

  /**
   * Emitted when the `currentTime` prop changes value.
   */
  [PlayerEvent.CurrentTimeChange]: EventEmitter<PlayerProps[PlayerProp.CurrentTime]>

  /**
   * Emitted when the player has loaded and is ready to be interacted with.
   */
  [PlayerEvent.Ready]: EventEmitter<void>;

  /**
   * Emitted when the media is ready to begin playback. The following props are guaranteed to be
   * defined when this fires: `mediaTitle`, `currentSrc`, `currentPoster`, `duration`, `mediaType`,
   * `viewType`.
   */
  [PlayerEvent.PlaybackReady]: EventEmitter<void>;

  /**
   * Emitted when the media initiates playback.
   */
  [PlayerEvent.PlaybackStarted]: EventEmitter<void>

  /**
   * Emitted when playback reaches the end of the media.
   */
  [PlayerEvent.PlaybackEnded]: EventEmitter<void>

  /**
   * Emitted when the `buffered` prop changes value.
   */
  [PlayerEvent.BufferedChange]: EventEmitter<PlayerProps[PlayerProp.Buffered]>

  /**
   * Emitted when the `currentSrc` prop changes value.
   */
  [PlayerEvent.CurrentSrcChange]: EventEmitter<PlayerProps[PlayerProp.CurrentSrc]>

  /**
   * Emitted when the `currentPoster` prop changes value.
   */
  [PlayerEvent.CurrentPosterChange]: EventEmitter<PlayerProps[PlayerProp.CurrentPoster]>

  /**
   * Emitted when the `mediaTitle` prop changes value.
   */
  [PlayerEvent.MediaTitleChange]: EventEmitter<PlayerProps[PlayerProp.MediaTitle]>

  /**
   * Emitted when the `errors` prop changes value.
   */
  [PlayerEvent.ErrorsChange]: EventEmitter<PlayerProps[PlayerProp.Errors]>

  /**
   * Emitted when the `textTracks` prop changes value.
   */
  [PlayerEvent.TextTracksChange]: EventEmitter<PlayerProps[PlayerProp.TextTracks]>

  /**
   * Emitted when the provider starts loading a media resource.
   */
  [PlayerEvent.LoadStart]: EventEmitter<void>

  /**
   * Emitted when the `playbackRate` prop changes value.
   */
  [PlayerEvent.PlaybackRateChange]: EventEmitter<PlayerProps[PlayerProp.PlaybackRate]>

  /**
   * Emitted when the `playbackRates` prop changes value.
   */
  [PlayerEvent.PlaybackRatesChange]: EventEmitter<PlayerProps[PlayerProp.PlaybackRates]>

  /**
   *
   * Emitted when the `playbackQuality` prop changes value.
   */
  [PlayerEvent.PlaybackQualityChange]: EventEmitter<PlayerProps[PlayerProp.PlaybackQuality]>

  /**
   * Emitted when the `playbackQualities` prop changes value.
   */
  [PlayerEvent.PlaybackQualitiesChange]: EventEmitter<PlayerProps[PlayerProp.PlaybackQualities]>

  /**
   * Emitted when the `muted` prop changes value.
   */
  [PlayerEvent.MutedChange]: EventEmitter<PlayerProps[PlayerProp.Muted]>

  /**
   * Emitted when the `volume` prop changes value.
   */
  [PlayerEvent.VolumeChange]: EventEmitter<PlayerProps[PlayerProp.Volume]>

  /**
   * Emitted when the `mediaType` prop changes value.
   */
  [PlayerEvent.MediaTypeChange]: EventEmitter<PlayerProps[PlayerProp.MediaType]>

  /**
   * Emitted when the `viewType` prop changes value.
   */
  [PlayerEvent.ViewTypeChange]: EventEmitter<PlayerProps[PlayerProp.ViewType]>

  /**
   * Emitted when the `isControlsActive` prop changes value.
   */
  [PlayerEvent.ControlsChange]: EventEmitter<PlayerProps[PlayerProp.IsControlsActive]>

  /**
   * Emitted when the `isLive` prop changes value.
   */
  [PlayerEvent.LiveChange]: EventEmitter<PlayerProps[PlayerProp.IsLive]>

  /**
   * Emitted when the `isTouch` prop changes value.
   */
  [PlayerEvent.TouchChange]: EventEmitter<PlayerProps[PlayerProp.IsTouch]>

  /**
   * Emitted when the `language` prop changes value.
   */
  [PlayerEvent.LanguageChange]: EventEmitter<PlayerProps[PlayerProp.Language]>

  /**
   * Emitted when the `languages` prop changes value.
   */
  [PlayerEvent.LanguagesChange]: EventEmitter<PlayerProps[PlayerProp.Languages]>

  /**
   * Emitted when the `isFullscreenActive` prop changes value.
   */
  [PlayerEvent.FullscreenChange]: EventEmitter<PlayerProps[PlayerProp.IsFullscreenActive]>

  /**
   * Emitted when the `isPiPActive` prop changes value.
   */
  [PlayerEvent.PiPChange]: EventEmitter<PlayerProps[PlayerProp.IsPiPActive]>
}
