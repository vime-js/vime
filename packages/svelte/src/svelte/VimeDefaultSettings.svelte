
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let i18n = undefined;
export let playbackRate = undefined;
export let playbackRates = undefined;
export let playbackQuality = undefined;
export let playbackQualities = undefined;
export let isCaptionsActive = undefined;
export let currentCaption = undefined;
export let textTracks = undefined;



export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };

$: if (__mounted) setProp('i18n', i18n);
$: if (__mounted) setProp('playbackRates', playbackRates);
$: if (__mounted) setProp('playbackQualities', playbackQualities);
$: if (__mounted) setProp('currentCaption', currentCaption);
$: if (__mounted) setProp('textTracks', textTracks);

const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-default-settings 
  playback-rate={playbackRate}
  playback-quality={playbackQuality}
  is-captions-active={isCaptionsActive}
  
  bind:this={__ref}
>
  <slot></slot>
</vime-default-settings>
  