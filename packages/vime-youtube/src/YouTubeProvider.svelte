<YouTubeLite
  {videoId}
  {params}
  {cookies}
  {aspectRatio}
  on:data={onData}
  bind:this={lite}
/>

<script context="module">
  import { VideoQuality } from '@vime/core'
  import { load_image } from '@vime/utils'

  const getPoster = videoId => {
    if (!videoId) return Promise.resolve(null)
    const posterSrc = quality => `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`
    // We are testing a that the image has a min-width of 121px because if the thumbnail does
    // not exist YouTube returns a blank/error image that is 120px wide.
    return load_image(posterSrc('maxresdefault'), 121) // 1080p (no padding)
      .catch(() => load_image(posterSrc('sddefault'), 121)) // 640p (padded 4:3)
      .catch(() => load_image(posterSrc('hqdefault'), 121)) // 480p (padded 4:3)
      .then(img => img.src || null)
  }

  // @see https://developers.google.com/youtube/player_parameters#Selecting_Content_to_Play
  const ListType = Object.freeze({
    PLAYLIST: 'playlist',
    SEARCH: 'search',
    USER_UPLOADS: 'user_uploads'
  })

  // @see https://developers.google.com/youtube/iframe_api_reference#Events
  const QualityMap = Object.freeze({
    unknown: VideoQuality.UNKNOWN,
    tiny: VideoQuality.XXS,
    small: VideoQuality.XS,
    medium: VideoQuality.S,
    large: VideoQuality.M,
    hd720: VideoQuality.L,
    hd1080: VideoQuality.XL,
    highres: VideoQuality.XXL,
    max: VideoQuality.MAX
  })

  // @see https://developers.google.com/youtube/iframe_api_reference#Playback_controls
  const Command = Object.freeze({
    PLAY: 'playVideo',
    PAUSE: 'pauseVideo',
    SEEK_TO: 'seekTo',
    MUTE: 'mute',
    UNMUTE: 'unMute',
    SET_VOLUME: 'setVolume',
    SET_PLAYBACK_RATE: 'setPlaybackRate'
  })
</script>

<script>
  import { tick, createEventDispatcher } from 'svelte'
  import { is_string, is_array } from '@vime/utils'
  import { PlayerEvent, MediaType } from '@vime/core'
  import YouTubeLite from './YouTubeLite.svelte'

  let lite
  let duration = 0
  let internalTime = 0
  let rebuilding = false

  const params = {
    rel: 0,
    fs: 1,
    iv_load_policy: 3,
    widget_referrer: window.location.href
  }

  const dispatch = createEventDispatcher()
  const sendCommand = (command, args) => lite && lite.sendCommand(command, args)

  export let videoId
  export let cookies = false
  export let aspectRatio = null

  export const getLite = () => lite
  
  export const setPaused = paused => paused ? sendCommand(Command.PAUSE) : sendCommand(Command.PLAY)
  export const setMuted = muted => muted ? sendCommand(Command.MUTE) : sendCommand(Command.UNMUTE)
  export const setVolume = volume => sendCommand(Command.SET_VOLUME, [volume])
  export const setRate = rate => sendCommand(Command.SET_PLAYBACK_RATE, [rate])
  export const setCurrentTime = time => sendCommand(Command.SEEK_TO, [time])
  export const setPlaysinline = enabled => { params.playsinline = enabled ? 1 : 0 }
  export const setControls = enabled => {
    params.controls = enabled ? 1 : 0
    params.disablekb = enabled ? 0 : 1
  }

  export const supportsPiP = () => false
  export const supportsFullscreen = () => true

  // @see https://developers.google.com/youtube/iframe_api_reference#Events
  const onEvent = event => {
    if (event === 'onReady') {
      dispatch(PlayerEvent.READY)
      dispatch(PlayerEvent.MEDIA_TYPE_CHANGE, MediaType.VIDEO)
    }
  }

  // @see https://developers.google.com/youtube/iframe_api_reference#Playback_status
  const onStateChange = state => {
    if (state === 0) dispatch(PlayerEvent.ENDED)
    if (state === 1) dispatch(PlayerEvent.PLAYING)
    if (state === 2) dispatch(PlayerEvent.PAUSE)
    dispatch(PlayerEvent.BUFFERING, state === 3)
    if (state === 5) {
      duration = 0
      internalTime = 0
      dispatch(PlayerEvent.PLAYBACK_READY)
      if (rebuilding) {
        dispatch(PlayerEvent.REBUILD_END)
        rebuilding = false
      }
    }
  }

  const onTimeUpdate = time => {
    // Unfortunately this can't detect anything when YT is paused until after the
    // seeking has completed, no updates are received in between.
    if (Math.abs(internalTime - time) > 1) dispatch(PlayerEvent.SEEKING)
    internalTime = time
    dispatch(PlayerEvent.TIME_UPDATE, time)
  }

  const onBuffered = async buffered => {
    dispatch(PlayerEvent.BUFFERED, buffered)
    await tick()
    // If paused this is the only way to notify the player of seeked.
    if (buffered > internalTime) dispatch(PlayerEvent.SEEKED)
  }

  const onInfoUpdate = info => {
    if (!info) return
    const {
      volume, muted, availablePlaybackRates: rates,
      playbackQuality: quality, playbackRate: rate, videoLoadedFraction: loadedFraction,
      videoData, availableQualityLevels: qualities, currentTime, 
      duration: _duration, playerState
    } = info
    if (playerState) onStateChange(playerState)
    if (currentTime) onTimeUpdate(currentTime)
    if (volume) dispatch(PlayerEvent.VOLUME_CHANGE, volume)
    if (muted) dispatch(PlayerEvent.MUTE_CHANGE, muted)
    if (rates) dispatch(PlayerEvent.RATES_CHANGE, rates)
    if (qualities) dispatch(PlayerEvent.QUALITIES_CHANGE, qualities)
    if (quality) dispatch(PlayerEvent.QUALITY_CHANGE, QualityMap[quality])
    if (rate) dispatch(PlayerEvent.RATE_CHANGE, rate)
    if (_duration) dispatch(PlayerEvent.DURATION_CHANGE, duration)
    if (_duration) duration = _duration
    if (loadedFraction) onBuffered(loadedFraction * duration)
    if (videoData && videoData.title) dispatch(PlayerEvent.TITLE_CHANGE, videoData.title)
  }

  const onData = e => {
    const { event, info } = e.detail
    event && onEvent(event)
    onInfoUpdate(info)
    // TODO: not sure how to map the error event.
  }

  // If the videoId is the same but params change then the player is rebuilding.
  const onRebuild = () => {
    rebuilding = true
    dispatch(PlayerEvent.REBUILD_START)
  }

  const onSrcChange = async () => {
    await tick()
    dispatch(PlayerEvent.SRC_CHANGE, lite.getSrc())
  }

  let prevVideoId
  $: (prevVideoId === videoId) ? onRebuild(params) : (prevVideoId = videoId)
  
  $: onSrcChange(videoId)
  $: getPoster(videoId).then(poster => dispatch(PlayerEvent.POSTER_CHANGE, poster))

  // TODO: Maybe we just expose -> listType + list and playslist functionality
  // $: _hasList = is_string(params.listType) &&
  //   is_string(params.list) &&
  //   Object.values(ListType).includes(params.listType)
  // $: _isPlaylist = _hasList || (is_array(params.playlist) && params.playlist.length > 0)
  // $: _hasContent = !!videoId || _isPlaylist
  // $: if (!_hasContent) console.log('YouTubeEmbed :: couldn\'t find any content to play')

  // TODO: this will only detect if it's a channel id, How can we detect live video without API?
  // $: $live = is_string(videoId) && (videoId.length > 11)
</script>