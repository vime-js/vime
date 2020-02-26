const ProviderEvent = Object.freeze({
  PROVIDER_READY: 'providerready',
  PLAYBACK_READY: 'playbackready',
  REBUILD: 'rebuild',
  REBUILD_END: 'rebuildend',
  PLAYING: 'playing',
  ENDED: 'ended',
  PAUSE: 'pause',
  SEEKING: 'seeking',
  BUFFERED: 'buffered',
  BUFFERING: 'buffering',
  RATE_CHANGE: 'ratechange',
  QUALITY_CHANGE: 'qualitychange',
  PIP_CHANGE: 'pipchange',
  MUTE_CHANGE: 'mutechange',
  VOLUME_CHANGE: 'volumechange',
  ERROR: 'error'
});

export default ProviderEvent;
