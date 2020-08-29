
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let icon = undefined;
export let tooltipDirection = undefined;
export let menu = undefined;
export let expanded = undefined;
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

<vime-settings-control 
  icon={icon}
  tooltip-direction={tooltipDirection}
  menu={menu}
  expanded={expanded}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-settings-control>
  