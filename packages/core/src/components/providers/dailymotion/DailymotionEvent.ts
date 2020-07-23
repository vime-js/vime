/**
 * @see https://developer.dailymotion.com/player/#player-api-events
 */
export enum DailymotionEvent {
  ApiReady = 'apiready',
  VideoChange = 'videochange',
  VolumeChange = 'volumechange',
  PlaybackReady = 'playback_ready',
  Seeking = 'seeking',
  Seeked = 'seeked',
  Waiting = 'waiting',
  Progress = 'progress',
  QualityChange = 'qualitychange',
  QualitiesAvailable = 'qualitiesavailable',
  FullscreenChange = 'fullscreenchange',
  DurationChange = 'durationchange',
  Playing = 'playing',
  Play = 'play',
  Pause = 'pause',
  Start = 'start',
  AdStart = 'ad_start',
  AdPlay = 'ad_play',
  AdEnd = 'ad_end',
  TimeUpdate = 'timeupdate',
  VideoStart = 'video_start',
  VideoEnd = 'video_end',
  Error = 'error',
}
