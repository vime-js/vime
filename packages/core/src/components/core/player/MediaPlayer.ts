import { ComponentInterface, EventEmitter } from '@stencil/core';
import { PlayerProp, PlayerProps } from './PlayerProps';
import { MediaProvider, MediaProviderAdapter } from '../../providers/MediaProvider';

/**
 * The core media player interface.
 *
 * @ref https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
 */
export interface MediaPlayer extends ComponentInterface, PlayerProps {
  // --------------------------------------------
  // Events
  // --------------------------------------------

  /**
   * Emitted when the `paused` prop changes value.
   */
  vPausedChange: EventEmitter<PlayerProps[PlayerProp.Paused]>

  /**
   * Emitted when the media is transitioning from `paused` to `playing`. Event flow: `vPaused` ->
   * `vPlay` -> `vPlaying`. The media starts `playing` once enough content has buffered to resume
   * playback.
   */
  vPlay: EventEmitter<void>

  /**
   * Emitted when the `playing` prop changes value.
   */
  vPlayingChange: EventEmitter<PlayerProps[PlayerProp.Playing]>

  /**
   * Emitted when the `seeking` prop changes value.
   */
  vSeekingChange: EventEmitter<PlayerProps[PlayerProp.Seeking]>

  /**
   * Emitted directly after the player has successfully transitioned/seeked to a new time position.
   * Event flow: `vSeeking` -> `vSeeked`.
   */
  vSeeked: EventEmitter<void>

  /**
   * Emitted when the `buffering` prop changes value.
   */
  vBufferingChange: EventEmitter<PlayerProps[PlayerProp.Buffering]>

  /**
   * Emitted when the `duration` prop changes value.
   */
  vDurationChange: EventEmitter<PlayerProps[PlayerProp.Duration]>

  /**
   * Emitted when the `currentTime` prop changes value.
   */
  vCurrentTimeChange: EventEmitter<PlayerProps[PlayerProp.CurrentTime]>

  /**
   * Emitted when the media is ready to begin playback.
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
  vBufferedChange: EventEmitter<PlayerProps[PlayerProp.Buffered]>

  /**
   * Emitted when the `currentSrc` prop changes value.
   */
  vCurrentSrcChange: EventEmitter<PlayerProps[PlayerProp.CurrentSrc]>

  /**
   * Emitted when the `mediaTitle` prop changes value.
   */
  vMediaTitleChange: EventEmitter<PlayerProps[PlayerProp.MediaTitle]>

  /**
   * Emitted when the `errors` prop changes value.
   */
  vErrorsChange: EventEmitter<PlayerProps[PlayerProp.Errors]>

  /**
   * Emitted when the `textTracks` prop changes value.
   */
  vTextTracksChange: EventEmitter<PlayerProps[PlayerProp.TextTracks]>

  /**
   * Emitted when the player starts loading a media resource.
   */
  vLoadStart: EventEmitter<void>

  /**
   * Emitted when the metadata for current media resource has loaded.
   */
  vLoadedMetadata: EventEmitter<void>;

  /**
   * Emitted when the `playbackRate` prop changes value.
   */
  vPlaybackRateChange: EventEmitter<PlayerProps[PlayerProp.PlaybackRate]>

  /**
   * Emitted when the `playbackRates` prop changes value.
   */
  vPlaybackRatesChange: EventEmitter<PlayerProps[PlayerProp.PlaybackRates]>

  /**
   *
   * Emitted when the `mediaQuality` prop changes value.
   */
  vMediaQualityChange: EventEmitter<PlayerProps[PlayerProp.MediaQuality]>

  /**
   * Emitted when the `mediaQualities` prop changes value.
   */
  vMediaQualitiesChange: EventEmitter<PlayerProps[PlayerProp.MediaQualities]>

  /**
   * Emitted when the `volume` prop changes value.
   */
  vVolumeChange: EventEmitter<PlayerProps[PlayerProp.Volume]>

  /**
   * Emitted when the `mediaType` prop changes value.
   */
  vMediaTypeChange: EventEmitter<PlayerProps[PlayerProp.MediaType]>

  /**
   * Emitted when the `viewType` prop changes value.
   */
  vViewTypeChange: EventEmitter<PlayerProps[PlayerProp.ViewType]>

  /**
   * Emitted when the `isLive` prop changes value.
   */
  vLiveChange: EventEmitter<PlayerProps[PlayerProp.IsLive]>

  /**
   * Emitted when the `isTouch` prop changes value.
   */
  vTouchChange: EventEmitter<PlayerProps[PlayerProp.IsTouch]>

  /**
   * Emitted when the `language` prop changes value.
   */
  vLanguageChange: EventEmitter<PlayerProps[PlayerProp.Language]>

  /**
   * Emitted when the `languages` prop changes value.
   */
  vLanguagesChange: EventEmitter<PlayerProps[PlayerProp.Languages]>

  /**
   * Emitted when the `isFullscreenActive` prop changes value.
   */
  vFullscreenChange: EventEmitter<PlayerProps[PlayerProp.IsFullscreenActive]>

  /**
   * Emitted when the `isPiPActive` prop changes value.
   */
  vPiPChange: EventEmitter<PlayerProps[PlayerProp.isPiPActive]>

  // --------------------------------------------
  // Methods
  // --------------------------------------------

  /**
   * Returns the current media provider
   */
  getProvider<InternalPlayerType>(): Promise<MediaProvider<InternalPlayerType>>

  /**
   * **INTERNAL:** Returns the current media provider's adapter. Shorthand for
   * `getProvider().getAdapter()`.
   */
  getAdapter<InternalPlayerType>(): Promise<MediaProviderAdapter<InternalPlayerType>>

  /**
   * Begins/resumes playback of the media. If this method is called programmatically before the user
   * has interacted with the player, the promise may be rejected subject to the browser's autoplay
   * policies.
   */
  play(): Promise<void>

  /**
   * Pauses playback of the media.
   */
  pause(): Promise<void>

  /**
   * Determines whether the current provider recognizes, and can play the given type.
   */
  canPlay(type: string): Promise<boolean>

  /**
   * Determines whether the player can start playback of the current media automatically.
   */
  canAutoplay(): Promise<boolean>

  /**
   *
   * Determines whether the player can start playback of the current media automatically given the
   * player is muted.
   */
  canMutedAutoplay(): Promise<boolean>

  /**
   * Returns whether the current provider allows setting the `playbackRate` prop.
   */
  canSetPlaybackRate(): Promise<boolean>

  /**
   * Returns whether the current provider allows setting the `mediaQuality` prop.
   */
  canSetMediaQuality(): Promise<boolean>

  /**
   * Returns whether the native browser fullscreen API is available, or the current provider can
   * toggle fullscreen mode. This does not mean that the operation is guaranteed to be successful,
   * only that it can be attempted.
   */
  canSetFullscreen(): Promise<boolean>

  /**
   * Requests to enter fullscreen mode, returning a `Promise` that will resolve if the request is
   * made, or reject with a reason for failure. This method will first attempt to use the browsers
   * native fullscreen API, and then fallback to requesting the provider to do it (if available).
   * Do not rely on a resolved promise to determine if the player is in fullscreen or not. The only
   * way to be certain is by listening to the `vFullscreenChange` event. Some common reasons for
   * failure are: the fullscreen API is not available, the request is made when `viewType` is audio,
   * or the user has not interacted with the page yet.
   */
  enterFullscreen(options?: FullscreenOptions): Promise<void>

  /**
   * Requests to exit fullscreen mode, returning a `Promise` that will resolve if the request is
   * successful, or reject with a reason for failure. Refer to `enterFullscreen()` for more
   * information.
   */
  exitFullscreen(): Promise<void>

  /**
   * Returns whether the current provider exposes an API for entering and exiting
   * picture-in-picture mode. This does not mean the operation is guaranteed to be successful, only
   * that it can be attempted.
   */
  canSetPiP(): Promise<boolean>

  /**
   * Request to enter picture-in-picture (PiP) mode, returning a `Promise` that will resolve if
   * the request is made, or reject with a reason for failure. Do not rely on a resolved promise
   * to determine if the player is in PiP mode or not. The only way to be certain is by listening
   * to the `vPiPChange` event. Some common reasons for failure are the same as the reasons for
   * `enterFullscreen()`.
   */
  enterPiP(): Promise<void>

  /**
   * Request to exit picture-in-picture mode, returns a `Promise` that will resolve if the request
   * is successful, or reject with a reason for failure. Refer to `enterPiP()` for more
   * information.
   */
  exitPiP(): Promise<void>

  /**
   * Extends the translation map for a given language.
   */
  extendLanguage(language: string, translations: Record<string, string>): Promise<void>
}
