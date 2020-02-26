const PlayerEvent = Object.freeze({
  MOUNT: 'mount',
  DESTROY: 'destroy',
  PLUGIN_MOUNT: 'pluginmount',
  PLUGIN_DESTROY: 'plugindestroy',
  CUE: 'cue',
  DURATION_CHANGE: 'durationchange',
  LOCALE_CHANGE: 'localechange',
  POSTER_CHANGE: 'posterchange',
  CONFIG_CHANGE: 'configchange',
  TRACK_CHANGE: 'trackchange',
  TRACKS_CHANGE: 'trackschange',
  LANGUAGES_CHANGE: 'languageschange',
  PROVIDER_CHANGE: 'providerchange',
  ENTER_PIP: 'enterpip',
  EXIT_PIP: 'exitpip',
  ENTER_FULLSCREEN: 'enterfullscreen',
  EXIT_FULLSCREEN: 'exitfullscreen',
  SHOW_CONTROLS: 'showcontrols',
  HIDE_CONTROLS: 'hidecontrols',
  ERROR: 'error'
})

export default PlayerEvent
