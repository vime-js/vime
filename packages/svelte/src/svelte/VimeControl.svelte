
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let keys = undefined;
export let identifier = undefined;
export let hidden = undefined;
export let label;
export let menu = undefined;
export let expanded = undefined;
export let pressed = undefined;
export let scale = undefined;
export let isTouch = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-control 
  keys={keys}
  identifier={identifier}
  hidden={hidden}
  label={label}
  menu={menu}
  expanded={expanded}
  pressed={pressed}
  scale={scale}
  is-touch={isTouch}
  on:vInteractionChange={onEvent}
  bind:this={__ref}
>
  <slot></slot>
</vime-control>
  