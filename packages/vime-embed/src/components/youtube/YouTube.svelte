<svelte:options accessors />

<YouTubeLite
  {cookies}
  videoId={$videoId}
  params={$params}
  aspectRatio={$aspectRatio}
  on:load
  on:data
  on:message
  on:reload
  on:data={onData}
  bind:this={$lite}
/>

<script context="module">
  import VideoQuality from '../../VideoQuality'

  const ListType = Object.freeze({
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

  const Command = Object.freeze({
    PLAY: 'playVideo',
    PAUSE: 'pauseVideo',
    SEEK_TO: 'seekTo',
    MUTE: 'mute',
    UNMUTE: 'unMute',
    SET_VOLUME: 'setVolume'
  })
</script>

<script>
  import { afterUpdate } from 'svelte'
  import { is_string, is_array } from '../../utils/unit'
  import { map_store_to_component } from '../../utils/store'
  import buildStore from '../../store'
  import YouTubeLite from './YouTubeLite.svelte'

  let internalTime = 0

  export let cookies = false

  const _store = buildStore()
  const store = _store.private
  
  const onPropsChange = map_store_to_component(_store.public)
  $: onPropsChange($$props)

  const {
    lite, playsinline, controls,
    autoplay, params, loop,
    videoId, aspectRatio, currentTime,
    duration, volume, paused,
    muted, playing, rate
  } = store

  export const isPlaylist = () => _isPlaylist
  export const hasContent = () => _hasContent
  export const isLiveStream = () => _isLiveStream

  export const getStore = () => _store.public
  export const getSrc = () => $lite.getEmbed().getSrc()
  export const getIframe = () => $lite.getEmbed().getIframe()

  let _currentTimeLastUpdated
  export const getCurrentTime = () => {
    let time = $currentTime
    if ($playing) {
      const elapsedTime = (Date.now() / 1E3 - _currentTimeLastUpdated) * $rate
      if (elapsedTime > 0) (time += Math.min(elapsedTime, 1))
    }
    return time
  }

  const sendCommand = (c, a) => $lite && $lite.sendCommand(c, a)

  afterUpdate(() => {
    if ($currentTime !== internalTime) {
      internalTime = $currentTime
      store.seeking.set(true)
      sendCommand(Command.SEEK_TO, [$currentTime])
    }
  })

  const EventMap = {
    onReady: () => { store.ready.set(true) }
  }

  // @see https://developers.google.com/youtube/iframe_api_reference#Playback_status
  const StateMap = {
    0: () => store.ended.set(true),
    1: () => store.playing.set(true),
    2: () => store.paused.set(true),
    3: () => store.buffering.set(true),
    5: () => {
      internalTime = 0
      _currentTimeLastUpdated = 0
      store.playbackReady.set(true)
    }
  }

  const onInfoUpdate = info => {
    if (!info) return
    if (info.currentTime) {
      const time = info.currentTime
      if (Math.abs(internalTime - time) > 1) store.seeking.set(true)
      $currentTime = time
      internalTime = time
    }
    if (info.currentTimeLastUpdated_) { _currentTimeLastUpdated = info.currentTimeLastUpdated_ }
    if (info.duration) $duration = info.duration
    if (info.volume) $volume = info.volume
    if (info.muted) $muted = info.muted
    if (info.availablePlaybackRates) store.rates.set(info.availablePlaybackRates)
    if (info.availableQualityLevels) store.qualities.set(info.availableQualityLevels)
    if (info.playbackQuality) store.quality.set(QualityMap[info.playbackQuality])
    if (info.playbackRate) $rate = info.playbackRate
    if (info.videoLoadedFraction) store.buffered.set(info.videoLoadedFraction * $duration)
    if (info.videoData && info.videoData.title) store.title.set(info.videoData.title)
    if (info.playerState) StateMap[info.playerState] && StateMap[info.playerState]()
  }

  // seekable
  // playedRanges

  const onData = e => {
    const data = e.detail
    const event = data.event
    const info = data.info
    event && EventMap[event] && EventMap[event]()
    onInfoUpdate(info)
    // TODO: not sure how to map the error event.
  }

  // TODO: this will only detect if it's a channel id, How can we detect live video without API?
  $: _isLiveStream = is_string($videoId) && ($videoId.length > 11)

  $: _hasList = is_string($params.listType) &&
    is_string($params.list) &&
    Object.values(ListType).includes($params.listType)

  $: _isPlaylist = _hasList || (is_array($params.playlist) && $params.playlist.length > 0)
  $: _hasContent = !!$videoId || _isPlaylist
  $: if (!_hasContent) console.log('YouTubeEmbed :: couldn\'t find any content to play')

  $: $params.playsinline = $playsinline ? 1 : 0
  $: $params.controls = $controls ? 1 : 0
  $: $params.disablekb = $controls ? 1 : 0
  $: $params.autoplay = $autoplay ? 1 : 0
  $: $params.loop = $loop ? 1 : 0

  $: $paused ? sendCommand(Command.PAUSE) : sendCommand(Command.PLAY)
  $: $muted ? sendCommand(Command.MUTE) : sendCommand(Command.UNMUTE)
  $: sendCommand(Command.SET_VOLUME, [$volume])

  $: console.log('paused', $paused)

  setTimeout(() => {
    $currentTime = 50
  }, 1000)
</script>