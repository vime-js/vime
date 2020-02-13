<div {id} bind:this={target}></div>

<script context="module">
  import { is_string } from '~utils/unit'
  import { load_sdk } from '~utils/load'
  import PluginRole from '~core/PluginRole'

  let dmPlayerIDCount = 0

  // eslint-disable-next-line
  const DAILYMOTION_URL = /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?$/

  export const ID = 'vDailymotion'
  export const ROLE = PluginRole.PROVIDER
  export const DEFAULT_CONFIG = { options: {} }

  export const canPlay = src => is_string(src) && DAILYMOTION_URL.test(src)

  export const getSDK = () => load_sdk(
    'https://api.dmcdn.net/all.js',
    'DM',
    'dmAsyncInit',
    DM => DM.player
  )

  export const getPoster = src => {
    const videoId = src.match(DAILYMOTION_URL)[1]

    return window.fetch(`https://api.dailymotion.com/video/${videoId}?fields=thumbnail_1080_url`)
      .then(response => response.json())
      .then(data => data.thumbnail_1080_url)
  }
</script>

<script>
  import { listen } from 'svelte/internal'
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import { parse_start_time } from '~utils/url'
  import { ORIGIN } from '~utils/support'
  import MediaType from '~core/MediaType'
  import ProviderEvent from './ProviderEvent'

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player
  export let config = DEFAULT_CONFIG

  const logger = player.createLogger(ID)
  const dispatch = createEventDispatcher()
  const { isPlaybackReady, hasPlaybackStarted } = player.getStore()

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  // eslint-disable-next-line prefer-const
  dmPlayerIDCount += 1
  const id = `dmPlayer-${dmPlayerIDCount}`

  let target
  let DM
  let dmPlayer
  let controls = false
  let falseStart = true

  export const loadMedia = newSrc => {
    const videoId = newSrc && newSrc.match(DAILYMOTION_URL)[1]

    if (!videoId) {
      logger.warn('failed to load video, could not extract video id.')
      return
    }

    dmPlayer.load({
      video: videoId,
      start: parse_start_time(newSrc)
    })
  }

  // --------------------------------------------------------------
  // Player Setup
  // --------------------------------------------------------------

  const build = async () => {
    // const canMutedPlay = await dmPlayer.canMutedAutoplay()
    const canMutedPlay = false
    // k
    falseStart = canMutedPlay

    // TODO: DM only fires events when playback has started. In native mode this is an issue.
  
    // eslint-disable-next-line new-cap
    dmPlayer = new DM.player(target, {
      params: {
        controls,
        autoplay: canMutedPlay,
        mute: canMutedPlay,
        origin: ORIGIN,
        'ui-logo': false,
        'ui-start-screen-info': false,
        ...config.options
      },
      events: {
        apiready: () => dispatch(ProviderEvent.PROVIDER_READY),
        video_end: () => dispatch(ProviderEvent.ENDED),
        videochange: () => { if (canMutedPlay) falseStart = true },
        playback_ready: () => { if (!canMutedPlay) dispatch(ProviderEvent.PLAYBACK_READY) },
        pause: () => dispatch(ProviderEvent.PAUSE),
        playing: async () => {
          if (falseStart) {
            // When we load the DM player with `autoplay` and `muted` it loads the video with 144p
            // quality. We address that here.
            const qualities = await getQualities()
            // Get the max quality.
            const quality = qualities[0]
            setQuality(quality)
            dispatch(ProviderEvent.QUALITY_CHANGE, quality)
            dispatch(ProviderEvent.PLAYBACK_READY)
            falseStart = false
            return
          }
          console.log('playing')
          dispatch(ProviderEvent.PLAYING)
          dispatch(ProviderEvent.BUFFERING, false)
        },
        volumechange: () => {
          dispatch(ProviderEvent.MUTE_CHANGE, dmPlayer.muted)
          dispatch(ProviderEvent.VOLUME_CHANGE, parseInt(dmPlayer.volume * 100))
        },
        seeking: () => {
          dispatch(ProviderEvent.SEEKING)
          dispatch(ProviderEvent.BUFFERING, true)
        },
        seeked: () => dispatch(ProviderEvent.BUFFERING, false),
        waiting: () => { if (!falseStart) dispatch(ProviderEvent.BUFFERING, true) },
        progress: () => dispatch(ProviderEvent.BUFFERED, dmPlayer.bufferedTime),
        qualitychange: () => {
          const quality = `${dmPlayer.quality}p`
          dispatch(ProviderEvent.QUALITY_CHANGE, quality)
        },
        error: e => dispatch(ProviderEvent.ERROR, e)
      }
    })
  }

  onMount(async () => {
    try {
      DM = await getSDK()
      build()
    } catch (e) { dispatch(ProviderEvent.ERROR, e) }
  })

  onDestroy(() => {
    DM.destroy(id)
    DM = null
    dmPlayer = null
  })

  $: if ($isPlaybackReady) dmPlayer.setControls(controls)

  // --------------------------------------------------------------
  // Getters
  // --------------------------------------------------------------

  export const getMediaType = async () => MediaType.VIDEO
  export const getCurrentTime = async () => dmPlayer.currentTime
  export const getEl = async () => dmPlayer
  export const getInternalPlayer = async () => dmPlayer
  export const getDuration = async () => dmPlayer.duration
  export const getPlaybackRates = async () => null
  export const getQualities = async () => dmPlayer.qualities.map(quality => `${quality}p`)
  export const supportsPiP = async () => false
  export const supportsFullscreen = async () => true

  // --------------------------------------------------------------
  // Setters
  // --------------------------------------------------------------

  export const setCurrentTime = newTime => { dmPlayer.seek(newTime) }
  export const setMuted = isMuted => { dmPlayer.setMuted(isMuted) }
  export const setPaused = isPaused => { isPaused ? dmPlayer.pause() : dmPlayer.play() }
  export const setVolume = newVolume => { dmPlayer.setVolume(newVolume / 100) }
  export const setQuality = newQuality => { dmPlayer.setQuality(newQuality.slice(0, -1)) }
  export const setControls = isEnabled => { controls = isEnabled }
</script>