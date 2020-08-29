
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let step = undefined;
export let min = undefined;
export let max = undefined;
export let value = undefined;
export let valueText = undefined;
export let label = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-slider 
  step={step}
  min={min}
  max={max}
  value={value}
  value-text={valueText}
  label={label}
  on:vValueChange={onEvent}
  bind:this={__ref}
>
  <slot></slot>
</vime-slider>
  