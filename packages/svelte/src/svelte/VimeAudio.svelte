
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let willAttach = undefined;
export let crossOrigin = undefined;
export let preload = undefined;
export let disableRemotePlayback = undefined;
export let mediaTitle = undefined;

export const getAdapter = (...args) => __ref.getAdapter(...args);

export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-audio 
  will-attach={willAttach}
  cross-origin={crossOrigin}
  preload={preload}
  disable-remote-playback={disableRemotePlayback}
  media-title={mediaTitle}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-audio>
  