
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let label;
export let value;
export let checked = undefined;
export let badge = undefined;
export let checkedIcon = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-menu-radio 
  label={label}
  value={value}
  checked={checked}
  badge={badge}
  checked-icon={checkedIcon}
  on:vCheck={onEvent}
  bind:this={__ref}
>
  <slot></slot>
</vime-menu-radio>
  