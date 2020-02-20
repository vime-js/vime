<svelte:window on:message={onMessage} />

<Lazy let:intersecting >
  {#if intersecting}
    <div use:setAspectRatio={aspectRatio || '16:9'}>
      <iframe
        {id}
        {title}
        src={srcWithParams}
        frameborder="0"
        allowfullscreen="1"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        on:load
        bind:this={iframe}
      ></iframe>
    </div>
  {/if}
</Lazy>

<script context="module">
  let idCount = 0
  const preconnected = []
</script>

<script>
  import { createEventDispatcher } from 'svelte'
  import { is_string, prefetch, parse_url, add_params_to_url } from '@vime/utils'
  import { aspectRatio as setAspectRatio } from '../actions'
  import Lazy from './Lazy.svelte'

  let iframe
  let srcWithParams
  let hasLoaded = false

  // eslint-disable-next-line prefer-const
  idCount += 1
  const id = `vime-embed-${idCount}`
  const dispatch = createEventDispatcher()

  export let src = null
  export let title = null
  export let params = {}
  export let aspectRatio = null
  export let preconnections = []
  export let decoder = () => null

  export const getId = () => id
  export const getIframe = () => iframe
  export const getSrc = () => srcWithParams

  export const postMessage = (message, target = '*', transfer) => {
    if (!iframe || !iframe.contentWindow) return
    iframe.contentWindow.postMessage(JSON.stringify(message), target, transfer)
  }

  const originMatches = e => {
    if (!iframe || e.source !== iframe.contentWindow) return false
    return (is_string(host) && (host === e.origin)) || host.test(e.origin)
  }

  const onMessage = e => {
    if (!originMatches(e)) return
    dispatch('message', e)
    const data = decoder(e.data)
    if (data) dispatch('data', data)
  }

  $: srcWithParams = src ? add_params_to_url(src, params) : null
  $: host = src ? `${parse_url(src).protocol}//${parse_url(src).hostname}` : null
  $: (srcWithParams && hasLoaded) ? dispatch('reload') : (srcWithParams && (hasLoaded = true))
  
  $: if (srcWithParams && !iframe && !preconnected.includes(srcWithParams)) {
    if (prefetch('preconnect', srcWithParams)) preconnected.push(srcWithParams)
  }

  // TODO: improve preconnections
  // @see https://github.com/ampproject/amphtml/blob/master/src/preconnect.js
  $: preconnections
    .filter(p => !preconnected.includes(p))
    .forEach(url => { if (prefetch('preconnect', url)) preconnected.push(url) })
</script>

<style>
  div {
    position: relative;
    padding-bottom: 56.25%;
    background: #000;
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    border: 0;
    user-select: none;
    width: 100%;
    height: 100%;
  }
</style>