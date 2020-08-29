
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let identifier = undefined;
export let hidden = undefined;
export let label;
export let menu = undefined;
export let expanded = undefined;
export let checked = undefined;
export let hint = undefined;
export let badge = undefined;
export let checkedIcon = undefined;
export let isTouch = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-menu-item 
  identifier={identifier}
  hidden={hidden}
  label={label}
  menu={menu}
  expanded={expanded}
  checked={checked}
  hint={hint}
  badge={badge}
  checked-icon={checkedIcon}
  is-touch={isTouch}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-menu-item>
  