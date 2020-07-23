/**
 * @see https://developer.vimeo.com/player/sdk/reference#events-for-playback-controls
 */
export enum VimeoEvent {
  Play = 'play',
  Pause = 'pause',
  Seeking = 'seeking',
  Seeked = 'seeked',
  TimeUpdate = 'timeupdate',
  VolumeChange = 'volumechange',
  DurationChange = 'durationchange',
  FullscreenChange = 'fullscreenchange',
  CueChange = 'cuechange',
  Progress = 'progress',
  Error = 'error',
  PlaybackRateChange = 'playbackratechange',
  Loaded = 'loaded',
  BufferStart = 'bufferstart',
  BufferEnd = 'bufferend',
  TextTrackChange = 'texttrackchange',
  Waiting = 'waiting',
  Ended = 'ended'
}

export enum VimeoDataEvent {
  Play = 'play',
  Pause = 'pause',
  Ready = 'ready',
  PlayProgress = 'playProgress',
  LoadProgress = 'loadProgress',
  BufferStart = 'bufferstart',
  BufferEnd = 'bufferend',
  Loaded = 'loaded',
  Finish = 'finish',
  Seeking = 'seeking',
  Seeked = 'seek',
  CueChange = 'cuechange',
  FullscreenChange = 'fullscreenchange',
  VolumeChange = 'volumechange',
  DurationChange = 'durationchange',
  PlaybackRateChange = 'playbackratechange',
  TextTrackChange = 'texttrackchange',
  Error = 'error',
}

export interface VimeoProgressPayload {
  seconds: number
  percent: number
  duration: number
}

export interface VimeoDataEventPayload {
  [VimeoDataEvent.Play]: void
  [VimeoDataEvent.Pause]: void
  [VimeoDataEvent.Ready]: void
  [VimeoDataEvent.PlayProgress]: VimeoProgressPayload
  [VimeoDataEvent.LoadProgress]: VimeoProgressPayload
  [VimeoDataEvent.BufferStart]: void
  [VimeoDataEvent.BufferEnd]: void
  [VimeoDataEvent.Loaded]: void
  [VimeoDataEvent.Finish]: void
  [VimeoDataEvent.Seeking]: void
  [VimeoDataEvent.Seeked]: void
  [VimeoDataEvent.CueChange]: void
  [VimeoDataEvent.FullscreenChange]: { fullscreen: boolean }
  [VimeoDataEvent.VolumeChange]: { volume: number }
  [VimeoDataEvent.DurationChange]: { duration: number }
  [VimeoDataEvent.PlaybackRateChange]: { playbackRate: number }
  [VimeoDataEvent.TextTrackChange]: void
  [VimeoDataEvent.Error]: any
}
