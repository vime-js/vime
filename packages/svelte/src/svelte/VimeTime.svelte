
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let label;
export let seconds = undefined;
export let alwaysShowHours = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-time 
  label={label}
  seconds={seconds}
  always-show-hours={alwaysShowHours}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-time>
  