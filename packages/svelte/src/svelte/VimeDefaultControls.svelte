
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let activeDuration = undefined;
export let waitForPlaybackStart = undefined;
export let hideWhenPaused = undefined;
export let hideOnMouseLeave = undefined;
export let isMobile = undefined;
export let isLive = undefined;
export let isAudioView = undefined;
export let isVideoView = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-default-controls 
  active-duration={activeDuration}
  wait-for-playback-start={waitForPlaybackStart}
  hide-when-paused={hideWhenPaused}
  hide-on-mouse-leave={hideOnMouseLeave}
  is-mobile={isMobile}
  is-live={isLive}
  is-audio-view={isAudioView}
  is-video-view={isVideoView}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-default-controls>
  