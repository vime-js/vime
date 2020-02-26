<svelte:options accessors />

{#if isEnabled}
  <div 
    class:active={isActive}
    use:setAspectRatio={$aspectRatio}
    bind:this={el}
  ></div>
{/if}

<script context="module">
  export const ID = 'vPoster';
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  import { aspectRatio as setAspectRatio } from '~utils/actions';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const logger = player.createLogger(ID);
  const dispatch = createEventDispatcher();

  const {
    poster: _poster, aspectRatio, isVideo,
    isAudio, hasPlaybackStarted, hasSeeked,
    src, Provider
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;

  export let poster;
  export let resolve = true;
  export let isEnabled = true;
  export let isActive = false;

  export const getEl = () => el;

  $: if (el) {
    el.style.backgroundImage = poster ? `url('${poster.src || poster}')` : null;
    el.style.backgroundSize = poster ? (poster.size || 'contain') : null;
  }

  $: if (resolve) poster = $_poster;
  $: if (resolve) isEnabled = $isVideo || !!$_poster;
  $: if (resolve) isActive = $isAudio || (!$hasPlaybackStarted && !$hasSeeked);

  const onPosterLoadError = e => {
    logger.warn(`failed to load poster for \`src\` [${$src}]`);
    dispatch('error', e);
  };

  // Get the poster if it's not set and a provider can provide it.
  $: if (resolve && !$_poster && $src && $Provider && $Provider.getPoster) {
    $Provider.getPoster($src).then(p => { $_poster = p; }).catch(e => onPosterLoadError(e));
  }
</script>

<style type="text/scss">
  div {
    background-color: #000;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    transition: opacity 0.5s ease;
    width: 100%;
    z-index: 1;
    pointer-events: none;

    &.active {
      opacity: 1;
    }
  }
</style>