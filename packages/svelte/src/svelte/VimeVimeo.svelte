
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let videoId;
export let byline = undefined;
export let color = undefined;
export let portrait = undefined;
export let language = undefined;
export let autoplay = undefined;
export let controls = undefined;
export let logger = undefined;
export let loop = undefined;
export let muted = undefined;
export let playsinline = undefined;

export const getAdapter = (...args) => __ref.getAdapter(...args);

export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };

$: if (__mounted) setProp('logger', logger);

const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-vimeo 
  video-id={videoId}
  byline={byline}
  color={color}
  portrait={portrait}
  language={language}
  autoplay={autoplay}
  controls={controls}
  loop={loop}
  muted={muted}
  playsinline={playsinline}
  on:vLoadStart={onEvent}
  bind:this={__ref}
>
  <slot></slot>
</vime-vimeo>
  