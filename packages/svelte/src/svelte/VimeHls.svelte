
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let version = undefined;
export let config = undefined;
export let crossOrigin = undefined;
export let preload = undefined;
export let poster = undefined;
export let controlsList = undefined;
export let autoPiP = undefined;
export let disablePiP = undefined;
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

<vime-hls 
  version={version}
  config={config}
  cross-origin={crossOrigin}
  preload={preload}
  poster={poster}
  controls-list={controlsList}
  auto-pip={autoPiP}
  disable-pip={disablePiP}
  disable-remote-playback={disableRemotePlayback}
  media-title={mediaTitle}
  on:vLoadStart={onEvent}
  bind:this={__ref}
>
  <slot></slot>
</vime-hls>
  