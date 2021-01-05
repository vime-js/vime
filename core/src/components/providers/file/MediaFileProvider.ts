import { AdapterProvider, MediaProviderAdapter } from '../MediaProvider';

export type MediaCrossOriginOption = '' | 'anonymous' | 'use-credentials';
export type MediaPreloadOption = '' | 'none' | 'metadata' | 'auto';

export interface MediaFileProvider<InternalPlayerType = any>
  extends AdapterProvider<InternalPlayerType> {
  /**
   * Whether to use CORS to fetch the related image. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) for more
   * information.
   */
  crossOrigin?: MediaCrossOriginOption;

  /**
   * Provides a hint to the browser about what the author thinks will lead to the best user
   * experience with regards to what content is loaded before the video is played. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload) for more
   * information.
   */
  preload?: MediaPreloadOption;

  /**
   * A URL for an image to be shown while the video is downloading. If this attribute isn't
   * specified, nothing is displayed until the first frame is available, then the first frame is
   * shown as the poster frame.
   */
  poster?: string;

  /**
   * Determines what controls to show on the media element whenever the browser shows its own set
   * of controls (e.g. when the controls attribute is specified).
   *
   * @example 'nodownload nofullscreen noremoteplayback'
   */
  controlsList?: string;

  /**
   * **EXPERIMENTAL:** Whether the browser should automatically toggle picture-in-picture mode as
   * the user switches back and forth between this document and another document or application.
   */
  autoPiP?: boolean;

  /**
   * **EXPERIMENTAL:** Prevents the browser from suggesting a picture-in-picture context menu or to
   * request picture-in-picture automatically in some cases.
   */
  disablePiP?: boolean;

  /**
   * **EXPERIMENTAL:** Whether to disable the capability of remote playback in devices that are
   * attached using wired (HDMI, DVI, etc.) and wireless technologies
   * (Miracast, Chromecast, DLNA, AirPlay, etc).
   */
  disableRemotePlayback?: boolean;

  /** @internal */
  getAdapter(): Promise<MediaProviderAdapter<InternalPlayerType>>;
}
