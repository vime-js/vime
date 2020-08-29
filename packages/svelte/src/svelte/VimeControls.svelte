
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let hidden = undefined;
export let fullWidth = undefined;
export let fullHeight = undefined;
export let direction = undefined;
export let align = undefined;
export let justify = undefined;
export let pin = undefined;
export let activeDuration = undefined;
export let waitForPlaybackStart = undefined;
export let hideWhenPaused = undefined;
export let hideOnMouseLeave = undefined;
export let isAudioView = undefined;
export let isSettingsActive = undefined;
export let playbackReady = undefined;
export let isControlsActive = undefined;
export let paused = undefined;
export let playbackStarted = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-controls 
  hidden={hidden}
  full-width={fullWidth}
  full-height={fullHeight}
  direction={direction}
  align={align}
  justify={justify}
  pin={pin}
  active-duration={activeDuration}
  wait-for-playback-start={waitForPlaybackStart}
  hide-when-paused={hideWhenPaused}
  hide-on-mouse-leave={hideOnMouseLeave}
  is-audio-view={isAudioView}
  is-settings-active={isSettingsActive}
  playback-ready={playbackReady}
  is-controls-active={isControlsActive}
  paused={paused}
  playback-started={playbackStarted}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-controls>
  