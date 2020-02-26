<svelte:window on:message={onMessage} />

<Lazy let:intersecting>
  {#if intersecting}
    <div use:setAspectRatio={aspectRatio}>
      <iframe
        {id}
        {title}
        src={srcWithParams}
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

  const Event = {
    SRC_CHANGE: 'srcchange',
    MESSAGE: 'message',
    DATA: 'data',
    PARAMS_CHANGE: 'paramschange'
  }
</script>

<script>
  import { createEventDispatcher } from 'svelte'
  import Lazy from './Lazy.svelte'
  import { aspectRatio as setAspectRatio } from '../actions'
  import { is_string, prefetch, add_params_to_url } from '@vime/utils'

  let iframe
  let srcWithParams
  let prevSrc = null

  // eslint-disable-next-line prefer-const
  idCount += 1
  const id = `vime-embed-${idCount}`
  const dispatch = createEventDispatcher()

  export let src = null
  export let title = null
  export let params = {}
  export let origin = null
  export let preconnections = []
  export let aspectRatio = null
  export let decoder = d => d

  export const getId = () => id
  export const getSrc = () => srcWithParams
  export const getIframe = () => iframe

  export const postMessage = (message, target, transfer) => {
    if (!iframe || !iframe.contentWindow) return
    iframe.contentWindow.postMessage(JSON.stringify(message), target || origin || '*', transfer)
  }

  const originMatches = e => {
    if (!iframe || e.source !== iframe.contentWindow) return false
    return (is_string(origin) && (origin === e.origin)) || origin.test(e.origin)
  }

  const onMessage = e => {
    if (!originMatches(e)) return
    dispatch(Event.MESSAGE, e)
    const data = decoder(e.data)
    if (data) dispatch(Event.DATA, data)
  }

  $: srcWithParams = src ? add_params_to_url(src, params) : null
  $: dispatch(Event.SRC_CHANGE, srcWithParams)
  $: (prevSrc === src) ? dispatch(Event.PARAMS_CHANGE, params) : (prevSrc = src)

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