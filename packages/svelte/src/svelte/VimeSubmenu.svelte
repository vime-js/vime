
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let label;
export let hidden = undefined;
export let hint = undefined;
export let active = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-submenu 
  label={label}
  hidden={hidden}
  hint={hint}
  active={active}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-submenu>
  