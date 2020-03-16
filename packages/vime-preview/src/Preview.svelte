<svelte:options accessors />

<div 
  class="preview"
  class:loading={isLoading}
  use:setAspectRatio={isEnabled ? aspectRatio : null}
>
  <Lazy let:intersecting >
    {#if isEnabled && intersecting}
      <img
        class:active={hasLoaded}
        src={poster} 
        alt={posterAlt}
        on:load={onLoad}
        bind:this={img}
      />
      <div 
        class="play"
        class:active={showPlayButton && hasLoaded}
      >
        <svg>
          <path d="M3 1.52c0-.398.644-.637.977-.418L15 8.662a.5.5 0 010 .835L3.977 16.911c-.333.219-.977-.02-.977-.418V1.52z"/>
        </svg>
      </div>
    {/if}
  </Lazy>
</div>

<script>
  import { tick, onMount } from 'svelte';
  import { aspectRatio as setAspectRatio, Lazy } from '@vime/core';
  import { is_function } from '@vime/utils';
  import { utils as Dailymotion } from '@vime/dailymotion';
  import { utils as YouTube } from '@vime/youtube';
  import { utils as Vimeo } from '@vime/vimeo';
  import playIcon from '../static/vime-play.svg';

  const buildProvider = (canPlay, getPoster) => ({ canPlay, getPoster });

  // TODO: questionable...
  const providers = [
    buildProvider(Dailymotion.can_play, Dailymotion.get_poster),
    buildProvider(YouTube.can_play, YouTube.get_poster),
    buildProvider(Vimeo.can_play, Vimeo.get_poster),
  ];

  let img;
  let hasLoaded = false;
  let isLoading = false;

  export let src = null;
  export let poster = null;
  export let isEnabled = true;
  export let aspectRatio = '16:9';
  export let showPlayButton = false;

  const getNativePoster = async () => {
    if (!is_function(Provider.getPoster)) return;
    poster = await Provider.getPoster(src);
    isLoading = true;
    hasLoaded = false;
  };

  const onLoad = async () => {
    await tick();
    isLoading = false;
    hasLoaded = true;
  };

  const onPosterChange = async () => {
    hasLoaded = false;
    await tick();
    if (img && img.complete) onLoad();
  };

  $: onPosterChange(poster);
  $: if (img && !poster && src && Provider) getNativePoster();
  $: Provider = providers.find(p => p.canPlay(src));
  $: posterAlt = "";
</script>

<style type="text/scss">
  .preview {
    position: relative;
    width: 100%;
    overflow: hidden;
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