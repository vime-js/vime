import { MediaType } from './MediaType';
import { ViewType } from './ViewType';

export enum PlayerProp {
  Paused = 'paused',
  Playing = 'playing',
  Duration = 'duration',
  MediaTitle = 'mediaTitle',
  CurrentSrc = 'currentSrc',
  CurrentPoster = 'currentPoster',
  CurrentTime = 'currentTime',
  Seeking = 'seeking',
  Debug = 'debug',
  PlaybackStarted = 'playbackStarted',
  PlaybackEnded = 'playbackEnded',
  PlaybackRate= 'playbackRate',
  PlaybackRates = 'playbackRates',
  PlaybackQuality = 'playbackQuality',
  PlaybackQualities= 'playbackQualities',
  TextTracks = 'textTracks',
  Errors = 'errors',
  PlaybackReady = 'playbackReady',
  Buffered = 'buffered',
  Buffering = 'buffering',
  // eslint-disable-next-line no-shadow
  MediaType = 'mediaType',
  IsAudio = 'isAudio',
  IsVideo = 'isVideo',
  // eslint-disable-next-line no-shadow
  ViewType = 'viewType',
  IsAudioView = 'isAudioView',
  IsVideoView = 'isVideoView',
  IsLive = 'isLive',
  IsCaptionsActive = 'isCaptionsActive',
  IsSettingsActive = 'isSettingsActive',
  CurrentCaption = 'currentCaption',
  IsMobile = 'isMobile',
  IsTouch = 'isTouch',
  IsPiPActive = 'isPiPActive',
  IsFullscreenActive = 'isFullscreenActive',
  Playsinline = 'playsinline',
  Muted = 'muted',
  Volume = 'volume',
  Autopause = 'autopause',
  Controls = 'controls',
  IsControlsActive = 'isControlsActive',
  Autoplay = 'autoplay',
  Loop = 'loop',
  AspectRatio = 'aspectRatio',
  Language = 'language',
  Languages = 'languages',
  Translations = 'translations',
  I18N= 'i18n',
}

export type InternalReadonlyPlayerProps = Pick<PlayerProps, PlayerProp.Autoplay
| PlayerProp.Controls
| PlayerProp.Debug
| PlayerProp.Loop
| PlayerProp.IsAudio
| PlayerProp.IsVideo
| PlayerProp.IsMobile
| PlayerProp.IsTouch
| PlayerProp.IsAudioView
| PlayerProp.IsVideoView
| PlayerProp.IsLive
| PlayerProp.CurrentCaption
| PlayerProp.Autopause
| PlayerProp.AspectRatio
| PlayerProp.Playsinline
| PlayerProp.Languages
| PlayerProp.I18N
>;

export type InternalReadonlyPlayerProp = keyof InternalReadonlyPlayerProps;
export type InternalWritablePlayerProps = Omit<PlayerProps, InternalReadonlyPlayerProp>;
export type InternalWritablePlayerProp = keyof InternalWritablePlayerProps;

const externalWritable = new Set([
  PlayerProp.Autoplay,
  PlayerProp.Autopause,
  PlayerProp.AspectRatio,
  PlayerProp.Controls,
  PlayerProp.Debug,
  PlayerProp.Paused,
  PlayerProp.CurrentTime,
  PlayerProp.Language,
  PlayerProp.Loop,
  PlayerProp.PlaybackQuality,
  PlayerProp.Muted,
  PlayerProp.PlaybackRate,
  PlayerProp.Playsinline,
  PlayerProp.Volume,
]);

/**
 * Determines if a player prop can be changed via the `vime-player` element from the "outside".
 */
export const isExternalReadonlyPlayerProp = (prop: PlayerProp) => !externalWritable.has(prop);

const internalReadonly = new Set<InternalReadonlyPlayerProp>([
  PlayerProp.Autoplay,
  PlayerProp.Controls,
  PlayerProp.Loop,
  PlayerProp.Debug,
  PlayerProp.IsAudio,
  PlayerProp.IsVideo,
  PlayerProp.IsMobile,
  PlayerProp.IsTouch,
  PlayerProp.IsLive,
  PlayerProp.CurrentCaption,
  PlayerProp.IsAudioView,
  PlayerProp.IsVideoView,
  PlayerProp.Autopause,
  PlayerProp.AspectRatio,
  PlayerProp.Playsinline,
  PlayerProp.Languages,
  PlayerProp.I18N,
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
  [PlayerProp.Paused]: true,
  [PlayerProp.CurrentTime]: 0,
  [PlayerProp.Duration]: -1,
  [PlayerProp.Buffered]: 0,
  [PlayerProp.Seeking]: false,
  [PlayerProp.Playing]: false,
  [PlayerProp.Buffering]: false,
  [PlayerProp.PlaybackReady]: false,
  [PlayerProp.MediaTitle]: undefined,
  [PlayerProp.CurrentSrc]: undefined,
  [PlayerProp.CurrentPoster]: undefined,
  [PlayerProp.PlaybackRate]: 1,
  [PlayerProp.PlaybackRates]: [1],
  [PlayerProp.PlaybackQuality]: undefined,
  [PlayerProp.PlaybackQualities]: [],
  [PlayerProp.PlaybackStarted]: false,
  [PlayerProp.PlaybackEnded]: false,
  [PlayerProp.TextTracks]: undefined,
  [PlayerProp.MediaType]: undefined,
  [PlayerProp.IsLive]: false,
  [PlayerProp.IsCaptionsActive]: false,
  [PlayerProp.CurrentCaption]: undefined,
};

export interface PlayerProps {
  /**
   * Whether playback should be paused. Defaults to `true` if no media has loaded or playback has
   * not started. Setting this to `true` will begin/resume playback.
   */
  [PlayerProp.Paused]: boolean

  /**
   * `@readonly` Whether media is actively playing back. Defaults to `false` if no media has
   * loaded or playback has not started.
   */
  [PlayerProp.Playing]: boolean

  /**
   * `@readonly` A `double` indicating the total playback length of the media in seconds. Defaults
   * to `-1` if no media has been loaded. If the media is being streamed live then the duration is
   * equal to `Infinity`.
   */
  [PlayerProp.Duration]: number

  /**
   * `@readonly` The title of the current media. Defaults to `undefined` if no media has been
   * loaded.
   */
  [PlayerProp.MediaTitle]?: string

  /**
   * `@readonly` The absolute URL of the media resource that has been chosen. Defaults to
   * `undefined` if no media has been loaded.
   */
  [PlayerProp.CurrentSrc]?: string

  /**
   * `@readonly` The absolute URL of the poster for the current media resource. Defaults to
   * `undefined` if no media/poster has been loaded.
   */
  [PlayerProp.CurrentPoster]?: string

  /**
   * A `double` indicating the current playback time in seconds. Defaults to `0` if the media has
   * not started to play and has not seeked. Setting this value seeks the media to the new
   * time. The value can be set to a minimum of `0` and maximum of the total length of the
   * media (indicated by the duration prop).
   */
  [PlayerProp.CurrentTime]: number

  /**
   * Whether playback should automatically begin playing once the media is ready to do so. This
   * will only work if the browsers `autoplay` policies have been satisfied. It'll generally work
   * if the player is muted, or the user frequently interacts with your site. You can check
   * if it's possible to autoplay via the `canAutoplay()` or `canMutedAutoplay()` methods.
   * Depending on the provider, changing this prop may cause the player to completely reset.
   */
  [PlayerProp.Autoplay]: boolean

  /**
   * `@readonly` Whether media is ready for playback to begin.
   */
  [PlayerProp.PlaybackReady]: boolean

  /**
   * Whether media should automatically start playing from the beginning every time it ends.
   */
  [PlayerProp.Loop]: boolean

  /**
   * Whether the audio is muted or not.
   */
  [PlayerProp.Muted]: boolean

  /**
   * `@readonly` The length of the media in seconds that has been downloaded by the browser.
   */
  [PlayerProp.Buffered]: number

  /**
   * A `double` indicating the rate at which media is being played back. If the value is `<1` then
   * playback is slowed down; if `>1` then playback is sped up. Defaults to `1`. The playback rate
   * can only be set to a rate found in the `playbackRates` prop. Some providers may not
   * allow changing the playback rate, you can check if it's possible via `canSetPlaybackRate()`.
   */
  [PlayerProp.PlaybackRate]: number

  /**
   * `@readonly` The playback rates available for the current media.
   */
  [PlayerProp.PlaybackRates]: number[]

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
  [PlayerProp.PlaybackQuality]?: string

  /**
   * `@readonly` The media qualities available for the current media.
   */
  [PlayerProp.PlaybackQualities]: string[]

  /**
   * `@readonly` Whether the player is in the process of seeking to a new time position.
   */
  [PlayerProp.Seeking]: boolean

  /**
   * `@readonly` Whether the player is in debug mode and should `console.log` information about
   * its internal state.
   */
  [PlayerProp.Debug]: boolean

  /**
   * `@readonly` Whether the media has initiated playback. In other words it will be true if
   * `currentTime > 0`.
   */
  [PlayerProp.PlaybackStarted]: boolean

  /**
   * `@readonly` Whether media playback has reached the end. In other words it'll be true if
   * `currentTime === duration`.
   */
  [PlayerProp.PlaybackEnded]: boolean

  /**
   * `@readonly` Whether playback has temporarily stopped because of a lack of temporary data.
   */
  [PlayerProp.Buffering]: boolean

  /**
   * Indicates whether a user interface should be shown for controlling the resource. Set this to
   * `false` when you want to provide your own custom controls, and `true` if you want the current
   * provider to supply its own default controls. Depending on the provider, changing this prop
   * may cause the player to completely reset.
   */
  [PlayerProp.Controls]: boolean

  /**
   * Whether the controls are currently visible. This is currently only supported by custom
   * controls.
   */
  [PlayerProp.IsControlsActive]: boolean

  /**
   * `@readonly` A collection of errors that have occurred ordered by `[oldest, ..., newest]`.
   */
  [PlayerProp.Errors]: any[]

  /**
   * `@readonly` The text tracks (WebVTT) associated with the current media.
   */
  [PlayerProp.TextTracks]?: TextTrackList

  /**
   * An `int` between `0` (silent) and `100` (loudest) indicating the audio volume.
   */
  [PlayerProp.Volume]: number

  /**
   * `@readonly` Whether the player is currently in fullscreen mode.
   */
  [PlayerProp.IsFullscreenActive]: boolean

  /**
   * The aspect ratio of the player expressed as `width:height` (`16:9`). This is only applied if
   * the `viewType` is `video` and the player is not in fullscreen mode.
   */
  [PlayerProp.AspectRatio]: string

  /**
   * `@readonly` The type of player view that is being used, whether it's an audio player view or
   * video player view. Normally if the media type is of audio then the view is of type audio, but
   * in some cases it might be desirable to show a different view type. For example, when playing
   * audio with a poster. This is subject to the provider allowing it. Defaults to `undefined`
   * when no media has been loaded.
   */
  [PlayerProp.ViewType]?: ViewType

  /**
   * `@readonly` Whether the current view is of type `audio`, shorthand for
   * `viewType === ViewType.Audio`.
   */
  [PlayerProp.IsAudioView]: boolean

  /**
   * `@readonly` Whether the current view is of type `video`, shorthand for
   * `viewType === ViewType.Video`.
   */
  [PlayerProp.IsVideoView]: boolean

  /**
   * `@readonly` The type of media that is currently active, whether it's audio or video. Defaults
   * to `undefined` when no media has been loaded or the type cannot be determined.
   */
  [PlayerProp.MediaType]?: MediaType

  /**
   * `@readonly` Whether the current media is of type `audio`, shorthand for
   * `mediaType === MediaType.Audio`.
   */
  [PlayerProp.IsAudio]: boolean

  /**
   * `@readonly` Whether the current media is of type `video`, shorthand for
   * `mediaType === MediaType.Video`.
   */
  [PlayerProp.IsVideo]: boolean

  /**
   * `@readonly` Whether the player is in mobile mode. This is determined by parsing
   * `window.navigator.userAgent`.
   */
  [PlayerProp.IsMobile]: boolean

  /**
   * `@readonly` Whether the player is in touch mode. This is determined by listening for
   * mouse/touch events and toggling this value.
   */
  [PlayerProp.IsTouch]: boolean

  /**
   * `@readonly` Whether any captions or subtitles are currently showing.
   */
  [PlayerProp.IsCaptionsActive]: boolean

  /**
   * `@readonly` Whether the settings menu has been opened and is currently visible. This is
   * currently only supported by custom settings.
   */
  [PlayerProp.IsSettingsActive]: boolean

  /**
   * `@readonly` The selected caption/subtitle text track to display. Defaults to `undefined` if
   * there is none. This does not mean this track is active, only that is the current selection. To
   * know if it is active, check the `isCaptionsActive` prop.
   */
  [PlayerProp.CurrentCaption]?: TextTrack

  /**
   * `@readonly` Whether the current media is being broadcast live (`duration === Infinity`).
   */
  [PlayerProp.IsLive]: boolean

  /**
   * `@readonly` Whether the player is currently in picture-in-picture mode.
   */
  [PlayerProp.IsPiPActive]: boolean

  /**
   * Whether the player should automatically pause when another Vime player starts/resumes playback.
   */
  [PlayerProp.Autopause]: boolean

  /**
   * Whether the video is to be played "inline", that is within the element's playback area. Note
   * that setting this to false does not imply that the video will always be played in fullscreen.
   * Depending on the provider, changing this prop may cause the player to completely reset.
   */
  [PlayerProp.Playsinline]: boolean

  /**
   * The current language of the player. This can be any code defined via the `extendLanguage`
   * method or the default `en`. It's recommended to use an ISO 639-1 code as that'll be used by
   * Vime when adding new language defaults in the future.
   */
  [PlayerProp.Language]: string

  /**
   * `@readonly` The languages that are currently available. You can add new languages via the
   * `extendLanguage` method.
   */
  [PlayerProp.Languages]: string[]

  /**
   * `@readonly` Contains each language and it's respective translation map.
   */
  [PlayerProp.Translations]: Record<string, Record<string, string>>,

  /**
   * `@readonly` A dictionary of translations for the current language.
   */
  [PlayerProp.I18N]: Record<string, string>
}
