import { en } from './lang/en';
import { Translation } from './lang/Translation';
import { MediaType } from './MediaType';
import { Logger } from './PlayerLogger';
import { ViewType } from './ViewType';
import { Provider } from '../../providers/Provider';

export const initialState: { [P in keyof PlayerProps]: PlayerProps[P] } = {
  theme: undefined,
  paused: true,
  playing: false,
  duration: -1,
  currentProvider: undefined,
  mediaTitle: undefined,
  currentSrc: undefined,
  currentPoster: undefined,
  currentTime: 0,
  autoplay: false,
  attached: false,
  ready: false,
  playbackReady: false,
  loop: false,
  muted: false,
  buffered: 0,
  playbackRate: 1,
  playbackRates: [1],
  playbackQuality: undefined,
  playbackQualities: [],
  seeking: false,
  debug: false,
  playbackStarted: false,
  playbackEnded: false,
  buffering: false,
  controls: false,
  isControlsActive: false,
  errors: [],
  textTracks: undefined,
  volume: 50,
  isFullscreenActive: false,
  aspectRatio: '16:9',
  viewType: undefined,
  isAudioView: false,
  isVideoView: false,
  mediaType: undefined,
  isAudio: false,
  isVideo: false,
  isMobile: false,
  isTouch: false,
  isCaptionsActive: false,
  isSettingsActive: false,
  currentCaption: undefined,
  isLive: false,
  isPiPActive: false,
  autopause: true,
  playsinline: false,
  language: 'en',
  languages: ['en'],
  translations: { en },
  i18n: en,
};

/**
 * Player properties that can be written to.
 */
export type WritableProps = Pick<PlayerProps,
'autoplay'
| 'autopause'
| 'aspectRatio'
| 'controls'
| 'theme'
| 'debug'
| 'paused'
| 'currentTime'
| 'language'
| 'loop'
| 'translations'
| 'playbackQuality'
| 'muted'
| 'playbackRate'
| 'playsinline'
| 'volume'
| 'errors'
| 'isSettingsActive'
| 'isCaptionsActive'
| 'isControlsActive'
>;

const writableProps = new Set<PlayerProp>([
  'autoplay',
  'autopause',
  'aspectRatio',
  'controls',
  'theme',
  'debug',
  'paused',
  'currentTime',
  'language',
  'loop',
  'translations',
  'playbackQuality',
  'muted',
  'errors',
  'playbackRate',
  'playsinline',
  'volume',
  'isSettingsActive',
  'isCaptionsActive',
  'isControlsActive',
]);

export const isReadonlyProp = (prop: PlayerProp) => !writableProps.has(prop);
export const isWritableProp = (prop: PlayerProp) => writableProps.has(prop);

/**
 * Player properties that should be reset when the media is changed.
 */
const resetableProps = new Set<PlayerProp>([
  'paused',
  'currentTime',
  'duration',
  'buffered',
  'seeking',
  'playing',
  'buffering',
  'playbackReady',
  'mediaTitle',
  'currentSrc',
  'currentPoster',
  'playbackRate',
  'playbackRates',
  'playbackStarted',
  'playbackEnded',
  'playbackQuality',
  'playbackQualities',
  'textTracks',
  'mediaType',
  'isCaptionsActive',
]);

export const shouldPropResetOnMediaChange = (prop: PlayerProp) => resetableProps.has(prop);

/**
 * Properties that can only be written to by a provider.
 */
export type ProviderWritableProps = WritableProps & Pick<PlayerProps,
'ready'
| 'playing'
| 'playbackReady'
| 'playbackStarted'
| 'playbackEnded'
| 'seeking'
| 'buffered'
| 'buffering'
| 'duration'
| 'viewType'
| 'mediaTitle'
| 'mediaType'
| 'textTracks'
| 'currentSrc'
| 'currentPoster'
| 'playbackRates'
| 'playbackQualities'
| 'isPiPActive'
| 'isFullscreenActive'
>;

const providerWritableProps = new Set<PlayerProp>([
  'ready',
  'playing',
  'playbackReady',
  'playbackStarted',
  'playbackEnded',
  'seeking',
  'buffered',
  'buffering',
  'duration',
  'viewType',
  'mediaTitle',
  'mediaType',
  'textTracks',
  'currentSrc',
  'currentPoster',
  'playbackRates',
  'playbackQualities',
  'isPiPActive',
  'isFullscreenActive',
]);

export const isProviderWritableProp = (
  prop: PlayerProp,
) => isWritableProp(prop) || providerWritableProps.has(prop);

/**
 * Properties that can only be written to by the player directly.
 */
export type PlayerWritableProps = WritableProps & Pick<PlayerProps,
| 'currentCaption'
| 'isMobile'
| 'isTouch'
| 'isCaptionsActive'
| 'isFullscreenActive'
>;

const playerWritableProps = new Set<PlayerProp>([
  'currentCaption',
  'isMobile',
  'isTouch',
  'isCaptionsActive',
  'isFullscreenActive',
]);

export const isPlayerWritableProp = (
  prop: PlayerProp,
) => isWritableProp(prop) || playerWritableProps.has(prop);

export type PlayerProp = keyof PlayerProps;

export interface PlayerProps {
  /**
   * `@readonly` Whether the player is attached to the DOM.
   */
  attached: boolean

  /**
   * This property has no role other than scoping CSS selectors.
   */
  theme?: string;

  /**
   * Whether playback should be paused. Defaults to `true` if no media has loaded or playback has
   * not started. Setting this to `true` will begin/resume playback.
   */
  paused: boolean

  /**
   * `@readonly` Whether media is actively playing back. Defaults to `false` if no media has
   * loaded or playback has not started.
   */
  playing: boolean

  /**
   * `@readonly` A `double` indicating the total playback length of the media in seconds. Defaults
   * to `-1` if no media has been loaded. If the media is being streamed live then the duration is
   * equal to `Infinity`.
   */
  duration: number

  /**
   * `@readonly` The title of the current media. Defaults to `undefined` if no media has been
   * loaded.
   */
  mediaTitle?: string

  /**
   * `@readonly` The absolute URL of the media resource that has been chosen. Defaults to
   * `undefined` if no media has been loaded.
   */
  currentSrc?: string

  /**
   * `@readonly` The absolute URL of the poster for the current media resource. Defaults to
   * `undefined` if no media/poster has been loaded.
   */
  currentPoster?: string

  /**
   * A `double` indicating the current playback time in seconds. Defaults to `0` if the media has
   * not started to play and has not seeked. Setting this value seeks the media to the new
   * time. The value can be set to a minimum of `0` and maximum of the total length of the
   * media (indicated by the duration prop).
   */
  currentTime: number

  /**
   * Whether playback should automatically begin playing once the media is ready to do so. This
   * will only work if the browsers `autoplay` policies have been satisfied. It'll generally work
   * if the player is muted, or the user frequently interacts with your site. You can check
   * if it's possible to autoplay via the `canAutoplay()` or `canMutedAutoplay()` methods.
   * Depending on the provider, changing this prop may cause the player to completely reset.
   */
  autoplay: boolean

  /**
   * `@readonly` Whether the player has loaded and is ready to be interacted with.
   */
  ready: boolean

  /**
   * `@readonly` Whether media is ready for playback to begin.
   */
  playbackReady: boolean

  /**
   * Whether media should automatically start playing from the beginning every time it ends.
   */
  loop: boolean

  /**
   * Whether the audio is muted or not.
   */
  muted: boolean

  /**
   * `@readonly` The length of the media in seconds that has been downloaded by the browser.
   */
  buffered: number

  /**
   * A `double` indicating the rate at which media is being played back. If the value is `<1` then
   * playback is slowed down; if `>1` then playback is sped up. Defaults to `1`. The playback rate
   * can only be set to a rate found in the `playbackRates` prop. Some providers may not
   * allow changing the playback rate, you can check if it's possible via `canSetPlaybackRate()`.
   */
  playbackRate: number

  /**
   * `@readonly` The playback rates available for the current media.
   */
  playbackRates: number[]

  /**
   * Indicates the quality of the media. The value will differ between audio and video. For audio
   * this might be some combination of the encoding format (AAC, MP3), bitrate in kilobits per
   * second (kbps) and sample rate in kilohertz (kHZ). For video this will be the number of vertical
   * pixels it supports. For example, if the video has a resolution of `1920x1080` then the quality
   * will return `1080p`. Defaults to `undefined` which you can interpret as the quality is unknown.
   * The quality can only be set to a quality found in the `playbackQualities` prop. Some providers
   * may not allow changing the quality, you can check if it's possible via
   * `canSetPlaybackQuality()`.
   */
  playbackQuality?: string

  /**
   * `@readonly` The media qualities available for the current media.
   */
  playbackQualities: string[]

  /**
   * `@readonly` Whether the player is in the process of seeking to a new time position.
   */
  seeking: boolean

  /**
   * `@readonly` Whether the player is in debug mode and should `console.x` information about
   * its internal state.
   */
  debug: boolean

  /**
   * `@readonly` Whether the media has initiated playback. In other words it will be true if
   * `currentTime > 0`.
   */
  playbackStarted: boolean

  /**
   * `@readonly` Whether media playback has reached the end. In other words it'll be true if
   * `currentTime === duration`.
   */
  playbackEnded: boolean

  /**
   * `@readonly` Whether playback has temporarily stopped because of a lack of temporary data.
   */
  buffering: boolean

  /**
   * Indicates whether a user interface should be shown for controlling the resource. Set this to
   * `false` when you want to provide your own custom controls, and `true` if you want the current
   * provider to supply its own default controls. Depending on the provider, changing this prop
   * may cause the player to completely reset.
   */
  controls: boolean

  /**
   * Whether the controls are currently visible. This is currently only supported by custom
   * controls.
   */
  isControlsActive: boolean

  /**
   * `@readonly` A collection of errors that have occurred ordered by `[oldest, ..., newest]`.
   */
  errors: any[]

  /**
   * `@readonly` The text tracks (WebVTT) associated with the current media.
   */
  textTracks?: TextTrackList

  /**
   * An `int` between `0` (silent) and `100` (loudest) indicating the audio volume.
   */
  volume: number

  /**
   * `@readonly` Whether the player is currently in fullscreen mode.
   */
  isFullscreenActive: boolean

  /**
   * The aspect ratio of the player expressed as `width:height` (`16:9`). This is only applied if
   * the `viewType` is `video` and the player is not in fullscreen mode.
   */
  aspectRatio: string

  /**
   * `@readonly` The type of player view that is being used, whether it's an audio player view or
   * video player view. Normally if the media type is of audio then the view is of type audio, but
   * in some cases it might be desirable to show a different view type. For example, when playing
   * audio with a poster. This is subject to the provider allowing it. Defaults to `undefined`
   * when no media has been loaded.
   */
  viewType?: ViewType

  /**
   * `@readonly` Whether the current view is of type `audio`, shorthand for
   * `viewType === ViewType.Audio`.
   */
  isAudioView: boolean

  /**
   * `@readonly` Whether the current view is of type `video`, shorthand for
   * `viewType === ViewType.Video`.
   */
  isVideoView: boolean

  /**
   * `@readonly` The type of media that is currently active, whether it's audio or video. Defaults
   * to `undefined` when no media has been loaded or the type cannot be determined.
   */
  mediaType?: MediaType

  /**
   * `@readonly` Whether the current media is of type `audio`, shorthand for
   * `mediaType === MediaType.Audio`.
   */
  isAudio: boolean

  /**
   * `@readonly` Whether the current media is of type `video`, shorthand for
   * `mediaType === MediaType.Video`.
   */
  isVideo: boolean

  /**
   * `@readonly` Whether the player is in mobile mode. This is determined by parsing
   * `window.navigator.userAgent`.
   */
  isMobile: boolean

  /**
   * `@readonly` Whether the player is in touch mode. This is determined by listening for
   * mouse/touch events and toggling this value.
   */
  isTouch: boolean

  /**
   * `@readonly` Whether any captions or subtitles are currently showing.
   */
  isCaptionsActive: boolean

  /**
   * `@readonly` Whether the settings menu has been opened and is currently visible. This is
   * currently only supported by custom settings.
   */
  isSettingsActive: boolean

  /**
   * `@readonly` The current provider name whose responsible for loading and playing media.
   * Defaults to `undefined` when no provider has been loaded.
   */
  currentProvider?: Provider;

  /**
   * `@readonly` The selected caption/subtitle text track to display. Defaults to `undefined` if
   * there is none. This does not mean this track is active, only that is the current selection. To
   * know if it is active, check the `isCaptionsActive` prop.
   */
  currentCaption?: TextTrack

  /**
   * `@readonly` Whether the current media is being broadcast live (`duration === Infinity`).
   */
  isLive: boolean

  /**
   * `@readonly` Whether the player is currently in picture-in-picture mode.
   */
  isPiPActive: boolean

  /**
   * Whether the player should automatically pause when another Vime player starts/resumes playback.
   */
  autopause: boolean

  /**
   * Whether the video is to be played "inline", that is within the element's playback area. Note
   * that setting this to false does not imply that the video will always be played in fullscreen.
   * Depending on the provider, changing this prop may cause the player to completely reset.
   */
  playsinline: boolean

  /**
   * The current language of the player. This can be any code defined via the `extendLanguage`
   * method or the default `en`. It's recommended to use an ISO 639-1 code as that'll be used by
   * Vime when adding new language defaults in the future.
   */
  language: string

  /**
   * `@readonly` The languages that are currently available. You can add new languages via the
   * `extendLanguage` method.
   */
  languages: string[]

  /**
   * `@readonly` Contains each language and its respective translation map.
   */
  translations: Record<string, Translation>,

  /**
   * `@readonly` A dictionary of translations for the current language.
   */
  i18n: Translation | Record<string, string>

  /**
   * @internal
   */
  logger?: Logger
}
