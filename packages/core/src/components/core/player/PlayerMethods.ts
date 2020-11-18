import { AdapterHost, MediaProviderAdapter } from '../../providers/MediaProvider';
import { Translation } from './lang/Translation';

export interface PlayerMethods {
  /**
   * Returns the current media provider.
   */
  getProvider<InternalPlayerType>(): Promise<AdapterHost<InternalPlayerType> | undefined>

  /**
   * Returns the current media provider's adapter. Shorthand for `getProvider().getAdapter()`.
   */
  getAdapter<InternalPlayerType>(): Promise<MediaProviderAdapter<InternalPlayerType> | undefined>

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
   * Returns whether the current provider allows setting the `playbackQuality` prop.
   */
  canSetPlaybackQuality(): Promise<boolean>

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
   * way to be certain is by listening to the `vmFullscreenChange` event. Some common reasons for
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
   * to the `vmPiPChange` event. Some common reasons for failure are the same as the reasons for
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
   * Returns whether the current provider allows changing the text track.
   */
  canSetTextTrack(): Promise<boolean>

  /**
   * Sets the currently active text track given the index. Set to -1 to disable all text tracks.
   */
  setCurrentTextTrack(trackId: number): Promise<void>

  /**
   * Returns whether the current providers allows setting the text track visibility.
   */
  canSetTextTrackVisibility(): Promise<boolean>

  /**
   * Sets the visibility of the currently active text track.
   */
  setTextTrackVisibility(isVisible: boolean): Promise<void>

  /**
   * Returns whether the current providers allows changing the audio track.
   */
  canSetAudioTrack(): Promise<boolean>

  /**
   * Sets the currently active audio track given the index.
   */
  setCurrentAudioTrack(trackId: number): Promise<void>

  /**
   * Extends the translation map for a given language.
   */
  extendLanguage(language: string, translation: Partial<Translation>): Promise<void>
}
