
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let enterIcon = undefined;
export let exitIcon = undefined;
export let tooltipDirection = undefined;
export let hideTooltip = undefined;
export let scale = undefined;
export let keys = undefined;
export let isFullscreenActive = undefined;
export let i18n = undefined;
export let playbackReady = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };

$: if (__mounted) setProp('i18n', i18n);

const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-fullscreen-control 
  enter-icon={enterIcon}
  exit-icon={exitIcon}
  tooltip-direction={tooltipDirection}
  hide-tooltip={hideTooltip}
  scale={scale}
  keys={keys}
  is-fullscreen-active={isFullscreenActive}
  playback-ready={playbackReady}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-fullscreen-control>
  