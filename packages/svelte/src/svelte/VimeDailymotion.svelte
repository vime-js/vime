
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let videoId;
export let shouldAutoplayQueue = undefined;
export let showUpNextQueue = undefined;
export let showShareButtons = undefined;
export let color = undefined;
export let syndication = undefined;
export let showDailymotionLogo = undefined;
export let showVideoInfo = undefined;
export let language = undefined;
export let autoplay = undefined;
export let controls = undefined;
export let logger = undefined;
export let loop = undefined;
export let muted = undefined;
export let playsinline = undefined;

export const getAdapter = (...args) => __ref.getAdapter(...args);

export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };

$: if (__mounted) setProp('logger', logger);

const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-dailymotion 
  video-id={videoId}
  should-autoplay-queue={shouldAutoplayQueue}
  show-up-next-queue={showUpNextQueue}
  show-share-buttons={showShareButtons}
  color={color}
  syndication={syndication}
  show-dailymotion-logo={showDailymotionLogo}
  show-video-info={showVideoInfo}
  language={language}
  autoplay={autoplay}
  controls={controls}
  loop={loop}
  muted={muted}
  playsinline={playsinline}
  on:vLoadStart={onEvent}
  bind:this={__ref}
>
  <slot></slot>
</vime-dailymotion>
  