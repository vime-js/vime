
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let active = undefined;
export let identifier;
export let controller;

export const getController = (...args) => __ref.getController(...args);
export const getFocusedMenuItem = (...args) => __ref.getFocusedMenuItem(...args);
export const focusOnOpen = (...args) => __ref.focusOnOpen(...args);

export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };



const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-menu 
  active={active}
  identifier={identifier}
  controller={controller}
  on:vOpen={onEvent}
  on:vClose={onEvent}
  on:vMenuItemsChange={onEvent}
  on:vFocusMenuItemChange={onEvent}
  bind:this={__ref}
>
  <slot></slot>
</vime-menu>
  