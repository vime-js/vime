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
      src={poster || nativePoster} 
      alt="Preview for {src}"
      use:vIf={isEnabled && intersecting}
      use:vShow={!isLoading}
      on:load={onLoad}
      bind:this={img}
    />
    <div 
      class="playIcon"
      use:vShow={showPlayIcon && !isLoading}
    >
      <PlayIcon />
    </div>
  </Lazy>
</div>

<script context="module">
  const cache = {};
</script>

<script>
  import { tick, createEventDispatcher } from 'svelte';
  import { Lazy } from '@vime-js/core';
  import { utils as Dailymotion } from '@vime-js/dailymotion';
  import { utils as YouTube } from '@vime-js/youtube';
  import { utils as Vimeo } from '@vime-js/vimeo';
  import PlayIcon from './PlayIcon.svelte';
  
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
  const buildProvider = (canPlay, getPoster) => ({ canPlay, getPoster });
  const providers = [
    buildProvider(Dailymotion.can_play, Dailymotion.get_poster),
    buildProvider(YouTube.can_play, YouTube.get_poster),
    buildProvider(Vimeo.can_play, Vimeo.get_poster),
  ];

  let img;
  let nativePoster = null;
  let isLoading = false;

  export let src = null;
  export let poster = null;
  export let isEnabled = true;
  export let aspectRatio = '16:9';
  export let showPlayIcon = false;

  export const getNativePoster = () => nativePoster;

  const fetchNativePoster = async () => {
    nativePoster = cache[src] || await Provider.getPoster(src);
    if (!cache[src]) cache[src] = nativePoster;
    isLoading = true;
  };

  const onLoad = async () => {
    await tick();
    isLoading = false;
  };

  const onPosterChange = async () => {
    isLoading = true;
    await tick();
    if (img && img.complete) onLoad();
  };

  $: onPosterChange(poster);
  
  $: Provider = providers.find((p) => p.canPlay(src));
  $: if (!Provider || poster) nativePoster = null;
  $: if (!poster && src && Provider && is_function(Provider.getPoster)) fetchNativePoster();

  $: tick().then(() => dispatch(Event.LOADING, isLoading));
  $: tick().then(() => dispatch(Event.POSTER_CHANGE, poster || nativePoster));
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