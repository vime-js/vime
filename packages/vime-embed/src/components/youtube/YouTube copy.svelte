<svelte:options accessors />

<YouTubeLite
  {videoId}
  {params}
  {cookies}
  {aspectRatio}
  on:load
  on:data
  on:message
  on:reload
  on:data={onData}
  bind:this={lite}
/>

<script context="module">
  import EmbedEvent from '../../EmbedEvent'
  import VideoQuality from '../../VideoQuality'

  export const ListType = Object.freeze({
    PLAYLIST: 'playlist',
    SEARCH: 'search',
    USER_UPLOADS: 'user_uploads'
  })

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

  // @see https://developers.google.com/youtube/iframe_api_reference#Playback_status
  const StateMap = Object.freeze({
    // '-1': IDLE,
    0: EmbedEvent.PLAYBACK_ENDED,
    1: EmbedEvent.PLAYING,
    2: EmbedEvent.PAUSE,
    3: EmbedEvent.BUFFERING,
    5: EmbedEvent.PLAYBACK_READY
  })

  const EventMap = Object.freeze({
    onReady: EmbedEvent.READY,
    initialDelivery: EmbedEvent.LOADED_METADATA
  })

  const Command = Object.freeze({
    PLAY: 'playVideo',
    PAUSE: 'pauseVideo',
    SEEK_TO: 'seekTo',
    MUTE: 'mute',
    UNMUTE: 'unMute',
    GET_VOLUME: 'getVolume',
    SET_VOLUME: 'setVolume'
  })
</script>

<script>
  import { afterUpdate, createEventDispatcher } from 'svelte'
  import { is_string, is_array } from '../../utils/unit'
  import YouTubeLite from './YouTubeLite.svelte'

  const dispatch = createEventDispatcher()

  let lite
  let title
  let duration
  let buffered
  let qualities
  let rates
  let started
  let ended
  let buffering
  let internalTime = 0

  export let videoId = null
  export let params = {}
  // export let events = {}
  export let cookies = false
  export let aspectRatio = null

  export let paused = true
  export let currentTime = 0
  export let muted = false
  export let volume = 30
  export let playsinline = true
  export let controls = true
  // export let autopause = true
  export let autoplay = false
  export let loop = false
  export let quality = null
  export let playbackRate = 1

  export const getLite = () => lite
  export const getSrc = () => lite.getEmbed().getSrc()
  export const getIframe = () => lite.getEmbed().getIframe()
  export const isLiveStream = () => _isLiveStream
  export const isPlaylist = () => _isPlaylist
  export const hasContent = () => _hasContent
  export const getDuration = () => duration
  export const getBuffered = () => buffered
  export const getQualities = () => qualities
  export const getPlaybackRates = () => rates

  const sendCommand = (c, a) => lite.sendCommand(c, a)

  afterUpdate(() => {
    if (lite && currentTime !== internalTime) {
      internalTime = currentTime
      sendCommand(Command.SEEK_TO, [currentTime])
    }
  })

  const onVideoChange = () => {
    paused = true
    currentTime = 0
    internalTime = 0
    muted = false
    volume = 30
    title = null
    duration = 0
    buffered = 0
    buffering = false
    qualities = []
    rates = [1]
    started = false
    ended = false
    quality = null
    playbackRate = 1
  }

  // TODO: set buffering, seeking, seeked

  const update = info => {
    if (!info) return
    if (info.currentTime) currentTime = info.currentTime
    if (info.currentTime) internalTime = info.currentTime
    if (info.duration) duration = info.duration
    if (info.volume) volume = info.volume
    if (info.muted) muted = info.muted
    if (info.availablePlaybackRates) rates = info.availablePlaybackRates
    if (info.availableQualityLevels) qualities = info.availableQualityLevels
    if (info.playbackQuality) quality = QualityMap[info.playbackQuality]
    if (info.playbackRate) playbackRate = info.playbackRate
    if (info.videoLoadedFraction) buffered = info.videoLoadedFraction * duration
    if (info.videoData && info.videoData.title) title = info.videoData.title
    if (info.playerState) dispatch(StateMap[info.playerState])
  }

  const onData = e => {
    const data = e.detail
    const event = data.event
    const info = data.info
    if (event) dispatch(EventMap[event])
    update(info)
    // TODO: not sure how to map the error event.
  }

  // TODO: this will only detect if it's a channel id, How can we detect live video without API?
  $: _isLiveStream = is_string(videoId) && (videoId.length > 11)

  $: _hasList = is_string(params.listType) &&
    is_string(params.list) &&
    Object.values(ListType).includes(params.listType)

  $: _isPlaylist = _hasList || (is_array(params.playlist) && params.playlist.length > 0)
  $: _hasContent = !!videoId || _isPlaylist
  $: if (!_hasContent) console.log('YouTubeEmbed :: couldn\'t find any content to play')
  $: if (videoId) onVideoChange()

  $: params.playsinline = playsinline ? 1 : 0
  $: params.controls = controls ? 1 : 0
  $: params.disablekb = controls ? 1 : 0
  $: params.autoplay = autoplay ? 1 : 0
  $: params.loop = loop ? 1 : 0

  $: if (lite) paused ? sendCommand(Command.PAUSE) : sendCommand(Command.PLAY)
  $: if (lite) muted ? sendCommand(Command.MUTE) : sendCommand(Command.UNMUTE)
  $: if (lite) sendCommand(Command.SET_VOLUME, volume)
  
  $: paused ? dispatch(EmbedEvent.PAUSE) : dispatch(EmbedEvent.PLAY)
  $: dispatch(EmbedEvent.DURATION_CHANGE, duration)
  $: dispatch(EmbedEvent.TIME_UPDATE, currentTime)
  $: dispatch(EmbedEvent.PLAYBACK_RATE_CHANGE, playbackRate)
  $: dispatch(EmbedEvent.PLAYBACK_RATES_CHANGE, rates)
  $: dispatch(EmbedEvent.QUALITY_CHANGE, quality)
  $: dispatch(EmbedEvent.QUALITIES_CHANGE, qualities)
  $: dispatch(EmbedEvent.VOLUME_CHANGE, volume)
  $: dispatch(EmbedEvent.BUFFERED, buffered)
  $: if (buffering) dispatch(EmbedEvent.BUFFERING)
  $: if (started) dispatch(EmbedEvent.PLAYBACK_STARTED)
  $: if (ended) dispatch(EmbedEvent.PLAYBACK_ENDED)
</script>