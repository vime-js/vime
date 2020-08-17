import { MediaProvider, MediaProviderAdapter } from '../../providers/MediaProvider';

export enum PlayerMethod {
  GetProvider = 'getProvider',
  GetAdapter = 'getAdapter',
  Play = 'play',
  Pause = 'pause',
  CanPlay = 'canPlay',
  CanAutoplay = 'canAutoplay',
  CanMutedAutoplay = 'canMutedAutoplay',
  CanSetPlaybackRate = 'canSetPlaybackRate',
  CanSetPlaybackQuality = 'canSetPlaybackQuality',
  CanSetFullscreen = 'canSetFullscreen',
  EnterFullscreen = 'enterFullscreen',
  ExitFullscreen = 'exitFullscreen',
  CanSetPiP = 'canSetPiP',
  EnterPiP = 'enterPiP',
  ExitPiP = 'exitPiP',
  ExtendLanguage = 'extendLanguage',
  CallAdapter = 'callAdapter',
  QueueStateChange = 'queueStateChange',
  ToggleCaptionsVisibility = 'toggleCaptionsVisiblity',
}

export interface PlayerMethods {
  /**
   * Returns the current media provider
   */
  [PlayerMethod.GetProvider]<InternalPlayerType>(): Promise<MediaProvider<InternalPlayerType>>

  /**
   * Returns the current media provider's adapter. Shorthand for `getProvider().getAdapter()`.
   */
  [PlayerMethod.GetAdapter]<InternalPlayerType>(): Promise<MediaProviderAdapter<InternalPlayerType>>

  /**
   * Begins/resumes playback of the media. If this method is called programmatically before the user
   * has interacted with the player, the promise may be rejected subject to the browser's autoplay
   * policies.
   */
  [PlayerMethod.Play](): Promise<void>

  /**
   * Pauses playback of the media.
   */
  [PlayerMethod.Pause](): Promise<void>

  /**
   * Determines whether the current provider recognizes, and can play the given type.
   */
  [PlayerMethod.CanPlay](type: string): Promise<boolean>

  /**
   * Determines whether the player can start playback of the current media automatically.
   */
  [PlayerMethod.CanAutoplay](): Promise<boolean>

  /**
   *
   * Determines whether the player can start playback of the current media automatically given the
   * player is muted.
   */
  [PlayerMethod.CanMutedAutoplay](): Promise<boolean>

  /**
   * Returns whether the current provider allows setting the `playbackRate` prop.
   */
  [PlayerMethod.CanSetPlaybackRate](): Promise<boolean>

  /**
   * Returns whether the current provider allows setting the `playbackQuality` prop.
   */
  [PlayerMethod.CanSetPlaybackQuality](): Promise<boolean>

  /**
   * Returns whether the native browser fullscreen API is available, or the current provider can
   * toggle fullscreen mode. This does not mean that the operation is guaranteed to be successful,
   * only that it can be attempted.
   */
  [PlayerMethod.CanSetFullscreen](): Promise<boolean>

  /**
   * Requests to enter fullscreen mode, returning a `Promise` that will resolve if the request is
   * made, or reject with a reason for failure. This method will first attempt to use the browsers
   * native fullscreen API, and then fallback to requesting the provider to do it (if available).
   * Do not rely on a resolved promise to determine if the player is in fullscreen or not. The only
   * way to be certain is by listening to the `vFullscreenChange` event. Some common reasons for
   * failure are: the fullscreen API is not available, the request is made when `viewType` is audio,
   * or the user has not interacted with the page yet.
   */
  [PlayerMethod.EnterFullscreen](options?: FullscreenOptions): Promise<void>

  /**
   * Requests to exit fullscreen mode, returning a `Promise` that will resolve if the request is
   * successful, or reject with a reason for failure. Refer to `enterFullscreen()` for more
   * information.
   */
  [PlayerMethod.ExitFullscreen](): Promise<void>

  /**
   * Returns whether the current provider exposes an API for entering and exiting
   * picture-in-picture mode. This does not mean the operation is guaranteed to be successful, only
   * that it can be attempted.
   */
  [PlayerMethod.CanSetPiP](): Promise<boolean>

  /**
   * Request to enter picture-in-picture (PiP) mode, returning a `Promise` that will resolve if
   * the request is made, or reject with a reason for failure. Do not rely on a resolved promise
   * to determine if the player is in PiP mode or not. The only way to be certain is by listening
   * to the `vPiPChange` event. Some common reasons for failure are the same as the reasons for
   * `enterFullscreen()`.
   */
  [PlayerMethod.EnterPiP](): Promise<void>

  /**
   * Request to exit picture-in-picture mode, returns a `Promise` that will resolve if the request
   * is successful, or reject with a reason for failure. Refer to `enterPiP()` for more
   * information.
   */
  [PlayerMethod.ExitPiP](): Promise<void>

  /**
   * Toggles the visibility of the captions.
   */
  [PlayerMethod.ToggleCaptionsVisibility](isVisible?: boolean): Promise<void>

  /**
   * Extends the translation map for a given language.
   */
  [PlayerMethod.ExtendLanguage](
    language: string,
    translations: Record<string, string>
  ): Promise<void>
}
