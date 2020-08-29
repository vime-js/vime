
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let isVideoView = undefined;
export let playsinline = undefined;
export let isFullscreenActive = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-ui 
  is-video-view={isVideoView}
  playsinline={playsinline}
  is-fullscreen-active={isFullscreenActive}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-ui>
  