
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let willAttach = undefined;
export let crossOrigin = undefined;
export let preload = undefined;
export let poster = undefined;
export let mediaTitle = undefined;
export let controlsList = undefined;
export let autoPiP = undefined;
export let disablePiP = undefined;
export let disableRemotePlayback = undefined;
export let viewType = undefined;
export let playbackRates = undefined;
export let language = undefined;
export let autoplay = undefined;
export let controls = undefined;
export let debug = undefined;
export let loop = undefined;
export let muted = undefined;
export let playsinline = undefined;

export const getAdapter = (...args) => __ref.getAdapter(...args);

export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };

$: if (__mounted) setProp('playbackRates', playbackRates);

const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-file 
  will-attach={willAttach}
  cross-origin={crossOrigin}
  preload={preload}
  poster={poster}
  media-title={mediaTitle}
  controls-list={controlsList}
  auto-pip={autoPiP}
  disable-pip={disablePiP}
  disable-remote-playback={disableRemotePlayback}
  view-type={viewType}
  language={language}
  autoplay={autoplay}
  controls={controls}
  debug={debug}
  loop={loop}
  muted={muted}
  playsinline={playsinline}
  on:vLoadStart={onEvent}
  on:vSrcSetChange={onEvent}
  bind:this={__ref}
>
  <slot></slot>
</vime-file>
  