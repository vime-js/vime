import { MediaProviderAdapter } from '../MediaProvider';

export type MediaPreloadOption = '' | 'none' | 'metadata' | 'auto';

export interface MediaFileProvider<InternalPlayerType = any> {
  /**
   * This enumerated attribute indicates whether to use CORS to fetch the related image.
   *
   * The allowed values are:
   *
   * - `anonymous`: Sends a cross-origin request without a credential. In other words, it sends the
   * `Origin: HTTP` header without a cookie, X.509 certificate, or performing HTTP Basic
   * authentication. If the server does not give credentials to the origin site (by not setting the
   * Access-Control-Allow-Origin: HTTP header), the image will be tainted, and its usage restricted.
   *
   * - `use-credentials`: Sends a cross-origin request with a credential. In other words, it sends
   * the `Origin: HTTP` header with a cookie, a certificate, or performing HTTP Basic
   * authentication. If the server does not give credentials to the origin site (through
   * Access-Control-Allow-Credentials: HTTP header), the image will be tainted and its usage
   * restricted.
   *
   * When not present, the resource is fetched without a CORS request (i.e. without sending the
   * Origin: HTTP header), preventing its non-tainted use in <canvas> elements. If invalid, it is
   * handled as if the enumerated keyword anonymous was used. See CORS settings attributes for
   * additional information.
   */
  crossOrigin?: string

  /**
   * This enumerated attribute is intended to provide a hint to the browser about what the author
   * thinks will lead to the best user experience with regards to what content is loaded before the
   * video is played.
   *
   * It may have one of the following values:
   *
   * - `none`: Indicates that the video should not be preloaded.
   * - `metadata`: Indicates that only video metadata (e.g. length) is fetched.
   * - `auto`: Indicates that the whole video file can be downloaded, even if the user is not
   * expected to use it.
   * - `''` (empty string): Synonym of the auto value.
   *
   * The default value is different for each browser. The spec advises it to be set to metadata.
   */
  preload?: MediaPreloadOption

  /**
   * A URL for an image to be shown while the video is downloading. If this attribute isn't
   * specified, nothing is displayed until the first frame is available, then the first frame is
   * shown as the poster frame.
   */
  poster?: string

  /**
   * Determines what controls to show on the media element whenever the browser shows its own set
   * of controls (e.g. when the controls attribute is specified).
   *
   * @example 'nodownload nofullscreen noremoteplayback'
   */
  controlsList?: string

  /**
   * **EXPERIMENTAL:** Whether the browser should automatically toggle picture-in-picture mode as
   * the user switches back and forth between this document and another document or application.
   */
  autoPiP?: boolean

  /**
   * **EXPERIMENTAL:** Prevents the browser from suggesting a picture-in-picture context menu or to
   * request picture-in-picture automatically in some cases.
   */
  disablePiP?: boolean

  /**
   * **EXPERIMENTAL:** Whether to disable the capability of remote playback in devices that are
   * attached using wired (HDMI, DVI, etc.) and wireless technologies
   * (Miracast, Chromecast, DLNA, AirPlay, etc).
   */
  disableRemotePlayback?: boolean

  /**
   * @internal
   */
  getAdapter(): Promise<MediaProviderAdapter<InternalPlayerType>>
}
