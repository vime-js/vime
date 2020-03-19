<svelte:options accessors />

<div 
  class="preview"
  class:loading={isLoading}
  use:setAspectRatio={isEnabled ? aspectRatio : null}
>
  <Lazy let:intersecting >
    {#if isEnabled && intersecting}
      <img
        class:active={!isLoading}
        src={poster || nativePoster} 
        alt="Preview for {src}"
        on:load={onLoad}
        bind:this={img}
      />
      <div 
        class="play"
        class:active={showPlayButton && !isLoading}
      >
        <svg>
          {@html playIcon}
        </svg>
      </div>
    {/if}
  </Lazy>
</div>

<script>
  import { tick, onMount, createEventDispatcher } from 'svelte';
  import { aspectRatio as setAspectRatio, Lazy } from '@vime/core';
  import { is_function } from '@vime/utils';
  import { utils as Dailymotion } from '@vime/dailymotion';
  import { utils as YouTube } from '@vime/youtube';
  import { utils as Vimeo } from '@vime/vimeo';
  import playIcon from '../static/vime-play.svg';

  const dispatch = createEventDispatcher();

  const Event = {
    POSTER_CHANGE: 'posterchange',
    LOADING: 'loading'
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
  export let showPlayButton = false;

  export const getNativePoster = () => nativePoster;

  const _getNativePoster = async () => {
    nativePoster = await Provider.getPoster(src);
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
  
  $: Provider = providers.find(p => p.canPlay(src));
  $: if (!Provider) nativePoster = null;
  $: if (!poster && src && Provider && is_function(Provider.getPoster)) _getNativePoster();

  $: dispatch(Event.LOADING, isLoading);
  $: dispatch(Event.POSTER_CHANGE, poster || nativePoster);
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
    opacity: 0;
    transition: opacity 0.3s ease;

    &.active {
      opacity: 1;
    }
  }

  .play {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.3s ease;

    &.active {
      opacity: 1;
    }

    svg {
      color: #fff;
      fill: currentColor;
      pointer-events: none;
      width: 18px;
      height: 18px;
      transform: scale(2);
      
      @media (min-width: 680px) {
        transform: scale(3.5);
      }
    }
  }

  @keyframes loading {
    100% {
      transform: translateX(100%);
    }
  }

  .loading {
    background-color: #dfdfdf;

    &::after {
      overflow: hidden;
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