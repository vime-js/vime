
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let useOnMobile = undefined;
export let paused = undefined;
export let isVideoView = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-click-to-play 
  use-on-mobile={useOnMobile}
  paused={paused}
  is-video-view={isVideoView}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-click-to-play>
  