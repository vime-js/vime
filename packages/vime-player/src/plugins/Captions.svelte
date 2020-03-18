<svelte:options accessors />

<div
  class:active={!$useNativeCaptions && $isVideoView}
  class:withControls={!$isMobile && $isControlsActive}
  class:fullscreen={$isFullscreenActive}
  class:mobile={$isMobile}
>
  {#if isCueActive}
    <span data-testid="cue">
      {@html getCueContent($currentCue)}
    </span>
  {/if}
</div>

<script context="module">
  import PluginRole from '../core/PluginRole';

  export const ID = 'vCaptions';
  export const ROLE = PluginRole.CAPTIONS;
</script>

<script>
  import { tick, onDestroy, createEventDispatcher } from 'svelte';
  import { element, listen, append } from 'svelte/internal';
  import { derived } from 'svelte/store';
  import { 
    is_number, is_instance_of, private_writable,
    map_store_to_component
  } from '@vime/utils';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;
  export let crossOrigin = null;

  const logger = player.createLogger(ID);
  const dispatch = createEventDispatcher();
  
  const { 
    isMobile, isFullscreenActive, isControlsActive,
    currentTrackIndex, currentTime, useNativeCaptions, 
    tracks, locale, isVideoView
  } = player.getStore();

  const buildStore = () => {
    const store = {};
    store.cues = private_writable([]);
    store.currentCueIndex = private_writable(-1);
    store.currentCue = derived(
      [store.cues, store.currentCueIndex],
      ([$cues, $index]) => ($cues.length >= 0) ? $cues[$index] : null
    );
    store.activeCues = private_writable([]);
    return store;
  };

  const store = buildStore();
  const onPropsChange = map_store_to_component(null, store);
  $: onPropsChange($$props);

  const {
    cues, currentCueIndex, currentCue,
    activeCues
  } = store;

  // --------------------------------------------------------------
  // Cues
  // --------------------------------------------------------------

  let isCueActive = false;

  const shouldCueBeActive = cue => ($currentTime >= cue.startTime) && ($currentTime <= cue.endTime);

  const getCueContent = cue => {
    if (!cue) return '';
    const div = element('div');
    append(div, cue.getCueAsHTML());
    return div.innerHTML.trim();
  };

  const findNextCueIndex = start => {
    let index = start;
    while (
      index >= 0 &&
      index < ($cues.length - 1) &&
      $currentTime > $cues[index].startTime &&
      !shouldCueBeActive($cues[index])
    ) {
      index += 1;
    }
    return index;
  };

  const validateCue = cue => {
    if (!is_instance_of(cue, window.VTTCue)) {
      logger.warn(`invalid cue with \`label\` [${cue.label}] must be an instance of window.VTTCue`);
      return false;
    }
    return true;
  };

  const onCuesChange = () => {
    if ($currentCueIndex >= 0 && $cues[$currentCueIndex]) return;
    if ($cues.length > 0) $currentCueIndex = findNextCueIndex(0);
  };

  export const addCue = cue => {
    if (!validateCue(cue)) return;
    let index = 0;
    while ($cues[index] && ($cues[index].endTime < cue.startTime)) index++;
    $cues.splice(index, 0, cue);
    $cues = $cues;
  };

  export const addCues = cues => { cues.map(addCue); };

  export const removeCue = value => {
    const index = is_number(value) ? value : $cues.findIndex(cue => cue === value);
    if (index <= 0 || index >= $cues.length) {
      logger.warn('could not remove cue because it could not be found or index was out of bounds');
      return;
    }
    $cues.splice(index, 1);
    $cues = $cues;
  };

  $: if ($currentCue && ($currentCueIndex < $cues.length - 1) && $currentTime > $currentCue.endTime) {
    $currentCueIndex = findNextCueIndex($currentCueIndex);
  }

  $: if ($currentCueIndex > 0 && $currentTime < $cues[$currentCueIndex - 1].endTime) {
    $currentCueIndex = findNextCueIndex(0);
  }

  $: isCueActive = ($currentCue && $currentTime >= 0 && shouldCueBeActive($currentCue));
  $: isCueActive ? ($activeCues = [$currentCue]) : ($activeCues = []);
  $: onCuesChange($cues);

  // --------------------------------------------------------------
  // Tracks
  // --------------------------------------------------------------

  export const hasTrack = () => $currentTrackIndex !== -1;

  const buildTrack = track => {
    const el = element('track');
    el.default = true;
    el.src = track.src;
    el.kind = track.kind;
    el.label = track.label;
    el.srclang = track.srclang;
    return el;
  };

  // TODO: Fix IE captions if CORS is used.
  // Fetch captions and inject as blobs instead (data URIs not supported).
  const loadCues = () => {
    const media = element('audio');
    media.crossorigin = crossOrigin;
    const track = buildTrack($tracks[$currentTrackIndex]);
    listen(track, 'load', () => {
      const newCues = Array.from(media.textTracks[0].cues);
      $cues = newCues;
    }, { once: true });
    append(media, track);
  };

  const onTrackChange = () => {
    $cues = [];
    $currentCueIndex = -1;
    hasTrack() ? loadCues() : onCuesChange();
  };

  const onTracksChange = async () => {
    await tick();
    if (!hasTrack()) $currentTrackIndex = $tracks.findIndex(t => t.default);
  };

  $: onTracksChange($isVideoView ? $tracks : []);
  $: onTrackChange($isVideoView ? $currentTrackIndex : -1, crossOrigin);
  
  $: if ($isVideoView) {
    const index = $tracks.findIndex(t => t.srclang === $locale);
    if (index >= 0) $currentTrackIndex = index;
  }
</script>

<style type="text/scss">
  @import '../style/common';

  // Container (cues)
  div {
    bottom: 0;
    color: #fff;
    font-size: $font-size-medium;
    left: 0;
    opacity: 0;
    padding: $control-spacing;
    position: absolute;
    text-align: center;
    transition: transform 0.4s ease-in-out, opacity 0.3s ease;
    width: 100%;

    &.active {
      opacity: 1;
    }

    &.withControls {
      transform: translateY(-($control-spacing * 4) - 8);

      &.mobile {
        transform: translateY(-($control-spacing * 4));
      }
    }

    @media (min-width: $bp-sm) {
      font-size: $font-size-small;
      padding: ($control-spacing * 2);
    }

    @media (min-width: $bp-md) {
      font-size: $font-size-large;
    }

    &.fullscreen {
      @media (min-width: $bp-lg) {
        font-size: $font-size-extra-large;
      }
    }
  }

  // Cue
  span {
    background: $color-gray-600;
    border-radius: 2px;
    box-decoration-break: clone;
    line-height: 185%;
    padding: 0.2em 0.5em;
    white-space: pre-wrap;

    // Firefox adds a <div> when using getCueAsHTML()
    :global(div) {
      display: inline;
    }

    &:empty {
      display: none;
    }
  }
</style>