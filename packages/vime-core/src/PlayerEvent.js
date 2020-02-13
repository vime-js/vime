const PlayerEvent = Object.freeze({
  READY: 'ready',
  PLAYING: 'playing',
  SEEKING: 'seeking',
  SEEKED: 'seeked',
  PLAYBACK_READY: 'playbackready',
  PAUSE: 'pause',
  PLAY: 'play',
  DURATION_CHANGE: 'durationchange',
  TIME_UPDATE: 'timeupdate',
  PLAYBACK_STARTED: 'playbackstarted',
  PLAYBACK_ENDED: 'playbackended',
  RATE_CHANGE: 'ratechange',
  RATES_CHANGE: 'rateschange',
  QUALITY_CHANGE: 'qualitychange',
  QUALITIES_CHANGE: 'qualitieschange',
  VOLUME_CHANGE: 'volumechange',
  MUTE_CHANGE: 'mutechange',
  BUFFERING: 'buffering',
  BUFFERED: 'buffered',
  ERROR: 'error'
})

export default PlayerEvent
