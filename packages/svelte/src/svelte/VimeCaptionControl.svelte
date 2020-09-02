
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let showIcon = undefined;
export let hideIcon = undefined;
export let tooltipDirection = undefined;
export let hideTooltip = undefined;
export let keys = undefined;
export let currentCaption = undefined;
export let isCaptionsActive = undefined;
export let i18n = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };

$: if (__mounted) setProp('currentCaption', currentCaption);
$: if (__mounted) setProp('i18n', i18n);

const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-caption-control 
  show-icon={showIcon}
  hide-icon={hideIcon}
  tooltip-direction={tooltipDirection}
  hide-tooltip={hideTooltip}
  keys={keys}
  is-captions-active={isCaptionsActive}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-caption-control>
  