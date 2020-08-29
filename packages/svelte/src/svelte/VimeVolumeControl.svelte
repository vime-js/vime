
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let lowVolumeIcon = undefined;
export let highVolumeIcon = undefined;
export let mutedIcon = undefined;
export let tooltipDirection = undefined;
export let hideTooltip = undefined;
export let muteKeys = undefined;
export let noKeyboard = undefined;
export let muted = undefined;
export let volume = undefined;
export let isMobile = undefined;
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

<vime-volume-control 
  low-volume-icon={lowVolumeIcon}
  high-volume-icon={highVolumeIcon}
  muted-icon={mutedIcon}
  tooltip-direction={tooltipDirection}
  hide-tooltip={hideTooltip}
  mute-keys={muteKeys}
  no-keyboard={noKeyboard}
  muted={muted}
  volume={volume}
  is-mobile={isMobile}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-volume-control>
  