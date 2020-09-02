
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let playIcon = undefined;
export let pauseIcon = undefined;
export let tooltipDirection = undefined;
export let hideTooltip = undefined;
export let keys = undefined;
export let paused = undefined;
export let i18n = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };

$: if (__mounted) setProp('i18n', i18n);

const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-playback-control 
  play-icon={playIcon}
  pause-icon={pauseIcon}
  tooltip-direction={tooltipDirection}
  hide-tooltip={hideTooltip}
  keys={keys}
  paused={paused}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-playback-control>
  