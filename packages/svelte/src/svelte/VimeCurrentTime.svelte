
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let currentTime = undefined;
export let i18n = undefined;
export let alwaysShowHours = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };

$: if (__mounted) setProp('i18n', i18n);

const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-current-time 
  current-time={currentTime}
  always-show-hours={alwaysShowHours}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-current-time>
  