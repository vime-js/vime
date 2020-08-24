import { MediaType } from './MediaType';
import { ViewType } from './ViewType';

export enum PlayerProp {
  paused = 'paused',
  playing = 'playing',
  duration = 'duration',
  mediaTitle = 'mediaTitle',
  currentSrc = 'currentSrc',
  currentPoster = 'currentPoster',
  currentTime = 'currentTime',
  seeking = 'seeking',
  debug = 'debug',
  ready = 'ready',
  mounted = 'mounted',
  destroyed = 'destroyed',
  playbackStarted = 'playbackStarted',
  playbackEnded = 'playbackEnded',
  playbackRate= 'playbackRate',
  playbackRates = 'playbackRates',
  playbackQuality = 'playbackQuality',
  playbackQualities= 'playbackQualities',
  textTracks = 'textTracks',
  errors = 'errors',
  playbackReady = 'playbackReady',
  buffered = 'buffered',
  buffering = 'buffering',
  // eslint-disable-next-line no-shadow
  mediaType = 'mediaType',
  isAudio = 'isAudio',
  isVideo = 'isVideo',
  // eslint-disable-next-line no-shadow
  viewType = 'viewType',
  isAudioView = 'isAudioView',
  isVideoView = 'isVideoView',
  isLive = 'isLive',
  isCaptionsActive = 'isCaptionsActive',
  isSettingsActive = 'isSettingsActive',
  currentCaption = 'currentCaption',
  isMobile = 'isMobile',
  isTouch = 'isTouch',
  isPiPActive = 'isPiPActive',
  isFullscreenActive = 'isFullscreenActive',
  playsinline = 'playsinline',
  muted = 'muted',
  volume = 'volume',
  autopause = 'autopause',
  controls = 'controls',
  isControlsActive = 'isControlsActive',
  autoplay = 'autoplay',
  loop = 'loop',
  aspectRatio = 'aspectRatio',
  language = 'language',
  languages = 'languages',
  translations = 'translations',
  i18n = 'i18n',
}

export type InternalReadonlyPlayerProps = Pick<PlayerProps, PlayerProp.autoplay
| PlayerProp.controls
| PlayerProp.debug
| PlayerProp.loop
| PlayerProp.ready
| PlayerProp.mounted
| PlayerProp.destroyed
| PlayerProp.isAudio
| PlayerProp.isVideo
| PlayerProp.isMobile
| PlayerProp.isTouch
| PlayerProp.isAudioView
| PlayerProp.isVideoView
| PlayerProp.isLive
| PlayerProp.currentCaption
| PlayerProp.autopause
| PlayerProp.aspectRatio
| PlayerProp.playsinline
| PlayerProp.languages
| PlayerProp.i18n
>;

export type InternalReadonlyPlayerProp = keyof InternalReadonlyPlayerProps;
export type InternalWritablePlayerProps = Omit<PlayerProps, InternalReadonlyPlayerProp>;
export type InternalWritablePlayerProp = keyof InternalWritablePlayerProps;

const externalWritable = new Set([
  PlayerProp.autoplay,
  PlayerProp.autopause,
  PlayerProp.aspectRatio,
  PlayerProp.controls,
  PlayerProp.debug,
  PlayerProp.paused,
  PlayerProp.currentTime,
  PlayerProp.language,
  PlayerProp.loop,
  PlayerProp.playbackQuality,
  PlayerProp.muted,
  PlayerProp.playbackRate,
  PlayerProp.playsinline,
  PlayerProp.volume,
]);

/**
 * Determines if a player prop can be changed via the `vime-player` element from the "outside".
 */
export const isExternalReadonlyPlayerProp = (prop: PlayerProp) => !externalWritable.has(prop);

const internalReadonly = new Set<InternalReadonlyPlayerProp>([
  PlayerProp.autoplay,
  PlayerProp.controls,
  PlayerProp.loop,
  PlayerProp.ready,
  PlayerProp.mounted,
  PlayerProp.destroyed,
  PlayerProp.debug,
  PlayerProp.isAudio,
  PlayerProp.isVideo,
  PlayerProp.isMobile,
  PlayerProp.isTouch,
  PlayerProp.isLive,
  PlayerProp.currentCaption,
  PlayerProp.isAudioView,
  PlayerProp.isVideoView,
  PlayerProp.autopause,
  PlayerProp.aspectRatio,
  PlayerProp.playsinline,
  PlayerProp.languages,
  PlayerProp.i18n,
]);

/**
 * Determines if a player prop can be changed "inside" via the `vStateChange` event fired by
 * providers.
 */
export const isInternalReadonlyPlayerProp = (prop: PlayerProp) => internalReadonly.has(prop as any);

/**
 * Used when the media changes to reset certain properties to their default value. Properties not
 * listed here are NOT reset.
 */
export const resetablePlayerProps = {
  [PlayerProp.paused]: true,
  [PlayerProp.currentTime]: 0,
  [PlayerProp.duration]: -1,
  [PlayerProp.buffered]: 0,
  [PlayerProp.seeking]: false,
  [PlayerProp.playing]: false,
  [PlayerProp.buffering]: false,
  [PlayerProp.playbackReady]: false,
  [PlayerProp.mediaTitle]: undefined,
  [PlayerProp.currentSrc]: undefined,
  [PlayerProp.currentPoster]: undefined,
  [PlayerProp.playbackRate]: 1,
  [PlayerProp.playbackRates]: [1],
  [PlayerProp.playbackQuality]: undefined,
  [PlayerProp.playbackQualities]: [],
  [PlayerProp.playbackStarted]: false,
  [PlayerProp.playbackEnded]: false,
  [PlayerProp.textTracks]: undefined,
  [PlayerProp.mediaType]: undefined,
  [PlayerProp.isLive]: false,
  [PlayerProp.isCaptionsActive]: false,
  [PlayerProp.currentCaption]: undefined,
};

export interface PlayerProps {
  /**
   * Whether playback should be paused. Defaults to `true` if no media has loaded or playback has
   * not started. Setting this to `true` will begin/resume playback.
   */
  [PlayerProp.paused]: boolean

  /**
   * `@readonly` Whether media is actively playing back. Defaults to `false` if no media has
   * loaded or playback has not started.
   */
  [PlayerProp.playing]: boolean

  /**
   * `@readonly` A `double` indicating the total playback length of the media in seconds. Defaults
   * to `-1` if no media has been loaded. If the media is being streamed live then the duration is
   * equal to `Infinity`.
   */
  [PlayerProp.duration]: number

  /**
   * `@readonly` The title of the current media. Defaults to `undefined` if no media has been
   * loaded.
   */
  [PlayerProp.mediaTitle]?: string

  /**
   * `@readonly` The absolute URL of the media resource that has been chosen. Defaults to
   * `undefined` if no media has been loaded.
   */
  [PlayerProp.currentSrc]?: string

  /**
   * `@readonly` The absolute URL of the poster for the current media resource. Defaults to
   * `undefined` if no media/poster has been loaded.
   */
  [PlayerProp.currentPoster]?: string

  /**
   * A `double` indicating the current playback time in seconds. Defaults to `0` if the media has
   * not started to play and has not seeked. Setting this value seeks the media to the new
   * time. The value can be set to a minimum of `0` and maximum of the total length of the
   * media (indicated by the duration prop).
   */
  [PlayerProp.currentTime]: number

  /**
   * Whether playback should automatically begin playing once the media is ready to do so. This
   * will only work if the browsers `autoplay` policies have been satisfied. It'll generally work
   * if the player is muted, or the user frequently interacts with your site. You can check
   * if it's possible to autoplay via the `canAutoplay()` or `canMutedAutoplay()` methods.
   * Depending on the provider, changing this prop may cause the player to completely reset.
   */
  [PlayerProp.autoplay]: boolean

  /**
   * `@readonly` Whether the player has mounted the DOM.
   */
  [PlayerProp.mounted]: boolean

  /**
   * `@readonly` Whether the player has disconnected from the DOM and been destroyed.
   */
  [PlayerProp.destroyed]: boolean

  /**
   * `@readonly` Whether the player has loaded and is ready to be interacted with.
   */
  [PlayerProp.ready]: boolean

  /**
   * `@readonly` Whether the player has loaded and is ready to be interacted with.
   */
  [PlayerProp.ready]: boolean

  /**
   * `@readonly` Whether media is ready for playback to begin.
   */
  [PlayerProp.playbackReady]: boolean

  /**
   * Whether media should automatically start playing from the beginning every time it ends.
   */
  [PlayerProp.loop]: boolean

  /**
   * Whether the audio is muted or not.
   */
  [PlayerProp.muted]: boolean

  /**
   * `@readonly` The length of the media in seconds that has been downloaded by the browser.
   */
  [PlayerProp.buffered]: number

  /**
   * A `double` indicating the rate at which media is being played back. If the value is `<1` then
   * playback is slowed down; if `>1` then playback is sped up. Defaults to `1`. The playback rate
   * can only be set to a rate found in the `playbackRates` prop. Some providers may not
   * allow changing the playback rate, you can check if it's possible via `canSetPlaybackRate()`.
   */
  [PlayerProp.playbackRate]: number

  /**
   * `@readonly` The playback rates available for the current media.
   */
  [PlayerProp.playbackRates]: number[]

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
  [PlayerProp.playbackQuality]?: string

  /**
   * `@readonly` The media qualities available for the current media.
   */
  [PlayerProp.playbackQualities]: string[]

  /**
   * `@readonly` Whether the player is in the process of seeking to a new time position.
   */
  [PlayerProp.seeking]: boolean

  /**
   * `@readonly` Whether the player is in debug mode and should `console.log` information about
   * its internal state.
   */
  [PlayerProp.debug]: boolean

  /**
   * `@readonly` Whether the media has initiated playback. In other words it will be true if
   * `currentTime > 0`.
   */
  [PlayerProp.playbackStarted]: boolean

  /**
   * `@readonly` Whether media playback has reached the end. In other words it'll be true if
   * `currentTime === duration`.
   */
  [PlayerProp.playbackEnded]: boolean

  /**
   * `@readonly` Whether playback has temporarily stopped because of a lack of temporary data.
   */
  [PlayerProp.buffering]: boolean

  /**
   * Indicates whether a user interface should be shown for controlling the resource. Set this to
   * `false` when you want to provide your own custom controls, and `true` if you want the current
   * provider to supply its own default controls. Depending on the provider, changing this prop
   * may cause the player to completely reset.
   */
  [PlayerProp.controls]: boolean

  /**
   * Whether the controls are currently visible. This is currently only supported by custom
   * controls.
   */
  [PlayerProp.isControlsActive]: boolean

  /**
   * `@readonly` A collection of errors that have occurred ordered by `[oldest, ..., newest]`.
   */
  [PlayerProp.errors]: any[]

  /**
   * `@readonly` The text tracks (WebVTT) associated with the current media.
   */
  [PlayerProp.textTracks]?: TextTrackList

  /**
   * An `int` between `0` (silent) and `100` (loudest) indicating the audio volume.
   */
  [PlayerProp.volume]: number

  /**
   * `@readonly` Whether the player is currently in fullscreen mode.
   */
  [PlayerProp.isFullscreenActive]: boolean

  /**
   * The aspect ratio of the player expressed as `width:height` (`16:9`). This is only applied if
   * the `viewType` is `video` and the player is not in fullscreen mode.
   */
  [PlayerProp.aspectRatio]: string

  /**
   * `@readonly` The type of player view that is being used, whether it's an audio player view or
   * video player view. Normally if the media type is of audio then the view is of type audio, but
   * in some cases it might be desirable to show a different view type. For example, when playing
   * audio with a poster. This is subject to the provider allowing it. Defaults to `undefined`
   * when no media has been loaded.
   */
  [PlayerProp.viewType]?: ViewType

  /**
   * `@readonly` Whether the current view is of type `audio`, shorthand for
   * `viewType === ViewType.Audio`.
   */
  [PlayerProp.isAudioView]: boolean

  /**
   * `@readonly` Whether the current view is of type `video`, shorthand for
   * `viewType === ViewType.Video`.
   */
  [PlayerProp.isVideoView]: boolean

  /**
   * `@readonly` The type of media that is currently active, whether it's audio or video. Defaults
   * to `undefined` when no media has been loaded or the type cannot be determined.
   */
  [PlayerProp.mediaType]?: MediaType

  /**
   * `@readonly` Whether the current media is of type `audio`, shorthand for
   * `mediaType === MediaType.Audio`.
   */
  [PlayerProp.isAudio]: boolean

  /**
   * `@readonly` Whether the current media is of type `video`, shorthand for
   * `mediaType === MediaType.Video`.
   */
  [PlayerProp.isVideo]: boolean

  /**
   * `@readonly` Whether the player is in mobile mode. This is determined by parsing
   * `window.navigator.userAgent`.
   */
  [PlayerProp.isMobile]: boolean

  /**
   * `@readonly` Whether the player is in touch mode. This is determined by listening for
   * mouse/touch events and toggling this value.
   */
  [PlayerProp.isTouch]: boolean

  /**
   * `@readonly` Whether any captions or subtitles are currently showing.
   */
  [PlayerProp.isCaptionsActive]: boolean

  /**
   * `@readonly` Whether the settings menu has been opened and is currently visible. This is
   * currently only supported by custom settings.
   */
  [PlayerProp.isSettingsActive]: boolean

  /**
   * `@readonly` The selected caption/subtitle text track to display. Defaults to `undefined` if
   * there is none. This does not mean this track is active, only that is the current selection. To
   * know if it is active, check the `isCaptionsActive` prop.
   */
  [PlayerProp.currentCaption]?: TextTrack

  /**
   * `@readonly` Whether the current media is being broadcast live (`duration === Infinity`).
   */
  [PlayerProp.isLive]: boolean

  /**
   * `@readonly` Whether the player is currently in picture-in-picture mode.
   */
  [PlayerProp.isPiPActive]: boolean

  /**
   * Whether the player should automatically pause when another Vime player starts/resumes playback.
   */
  [PlayerProp.autopause]: boolean

  /**
   * Whether the video is to be played "inline", that is within the element's playback area. Note
   * that setting this to false does not imply that the video will always be played in fullscreen.
   * Depending on the provider, changing this prop may cause the player to completely reset.
   */
  [PlayerProp.playsinline]: boolean

  /**
   * The current language of the player. This can be any code defined via the `extendLanguage`
   * method or the default `en`. It's recommended to use an ISO 639-1 code as that'll be used by
   * Vime when adding new language defaults in the future.
   */
  [PlayerProp.language]: string

  /**
   * `@readonly` The languages that are currently available. You can add new languages via the
   * `extendLanguage` method.
   */
  [PlayerProp.languages]: string[]

  /**
   * `@readonly` Contains each language and it's respective translation map.
   */
  [PlayerProp.translations]: Record<string, Record<string, string>>,

  /**
   * `@readonly` A dictionary of translations for the current language.
   */
  [PlayerProp.i18n]: Record<string, string>
}
