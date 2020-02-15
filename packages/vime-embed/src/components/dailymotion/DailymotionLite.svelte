<svelte:options accessors />

<VideoEmbed
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
  on:data={onData}
  on:reload={onReload}
  bind:this={embed}
/>

<script>
  import { tick } from 'svelte'
  import { deferred, decode_query_string } from '@vime/utils'
  import VideoEmbed from '../VideoEmbed.svelte'

  let src
  let embed
  let ready = deferred()

  const title = 'Dailymotion - Video Player'
  const decoder = decode_query_string

  const preconnections = [
    'https://www.dailymotion.com',
    'https://static1.dmcdn.net'
  ]

  export let videoId = null
  export let params = {}
  export let aspectRatio = null

  export const getEmbed = () => embed

  export const sendCommand = async (command, args) => {
    await tick()
    await ready.promise
    embed.postMessage({
      command,
      parameters: args || []
    })
  }

  const onReload = () => {
    ready.reject()
    ready = deferred()
  }

  const onData = e => {
    const data = e.detail
    if (data.event === 'apiready') ready.resolve()
  }

  $: {
    const vId = window.encodeURIComponent(videoId || '')
    const base = 'https://www.dailymotion.com/embed'
    src = `${base}${videoId ? `/video/${vId}` : ''}?api=1`
  }
</script>