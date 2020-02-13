<Html5Provider
  {player}
  config={html5Config}
  on:providerready
  on:playbackready
  on:playing
  on:ended
  on:buffered
  on:buffering
  on:qualitychange
  on:pipchange
  on:mutechange
  on:volumechange
  on:error
  bind:this={h5Player} 
/>

<script context="module">
  import { is_string } from '~utils/unit'
  import { load_sdk } from '~utils/load'
  import PluginRole from '~core/PluginRole'
  import Html5Provider, { canPlay as html5CanPlay } from './html5/Html5.svelte'

  const html5Config = { forceVideo: true }

  const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i

  export const ID = 'vHls'
  export const ROLE = PluginRole.PROVIDER

  export const DEFAULT_CONFIG = {
    options: {},
    debug: false,
    version: 'latest',
    force: false
  }

  export const getSDK = version => {
    const sdkURL = 'https://unpkg.com/hls.js@{V}/dist/hls.min.js'.replace('{V}', version)
    return load_sdk(sdkURL, 'Hls')
  }

  const canPlayResource = resource => is_string(resource) && HLS_EXTENSIONS.test(resource)
  export const canPlay = src => html5CanPlay(src, canPlayResource)
</script>

<script>
  import { onDestroy, createEventDispatcher } from 'svelte'
  import ProviderEvent from './ProviderEvent'

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player
  export let config = DEFAULT_CONFIG

  const logger = player.createLogger(ID)
  const dispatch = createEventDispatcher()

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let hls
  let h5Player

  export const loadMedia = async newSrc => {
    if (hls) {
      hls.destroy()
      hls = null
    }

    if (!config.force && html5CanPlay(newSrc)) {
      h5Player.loadMedia(newSrc)
      return
    }

    try {
      const Hls = await getSDK(config.version)

      if (!Hls.isSupported()) {
        logger.warn('hls.js is not supported')
        dispatch(ProviderEvent.ERROR, Error('hls.js is not supported'))
        return
      }

      // TODO: Grab bandwidth factor and pass to new instance.
      // @see https://github.com/video-dev/hls.js/blob/master/docs/API.md#abrewmadefaultestimate
      hls = new Hls(config.options)
      hls.attachMedia(await h5Player.getRef())
      hls.on(window.Hls.Events.MEDIA_ATTACHED, () => hls.loadSource(newSrc))
      hls.on(window.Hls.Events.ERROR, (e, data) => {
        if (config.debug || data.fatal) logger.error(data.details)
        dispatch(ProviderEvent.ERROR, e)
      })
    } catch (e) { dispatch(ProviderEvent.ERROR, e) }
  }

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  onDestroy(() => {
    if (hls) hls.destroy()
    hls = null
  })

  // --------------------------------------------------------------
  // Getters + Setters
  // --------------------------------------------------------------

  // Forward all events to the Html5 provider.
  export const getMediaType = async () => h5Player.getMediaType()
  export const getCurrentTime = async () => h5Player.getCurrentTime()
  export const getEl = async () => h5Player.getEl()
  export const getInternalPlayer = async () => hls || h5Player.getInternalPlayer()
  export const getDuration = async () => h5Player.getDuration()
  export const getBuffered = async () => h5Player.getBuffered()
  export const getQualities = async () => h5Player.getQualities()
  export const getPlaybackRates = async () => h5Player.getPlaybackRates()
  export const isPiPSupported = async () => h5Player.isPiPSupported()
  export const setCurrentTime = newTime => { h5Player.setCurrentTime(newTime) }
  export const setMuted = isMuted => { h5Player.setMuted(isMuted) }
  export const setPaused = isPaused => { h5Player.setPaused(isPaused) }
  export const setVolume = newVolume => { h5Player.setVolume(newVolume) }
  export const setPlaybackRate = newPlaybackRate => { h5Player.setPlaybackRate(newPlaybackRate) }
  export const setPiP = isActive => { h5Player.setPiP(isActive) }
  export const setCrossOrigin = option => { h5Player.setCrossOrigin(option) }
  export const setQuality = newQuality => { h5Player.setQuality(newQuality) }
</script>