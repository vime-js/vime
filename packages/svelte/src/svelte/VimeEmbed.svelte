
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let embedSrc = undefined;
export let mediaTitle = undefined;
export let params = undefined;
export let origin = undefined;
export let preconnections = undefined;
export let decoder = undefined;

export const postMessage = (...args) => __ref.postMessage(...args);

export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };

$: if (__mounted) setProp('preconnections', preconnections);
$: if (__mounted) setProp('decoder', decoder);

const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-embed 
  embed-src={embedSrc}
  media-title={mediaTitle}
  params={params}
  origin={origin}
  on:vEmbedSrcChange={onEvent}
  on:vEmbedMessage={onEvent}
  on:vEmbedLoaded={onEvent}
  bind:this={__ref}
>
  <slot></slot>
</vime-embed>
  