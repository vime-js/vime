<svelte:options accessors />

<Embed
  {src}
  {title}
  {params}
  {aspectRatio}
  {origin}
  decoder={DECODER}
  preconnections={PRECONNECTIONS}
  on:load
  on:data
  on:message
  on:paramschange
  on:load={onLoad}
  on:data={onData}
  on:srcchange={onReload}
  bind:this={embed}
/>

<script context="module">
  import { decode_json } from '@vime/utils'
  
  const YT = {
    Origin: {
      WITH_COOKIES: 'https://www.youtube.com',
      WITHOUT_COOKIES: 'https://www.youtube-nocookie.com'
    },
    Event: {
      READY: 'onReady'
    }
  }

  const DECODER = decode_json

  const PRECONNECTIONS = [
    YT.Origin.WITH_COOKIES,
    YT.Origin.WITHOUT_COOKIES,
    'https://www.google.com',
    'https://googleads.g.doubleclick.net',
    'https://static.doubleclick.net',
    'https://s.ytimg.com',
    'https://i.ytimg.com'
  ]

  const Event = {
    TITLE_CHANGE: 'titlechange',
    ORIGIN_CHANGE: 'originchange',
    SRC_CHANGE: 'srcchange'
  }
</script>

<script>
  import { tick, onMount, createEventDispatcher } from 'svelte'
  import { deferred } from '@vime/utils'
  import { Embed } from '@vime/core'

  const dispatch = createEventDispatcher()

  let embed
  let src = null
  let videoTitle = ''
  let ready = deferred()
  let initialized = false

  export let params = {}
  export let srcId = null
  export let cookies = false
  export let aspectRatio = '16:9'

  export const getSrc = () => src
  export const getOrigin = () => origin
  export const getTitle = () => videoTitle
  export const getIframe = () => embed.getIframe()
  export const getSrcWithParams = () => embed.getSrc()

  export const sendCommand = async (command, args) => {
    await tick()
    await ready.promise
    embed.postMessage({
      event: 'command',
      func: command,
      args: args || ''
    })
  }

  const buildSrc = () => {
    if (!srcId) return null
    const base = `${origin}/embed/`
    const vId = window.encodeURIComponent(srcId || '')
    return `${base}${vId}?enablejsapi=1`
  }

  const onLoad = () => embed.postMessage({ event: 'listening' })
  
  const onReload = () => {
    ready = deferred()
    initialized = false
  }

  const onSrcChange = () => { videoTitle = '' }

  const onVideoData = videoData => {
    const { title } = videoData
    if (title) {
      videoTitle = title
      initialized = true
    }
  }

  const onInfo = info => {
    const { videoData } = info
    if (videoData) onVideoData(videoData)
  }

  const _onData = e => {
    const data = e.detail
    if (data.event && data.event === YT.Event.READY) ready.resolve()
    if (data.info) onInfo(data.info)
  }

  $: title = `YouTube ${videoTitle || 'Video Player'}`
  $: origin = cookies ? YT.Origin.WITH_COOKIES : YT.Origin.WITHOUT_COOKIES
  $: src = buildSrc(origin, srcId)
  $: onData = !initialized ? _onData : null
  
  let mounted = false
  onMount(() => { mounted = true })
  
  $: if (mounted) dispatch(Event.TITLE_CHANGE, videoTitle)
  $: if (mounted) dispatch(Event.ORIGIN_CHANGE, origin)
  $: if (mounted) dispatch(Event.SRC_CHANGE, { id: srcId, src })
</script>