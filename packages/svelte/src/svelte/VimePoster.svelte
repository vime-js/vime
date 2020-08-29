
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let fit = undefined;
export let isVideoView = undefined;
export let currentPoster = undefined;
export let mediaTitle = undefined;
export let playbackStarted = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-poster 
  fit={fit}
  is-video-view={isVideoView}
  current-poster={currentPoster}
  media-title={mediaTitle}
  playback-started={playbackStarted}
  on:vLoaded={onEvent}
  on:vWillShow={onEvent}
  on:vWillHide={onEvent}
  bind:this={__ref}
>
  <slot></slot>
</vime-poster>
  