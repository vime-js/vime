
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let alwaysShowHours = undefined;
export let hideTooltip = undefined;
export let currentTime = undefined;
export let duration = undefined;
export let noKeyboard = undefined;
export let buffering = undefined;
export let buffered = undefined;
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

<vime-scrubber-control 
  always-show-hours={alwaysShowHours}
  hide-tooltip={hideTooltip}
  current-time={currentTime}
  duration={duration}
  no-keyboard={noKeyboard}
  buffering={buffering}
  buffered={buffered}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-scrubber-control>
  