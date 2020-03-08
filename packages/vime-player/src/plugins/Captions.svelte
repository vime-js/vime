<div
  class:active={cueActive}
  class:withControls={$isControlsActive}
  class:fullscreen={$isFullscreenActive}
  class:mobile={$isMobile}
>
  {#if cueActive}
    <span data-testid="cue">
      {@html getCueContent(cues[currentCue])}
    </span>
  {/if}
</div>

<script context="module">
  export const ID = 'vCaptions';
  export const ROLE = PluginRole.CAPTIONS;

  const isTracksEqual = (tA, tB) => tA.kind === tB.kind &&
    tA.label === tB.label &&
    tA.srclang === tB.srclang;

  const Event = {
    CUE_ENTER: 'cueenter',
    CUE_EXIT: 'cueexit',
    CUE_CHANGE: 'cuechange'
  };
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  import { element, listen, append } from 'svelte/internal';
  import { is_number, is_instance_of } from '@vime/utils';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const logger = player.createLogger(ID);
  const dispatch = createEventDispatcher();
  
  const { 
    isMobile, isFullscreenActive, isControlsActive,
    tracks, currentTrackIndex, activeCues, 
    currentTime
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let cues = [];
  let currentCue = -1;
  let cueActive = false;
  let crossOrigin = false;

  export const getCues = () => cues;
  export const getCurrentCue = () => currentCue;

  export const setCrossOrigin = origin => { crossOrigin = origin || null; };

  // --------------------------------------------------------------
  // Cues
  // --------------------------------------------------------------

  const shouldCueBeActive = cue => ($currentTime >= cue.startTime) && ($currentTime <= cue.endTime);

  const getCueContent = cue => {
    const div = element('div');
    append(div, cue.getCueAsHTML());
    return div.innerHTML.trim();
  };

  const findNextCueIndex = start => {
    let index = start;
    while (
      index >= 0 &&
      index < (cues.length - 1) &&
      $currentTime > cues[index].startTime &&
      !shouldCueBeActive(cues[index])
    ) {
      index += 1;
    }
    return index;
  };

  const validateCue = cue => {
    if (!is_instance_of(cue, window.VTTCue)) {
      logger.warn('invalid cue must be an instance of window.VTTCue');
      return false;
    }
    if (cues.some(c => (c.startTime <= cue.endTime) && (cue.startTime <= c.endTime))) {
      logger.warn('invalid cue found, overlapping cues are not supported at this time');
      return false;
    }
    return true;
  };

  const onCueEnter = () => dispatch(Event.CUE_ENTER, { cues, currentCue });

  const onCueExit = () => {
    if (!cueActive) return;
    cueActive = false;
    dispatch(Event.CUE_EXIT, { cues, currentCue })
  };

  const onCueChange = index => {
    onCueExit();
    if (currentCueIndex === index) return;
    currentCueIndex = index;
    currentCue = cues[index];
    dispatch(PlayerEvent.CUE_CHANGE, getCurrentCue());
  };

  const onCuesChange = () => {
    dispatch(PlayerEvent.CUES_CHANGE, [...cues]);
    if (currentCueIndex >= 0 && cues[currentCueIndex]) {
      currentCue = cues[currentCueIndex];
      return;
    }
    if (cues.length > 0) onCueChange(findNextCueIndex(0));
  };

  export const addCue = cue => {
    if (!validateCue(cue)) return;
    let index = 0;
    while (cues[index] && (cues[index].endTime < cue.startTime)) index++;
    cues.splice(index, 0, cue);
    onCuesChange();
  };

  export const addCues = cues => { cues.map(addCue); };

  export const removeCue = value => {
    const index = is_number(value) ? value : cues.findIndex(c => c === value);
    if (index <= 0 || index >= cues.length) {
      logger.warn('could not remove cue because it could not be found or index was out of bounds');
      return;
    }
    cues.splice(index, 1);
    onCuesChange();
  };

  export const removeAllCues = () => {
    cues.splice(0, cues.length);
    currentCueIndex = -1;
    currentCue = null;
    onCuesChange();
  };


  // TODO: Fix IE captions if CORS is used.
  // Fetch captions and inject as blobs instead (data URIs not supported).
  const loadCues = () => {
    const media = element('audio');
    media.crossOrigin = crossOrigin;
    const trackEl = element('track');
    trackEl.default = true;
    trackEl.src = track.src;
    listen(trackEl, 'load', () => {
      const newCues = Array.from(media.textTracks[0].cues);
      if (newCues.some(c => !validateCue(c))) return;
      cues.push(...newCues);
      dispatch(PlayerEvent.CUES_LOADED, cues);
      onCuesChange();
    }, { once: true });
    append(media, trackEl);
  };

  const onTrackChange = () => {
    cues.splice(0, cues.length);
    currentCueIndex = -1;
    currentCue = null;
    track ? loadCues() : onCuesChange();
  };

  const findTrackByLocale = () => tracks.find(t => t.srclang === locale);

  const findCurrentTrack = () => {
    if (!currentTrack) currentTrack = findTrackByLocale();
    if (!currentTrack) currentTrack = tracks.find(t => t.default);
  };

  // $: if (!$isAudio && isPlaybackReady && _track) $captionsActive = _tracks.length > 0
  $: if (!currentTrack && tracks.length > 0) findCurrentTrack();
  $: if (locale) currentTrack = findTrackByLocale();

  $: onTrackChange(track);

  $: if (currentCue && (currentCueIndex < cues.length - 1) && currentTime > currentCue.endTime) {
    onCueChange(findNextCueIndex(currentCueIndex));
  }

  $: if (currentCueIndex > 0 && currentTime < cues[currentCueIndex - 1].endTime) {
    onCueChange(findNextCueIndex(0));
  }

  $: cueActive = (currentCue && currentTime >= 0) ? shouldCueBeActive(currentCue) : false;
  $: if (cueActive) onCueEnter();
</script>

<style type="text/scss">
  @import '../../style/common';

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