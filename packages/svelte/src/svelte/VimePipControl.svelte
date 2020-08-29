
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let enterIcon = undefined;
export let exitIcon = undefined;
export let tooltipDirection = undefined;
export let hideTooltip = undefined;
export let keys = undefined;
export let scale = undefined;
export let isPiPActive = undefined;
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

<vime-pip-control 
  enter-icon={enterIcon}
  exit-icon={exitIcon}
  tooltip-direction={tooltipDirection}
  hide-tooltip={hideTooltip}
  keys={keys}
  scale={scale}
  is-pi-p-active={isPiPActive}
  playback-ready={playbackReady}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-pip-control>
  