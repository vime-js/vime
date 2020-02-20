<svelte:options accessors />

<Embed
  {src}
  {title}
  {params}
  {decoder}
  {aspectRatio}
  {preconnections}
  on:load
  on:data
  on:message
  on:reload
  on:load={onLoad}
  on:data={onData}
  on:reload={onReload}
  bind:this={embed}
/>

<script>
  import { tick } from 'svelte'
  import { deferred, decode_json } from '@vime/utils'
  import { Embed } from '@vime/core'

  let src
  let embed
  let videoTitle
  let ready = deferred()

  const decoder = decode_json

  const preconnections = [
    'https://www.youtube.com',
    'https://www.youtube-nocookie.com',
    'https://www.google.com',
    'https://googleads.g.doubleclick.net',
    'https://static.doubleclick.net',
    'https://s.ytimg.com',
    'https://i.ytimg.com'
  ]

  export let params = {}
  export let videoId = null
  export let cookies = false
  export let aspectRatio = null

  export const getEmbed = () => embed
  export const getTitle = () => videoTitle
  export const getIframe = () => embed.getIframe()
  export const getSrc = () => src
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

  const onLoad = () => embed.postMessage({ event: 'listening' })
  
  const onReload = () => {
    ready = deferred()
    videoTitle = null
  }

  const extractVideoTitle = info => {
    const title = info && info.videoData && info.videoData.title
    if (title) videoTitle = title
  }

  const onData = e => {
    const data = e.detail
    if (data.event && data.event === 'onReady') ready.resolve()
    if (!videoTitle) extractVideoTitle(data.info)
  }

  $: title = `YouTube ${videoTitle || 'Video Player'}`

  $: {
    const base = `https://www.youtube${cookies ? '' : '-nocookie'}.com/embed/`
    const vId = window.encodeURIComponent(videoId || '')
    const content = (videoId && videoId.length > 11) ? `live_stream?channel=${vId}&` : `${vId}?`
    src = `${base}${content}enablejsapi=1`
  }
</script>