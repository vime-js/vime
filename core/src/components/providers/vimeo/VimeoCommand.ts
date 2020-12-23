import { VimeoEvent } from './VimeoEvent';

/**
 * @see https://developer.vimeo.com/player/sdk/reference#methods-for-playback-controls
 */
export const enum VimeoCommand {
  Play = 'play',
  Pause = 'pause',
  SetMuted = 'setMuted',
  SetVolume = 'setVolume',
  GetDuration = 'getDuration',
  GetCurrentTime = 'getCurrentTime',
  SetCurrentTime = 'setCurrentTime',
  SetPlaybackRate = 'setPlaybackRate',
  AddEventListener = 'addEventListener',
  GetVideoTitle = 'getVideoTitle',
  GetTextTracks = 'getTextTracks',
  EnableTextTrack = 'enableTextTrack',
  DisableTextTrack = 'disableTextTrack',
}

export interface VimeoCommandArg {
  [VimeoCommand.Play]: void
  [VimeoCommand.Pause]: void
  [VimeoCommand.SetMuted]: boolean
  [VimeoCommand.SetVolume]: number
  [VimeoCommand.GetDuration]: void
  [VimeoCommand.GetCurrentTime]: void
  [VimeoCommand.SetCurrentTime]: number
  [VimeoCommand.SetPlaybackRate]: number
  [VimeoCommand.AddEventListener]: VimeoEvent
  [VimeoCommand.GetVideoTitle]: string
  [VimeoCommand.GetTextTracks]: void
  [VimeoCommand.EnableTextTrack]: void
  [VimeoCommand.DisableTextTrack]: void
}
