import { EventEmitter } from '@stencil/core';

import { PlayerProp, PlayerProps } from './PlayerProps';

export const LOAD_START_EVENT = 'vmLoadStart';

// Events that toggle state and the prop is named `is{PropName}...`.
const isToggleStateEvent = new Set<PlayerProp>([
  'isFullscreenActive',
  'isControlsActive',
  'isTextTrackVisible',
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
  // Example: isFullscreenActive -> vmFullscreenChange
  if (isToggleStateEvent.has(prop)) {
    return `vm${prop.replace('is', '').replace('Active', '')}Change` as any;
  }

  // Example: playbackStarted -> vmPlaybackStarted
  if (hasShortenedEventName.has(prop)) {
    return `vm${prop.charAt(0).toUpperCase()}${prop.slice(1)}` as any;
  }

  // Example: currentTime -> vmCurrentTimeChange
  return `vm${prop.charAt(0).toUpperCase()}${prop.slice(1)}Change` as any;
};

export function firePlayerEvent<P extends keyof PlayerProps>(
  el: HTMLElement,
  prop: P,
  newValue: PlayerProps[P],
  oldValue: PlayerProps[P],
) {
  const events: CustomEvent[] = [];
  events.push(new CustomEvent(getEventName(prop), { detail: newValue }));
  if (prop === 'paused' && !newValue) events.push(new CustomEvent('vmPlay'));
  if (prop === 'seeking' && oldValue && !newValue)
    events.push(new CustomEvent('vmSeeked'));
  events.forEach(event => {
    el.dispatchEvent(event);
  });
}

export type PlayerEvent = keyof PlayerEvents;

export interface PlayerEvents {
  /**
   * Emitted when the `theme` prop changes value.
   */
  vmThemeChange: EventEmitter<PlayerProps['theme']>;

  /**
   * Emitted when the `paused` prop changes value.
   */
  vmPausedChange: EventEmitter<PlayerProps['paused']>;

  /**
   * Emitted when the media is transitioning from `paused` to `playing`. Event flow: `paused` ->
   * `play` -> `playing`. The media starts `playing` once enough content has buffered to
   * begin/resume playback.
   */
  vmPlay: EventEmitter<void>;

  /**
   * Emitted when the `playing` prop changes value.
   */
  vmPlayingChange: EventEmitter<PlayerProps['playing']>;

  /**
   * Emitted when the `seeking` prop changes value.
   */
  vmSeekingChange: EventEmitter<PlayerProps['seeking']>;

  /**
   * Emitted directly after the player has successfully transitioned/seeked to a new time position.
   * Event flow: `seeking` -> `seeked`.
   */
  vmSeeked: EventEmitter<void>;

  /**
   * Emitted when the `buffering` prop changes value.
   */
  vmBufferingChange: EventEmitter<PlayerProps['buffering']>;

  /**
   * Emitted when the `duration` prop changes value.
   */
  vmDurationChange: EventEmitter<PlayerProps['duration']>;

  /**
   * Emitted when the `currentTime` prop changes value.
   */
  vmCurrentTimeChange: EventEmitter<PlayerProps['currentTime']>;

  /**
   * Emitted when the player has loaded and is ready to be interacted with.
   */
  vmReady: EventEmitter<void>;

  /**
   * Emitted when an any error has occurred within the player.
   */
  vmError: EventEmitter<any>;

  /**
   * Emitted when the media is ready to begin playback. The following props are guaranteed to be
   * defined when this fires: `mediaTitle`, `currentSrc`, `currentPoster`, `duration`, `mediaType`,
   * `viewType`.
   */
  vmPlaybackReady: EventEmitter<void>;

  /**
   * Emitted when the media initiates playback.
   */
  vmPlaybackStarted: EventEmitter<void>;

  /**
   * Emitted when playback reaches the end of the media.
   */
  vmPlaybackEnded: EventEmitter<void>;

  /**
   * Emitted when the `buffered` prop changes value.
   */
  vmBufferedChange: EventEmitter<PlayerProps['buffered']>;

  /**
   * Emitted when the `currentProvider` prop changes value.
   */
  vmCurrentProviderChange: EventEmitter<PlayerProps['currentProvider']>;

  /**
   * Emitted when the `currentSrc` prop changes value.
   */
  vmCurrentSrcChange: EventEmitter<PlayerProps['currentSrc']>;

  /**
   * Emitted when the `currentPoster` prop changes value.
   */
  vmCurrentPosterChange: EventEmitter<PlayerProps['currentPoster']>;

  /**
   * Emitted when the `mediaTitle` prop changes value.
   */
  vmMediaTitleChange: EventEmitter<PlayerProps['mediaTitle']>;

  /**
   * Emitted when the provider starts loading a media resource.
   */
  vmLoadStart: EventEmitter<void>;

  /**
   * Emitted when the `playbackRate` prop changes value.
   */
  vmPlaybackRateChange: EventEmitter<PlayerProps['playbackRate']>;

  /**
   * Emitted when the `playbackRates` prop changes value.
   */
  vmPlaybackRatesChange: EventEmitter<PlayerProps['playbackRates']>;

  /**
   *
   * Emitted when the `playbackQuality` prop changes value.
   */
  vmPlaybackQualityChange: EventEmitter<PlayerProps['playbackQuality']>;

  /**
   * Emitted when the `playbackQualities` prop changes value.
   */
  vmPlaybackQualitiesChange: EventEmitter<PlayerProps['playbackQualities']>;

  /**
   * Emitted when the `muted` prop changes value.
   */
  vmMutedChange: EventEmitter<PlayerProps['muted']>;

  /**
   * Emitted when the `volume` prop changes value.
   */
  vmVolumeChange: EventEmitter<PlayerProps['volume']>;

  /**
   * Emitted when the `mediaType` prop changes value.
   */
  vmMediaTypeChange: EventEmitter<PlayerProps['mediaType']>;

  /**
   * Emitted when the `viewType` prop changes value.
   */
  vmViewTypeChange: EventEmitter<PlayerProps['viewType']>;

  /**
   * Emitted when the `isControlsActive` prop changes value.
   */
  vmControlsChange: EventEmitter<PlayerProps['isControlsActive']>;

  /**
   * Emitted when the `isLive` prop changes value.
   */
  vmLiveChange: EventEmitter<PlayerProps['isLive']>;

  /**
   * Emitted when the `isTouch` prop changes value.
   */
  vmTouchChange: EventEmitter<PlayerProps['isTouch']>;

  /**
   * Emitted when the `language` prop changes value.
   */
  vmLanguageChange: EventEmitter<PlayerProps['language']>;

  /**
   * Emitted when the `languages` prop changes value.
   */
  vmLanguagesChange: EventEmitter<PlayerProps['languages']>;

  /**
   * Emitted when the `i18n` prop changes value.
   */
  vmI18nChange: EventEmitter<PlayerProps['i18n']>;

  /**
   * Emitted when the `translations` prop changes value.
   */
  vmTranslationsChange: EventEmitter<PlayerProps['translations']>;

  /**
   * Emitted when the `isFullscreenActive` prop changes value.
   */
  vmFullscreenChange: EventEmitter<PlayerProps['isFullscreenActive']>;

  /**
   * Emitted when the `isPiPActive` prop changes value.
   */
  vmPiPChange: EventEmitter<PlayerProps['isPiPActive']>;

  /**
   * Emitted when the `textTracks` prop changes value.
   */
  vmTextTracksChange: EventEmitter<PlayerProps['textTracks']>;

  /**
   * Emitted when the `currentTextTrack` prop changes value.
   */
  vmCurrentTextTrackChange: EventEmitter<PlayerProps['currentTextTrack']>;

  /**
   * Emitted when the `isTextTrackVisible` prop changes value.
   */
  vmTextTrackVisibleChange: EventEmitter<PlayerProps['isTextTrackVisible']>;

  /**
   * Emitted when the `audioTracks` prop changes value.
   */
  vmAudioTracksChange: EventEmitter<PlayerProps['audioTracks']>;

  /**
   * Emitted when the `currentAudioTrack` prop changes value.
   */
  vmCurrentAudioTrackChange: EventEmitter<PlayerProps['currentAudioTrack']>;
}
