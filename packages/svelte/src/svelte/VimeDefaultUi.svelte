
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let noIcons = undefined;
export let noClickToPlay = undefined;
export let noCaptions = undefined;
export let noPoster = undefined;
export let noSpinner = undefined;
export let noControls = undefined;
export let noSettings = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-default-ui 
  no-icons={noIcons}
  no-click-to-play={noClickToPlay}
  no-captions={noCaptions}
  no-poster={noPoster}
  no-spinner={noSpinner}
  no-controls={noControls}
  no-settings={noSettings}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-default-ui>
  