
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let gradient = undefined;
export let isVideoView = undefined;
export let isControlsActive = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-scrim 
  gradient={gradient}
  is-video-view={isVideoView}
  is-controls-active={isControlsActive}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-scrim>
  