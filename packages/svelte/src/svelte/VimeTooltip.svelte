
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let hidden = undefined;
export let active = undefined;
export let position = undefined;
export let direction = undefined;
export let isTouch = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-tooltip 
  hidden={hidden}
  active={active}
  position={position}
  direction={direction}
  is-touch={isTouch}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-tooltip>
  