import { EventEmitter } from '@stencil/core';
import { PlayerProp, PlayerProps } from './PlayerProps';

// Events that toggle state and the prop is named `is{PropName}...`.
const isToggleStateEvent = new Set<PlayerProp>([
  'isFullscreenActive',
  'isControlsActive',
  'isPiPActive',
  'isLive',
  'isTouch',
  'isAudio',
  'isVideo',
  'isAudioView',
  'isVideoView',
]);

// Events that are emitted without the 'Change' postfix.
const hasShortenedEventName = new Set<PlayerProp>([
  'ready',
  'playbackStarted',
  'playbackEnded',
  'playbackReady',
]);

export const getEventName = (prop: PlayerProp): keyof PlayerEvents => {
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

export type PlayerEvent = keyof PlayerEvents;

export interface PlayerEvents {
  /**
   * Emitted when the player is attached/deattached from the DOM.
   */
  vAttachedChange: EventEmitter<void>;

  /**
   * Emitted when the `theme` prop changes value.
   */
  vThemeChange: EventEmitter<PlayerProps['theme']>;

  /**
   * Emitted when the `paused` prop changes value.
   */
  vPausedChange: EventEmitter<PlayerProps['paused']>

  /**
   * Emitted when the media is transitioning from `paused` to `playing`. Event flow: `paused` ->
   * `play` -> `playing`. The media starts `playing` once enough content has buffered to
   * begin/resume playback.
   */
  vPlay: EventEmitter<void>

  /**
   * Emitted when the `playing` prop changes value.
   */
  vPlayingChange: EventEmitter<PlayerProps['playing']>

  /**
   * Emitted when the `seeking` prop changes value.
   */
  vSeekingChange: EventEmitter<PlayerProps['seeking']>

  /**
   * Emitted directly after the player has successfully transitioned/seeked to a new time position.
   * Event flow: `seeking` -> `seeked`.
   */
  vSeeked: EventEmitter<void>

  /**
   * Emitted when the `buffering` prop changes value.
   */
  vBufferingChange: EventEmitter<PlayerProps['buffering']>

  /**
   * Emitted when the `duration` prop changes value.
   */
  vDurationChange: EventEmitter<PlayerProps['duration']>

  /**
   * Emitted when the `currentTime` prop changes value.
   */
  vCurrentTimeChange: EventEmitter<PlayerProps['currentTime']>

  /**
   * Emitted when the player has loaded and is ready to be interacted with.
   */
  vReady: EventEmitter<void>;

  /**
   * Emitted when the media is ready to begin playback. The following props are guaranteed to be
   * defined when this fires: `mediaTitle`, `currentSrc`, `currentPoster`, `duration`, `mediaType`,
   * `viewType`.
   */
  vPlaybackReady: EventEmitter<void>;

  /**
   * Emitted when the media initiates playback.
   */
  vPlaybackStarted: EventEmitter<void>

  /**
   * Emitted when playback reaches the end of the media.
   */
  vPlaybackEnded: EventEmitter<void>

  /**
   * Emitted when the `buffered` prop changes value.
   */
  vBufferedChange: EventEmitter<PlayerProps['buffered']>

  /**
   * Emitted when the `currentProvider` prop changes value.
   */
  vCurrentProviderChange: EventEmitter<PlayerProps['currentProvider']>

  /**
   * Emitted when the `currentSrc` prop changes value.
   */
  vCurrentSrcChange: EventEmitter<PlayerProps['currentSrc']>

  /**
   * Emitted when the `currentPoster` prop changes value.
   */
  vCurrentPosterChange: EventEmitter<PlayerProps['currentPoster']>

  /**
   * Emitted when the `mediaTitle` prop changes value.
   */
  vMediaTitleChange: EventEmitter<PlayerProps['mediaTitle']>

  /**
   * Emitted when the `errors` prop changes value.
   */
  vErrorsChange: EventEmitter<PlayerProps['errors']>

  /**
   * Emitted when the `textTracks` prop changes value.
   */
  vTextTracksChange: EventEmitter<PlayerProps['textTracks']>

  /**
   * Emitted when the provider starts loading a media resource.
   */
  vLoadStart: EventEmitter<void>

  /**
   * Emitted when the `playbackRate` prop changes value.
   */
  vPlaybackRateChange: EventEmitter<PlayerProps['playbackRate']>

  /**
   * Emitted when the `playbackRates` prop changes value.
   */
  vPlaybackRatesChange: EventEmitter<PlayerProps['playbackRates']>

  /**
   *
   * Emitted when the `playbackQuality` prop changes value.
   */
  vPlaybackQualityChange: EventEmitter<PlayerProps['playbackQuality']>

  /**
   * Emitted when the `playbackQualities` prop changes value.
   */
  vPlaybackQualitiesChange: EventEmitter<PlayerProps['playbackQualities']>

  /**
   * Emitted when the `muted` prop changes value.
   */
  vMutedChange: EventEmitter<PlayerProps['muted']>

  /**
   * Emitted when the `volume` prop changes value.
   */
  vVolumeChange: EventEmitter<PlayerProps['volume']>

  /**
   * Emitted when the `mediaType` prop changes value.
   */
  vMediaTypeChange: EventEmitter<PlayerProps['mediaType']>

  /**
   * Emitted when the `viewType` prop changes value.
   */
  vViewTypeChange: EventEmitter<PlayerProps['viewType']>

  /**
   * Emitted when the `isControlsActive` prop changes value.
   */
  vControlsChange: EventEmitter<PlayerProps['isControlsActive']>

  /**
   * Emitted when the `currentCaption` prop changes value.
   */
  vCurrentCaptionChange: EventEmitter<PlayerProps['currentCaption']>

  /**
   * Emitted when the `isLive` prop changes value.
   */
  vLiveChange: EventEmitter<PlayerProps['isLive']>

  /**
   * Emitted when the `isTouch` prop changes value.
   */
  vTouchChange: EventEmitter<PlayerProps['isTouch']>

  /**
   * Emitted when the `language` prop changes value.
   */
  vLanguageChange: EventEmitter<PlayerProps['language']>

  /**
   * Emitted when the `languages` prop changes value.
   */
  vLanguagesChange: EventEmitter<PlayerProps['languages']>

  /**
   * Emitted when the `i18n` prop changes value.
   */
  vI18nChange: EventEmitter<PlayerProps['i18n']>

  /**
   * Emitted when the `translations` prop changes value.
   */
  vTranslationsChange: EventEmitter<PlayerProps['translations']>

  /**
   * Emitted when the `isFullscreenActive` prop changes value.
   */
  vFullscreenChange: EventEmitter<PlayerProps['isFullscreenActive']>

  /**
   * Emitted when the `isPiPActive` prop changes value.
   */
  vPiPChange: EventEmitter<PlayerProps['isPiPActive']>
}
