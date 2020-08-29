
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let controlsHeight = undefined;
export let active = undefined;
export let isMobile = undefined;
export let isAudioView = undefined;

export const setController = (...args) => __ref.setController(...args);

export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-settings 
  controls-height={controlsHeight}
  active={active}
  is-mobile={isMobile}
  is-audio-view={isAudioView}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-settings>
  