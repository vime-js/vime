
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let isVideoView = undefined;
export let buffering = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-spinner 
  is-video-view={isVideoView}
  buffering={buffering}
  on:vWillShow={onEvent}
  on:vWillHide={onEvent}
  bind:this={__ref}
>
  <slot></slot>
</vime-spinner>
  