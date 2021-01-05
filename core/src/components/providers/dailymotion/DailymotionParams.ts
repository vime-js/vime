/**
 * Dailymotion Player Parameters.
 *
 * @see https://developer.dailymotion.com/player/#player-parameters
 */
export interface DailymotionParams {
  /**
   * Automatically attempt to start playback with sound, if it is blocked by the browser, the
   * player will force the video mute.
   *
   * @default false
   */
  autoplay?: boolean;

  /**
   * Whether to display the player controls.
   *
   * @default true
   */
  controls?: boolean;

  /**
   * ID of the player unique to the page to be passed back with all API messages.
   *
   * @default undefined
   */
  id?: string;

  /**
   * Whether to mute the video.
   *
   * @default false
   */
  mute?: boolean;

  /**
   * Specify the suggested playback quality for the video.
   *
   * @default undefined
   */
  quality?: number;

  /**
   * Whether to automatically play the next item in the queue.
   *
   * @default true
   */
  'queue-autoplay-next'?: boolean;

  /**
   * Whether to show the 'Up Next' Queue.
   *
   * @default true
   */
  'queue-enable'?: boolean;

  /**
   * Whether to display the sharing button.
   *
   * @default true
   */
  'sharing-enable'?: boolean;

  /**
   * Specify the time (in seconds) from which the video should start playing.
   *
   * @default undefined
   */
  start?: number;

  /**
   * Specify the default selected subtitles language.
   *
   * @default undefined
   */
  'subtitles-default'?: string;

  /**
   * Pass your syndication key to the player.
   *
   * @default undefined
   */
  syndication?: string;

  /**
   * Change the default highlight color used in the controls (hex value without the leading #).
   * Color set in the Partner HQ will override this param.
   *
   * @default undefined
   */
  'ui-highlight'?: string;

  /**
   * Whether to display the Dailymotion logo.
   *
   * @default false
   */
  'ui-logo'?: boolean;

  /**
   * Whether to show video information (title and owner) on the start screen.
   *
   * @default true
   */
  'ui-start-screen-info'?: boolean;

  /**
   * Specify a playlist ID to populate the 'Up Next Queue' with videos from a playlist
   *
   * @default undefined
   */
  playlist?: string;
}
