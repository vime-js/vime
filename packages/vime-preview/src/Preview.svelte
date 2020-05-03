<svelte:options accessors />

<div 
  class="preview"
  use:vAspectRatio={isEnabled ? aspectRatio : null}
>
  <div class="loadingContainer">
    <div class:loading={isLoading}></div> 
  </div>
  <Lazy let:intersecting >
    <img
      src={currentPoster} 
      alt="Preview of {src || poster}"
      use:vIf={isEnabled && intersecting}
      use:vShow={!isLoading}
      on:load={onLoad}
      on:error={onLoad}
      bind:this={img}
    />
    <div 
      class="playIcon"
      use:vShow={showPlayIcon && !isLoading}
    >
      <PlayIcon 
        scale={playIconScale} 
      />
    </div>
  </Lazy>
</div>

<script context="module">
  const cache = {};
</script>

<script>
  import { tick, createEventDispatcher, onMount } from 'svelte';
  import Lazy from './Lazy.svelte';
  import PlayIcon from './PlayIcon.svelte';
  
  import * as YouTube from '@vime-js/core/youtube';
  import * as Vimeo from '@vime-js/core/vimeo';
  import * as Dailymotion from '@vime-js/core/dailymotion';

  import {
    is_function, vAspectRatio, vIf,
    vShow,
  } from '@vime-js/utils';

  const dispatch = createEventDispatcher();

  const Event = {
    POSTER_CHANGE: 'posterchange',
    LOADING: 'loading',
  };

  // TODO: questionable...
  const buildProvider = (canPlay, fetchPoster) => ({ canPlay, fetchPoster });
  const providers = [
    buildProvider(Dailymotion.can_play, Dailymotion.fetch_poster),
    buildProvider(YouTube.can_play, YouTube.fetch_poster),
    buildProvider(Vimeo.can_play, Vimeo.fetch_poster),
  ];

  let img;
  let nativePoster = null;
  let isLoading = false;

  export let src = null;
  export let poster = null;
  export let isEnabled = true;
  export let aspectRatio = '16:9';
  export let showPlayIcon = false;
  export let playIconScale = 2;

  export const getNativePoster = () => nativePoster;

  const fetchNativePoster = async () => {
    await tick();
    isLoading = true;
    nativePoster = cache[src] || await Provider.fetchPoster(src);
    if (!cache[src]) cache[src] = nativePoster;
  };

  const onLoad = async () => {
    await tick();
    isLoading = false;
  };

  const onPosterChange = async () => {
    if (!currentPoster) return;
    isLoading = true;
    await tick();
    if (img && img.complete) onLoad();
  };

  let hasMounted = false;
  onMount(() => { hasMounted = true; });

  const onSrcChange = () => { nativePoster = null; };
  const onProviderChange = () => { nativePoster = null; };

  $: onSrcChange(src);
  $: onProviderChange(Provider);
  $: onPosterChange(currentPoster);
  
  $: currentPoster = poster || nativePoster;
  $: Provider = providers.find((p) => p.canPlay(src));

  $: if (
    hasMounted
    && !poster
    && src
    && Provider
    && is_function(Provider.fetchPoster)
  ) fetchNativePoster();

  $: if (hasMounted) dispatch(Event.LOADING, isLoading);
  $: if (hasMounted) dispatch(Event.POSTER_CHANGE, currentPoster);
</script>

<style type="text/scss">
  .preview {
    position: relative;
    width: 100%;
    background: #dfdfdf;
  }

  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    object-fit: cover;
  }

  .playIcon {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    color: #fff;
  }

  @keyframes loading {
    100% {
      transform: translateX(100%);
    }
  }

  .loadingContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #dfdfdf;
  }

  .loading {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    &::after {
      display: block;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: translateX(-100%);
      background: linear-gradient(90deg, transparent, rgba(#f0f0f0, 0.9), transparent);
      animation: loading 2s infinite;
    }
  }
</style>