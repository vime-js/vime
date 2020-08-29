
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let hidden = undefined;
export let controlsHeight = undefined;
export let isControlsActive = undefined;
export let isVideoView = undefined;
export let playbackStarted = undefined;
export let textTracks = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };

$: if (__mounted) setProp('textTracks', textTracks);

const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-captions 
  hidden={hidden}
  controls-height={controlsHeight}
  is-controls-active={isControlsActive}
  is-video-view={isVideoView}
  playback-started={playbackStarted}
  on:vTrackChange={onEvent}
  on:vCuesChange={onEvent}
  bind:this={__ref}
>
  <slot></slot>
</vime-captions>
  