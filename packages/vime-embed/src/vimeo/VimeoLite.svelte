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
  on:data={onData}
  on:reload={onReload}
  bind:this={embed}
/>

<script>
  import { tick } from 'svelte'
  import { deferred, decode_json } from '@vime/utils'
  import Embed from '../Embed.svelte'

  let src
  let embed
  let ready = deferred()

  const title = 'Vimeo - Video Player'
  const decoder = decode_json
  const blankVideoId = '390460225'

  const preconnections = [
    'https://player.vimeo.com',
    'https://i.vimeocdn.com',
    'https://f.vimeocdn.com',
    'https://fresnel.vimeocdn.com'
  ]

  export let videoId = null
  export let params = {}
  export let aspectRatio = null

  export const getEmbed = () => embed

  export const sendCommand = async (command, args) => {
    await tick()
    await ready.promise
    embed.postMessage({
      method: command,
      value: args || ''
    })
  }

  const onReload = () => {
    ready.reject()
    ready = deferred()
  }

  const onData = e => {
    const data = e.detail

    const isError = data && data.event === 'error'
    const isReadyError = isError && data.data && data.data.method === 'ready'

    if (isReadyError) {
      const error = new Error(data.data.message)
      error.name = data.data.name
      ready.reject(error)
      return
    }

    const isReadyEvent = data && data.event === 'ready'
    if (isReadyEvent) ready.resolve()
  }

  $: {
    const vId = window.encodeURIComponent(videoId || blankVideoId)
    const base = 'https://player.vimeo.com/video/'
    src = `${base}${vId}`
  }
</script>