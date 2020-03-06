<div bind:this={el}>
  <MuteControl 
    {player} 
    on:focuschange={onFocus}
    bind:this={muteControl}
  />
  <input
    type="range"
    role="slider"
    step="5"
    min="0"
    max="100"
    autocomplete="off"
    class:active={!$isMobile && focused}
    bind:this={slider}
    bind:value={currentVolume}
    use:focus
    on:focuschange={onFocus}
    on:input="{onVolumeChange}"
    on:keydown|stopPropagation
    aria-label={i18n.volume}
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="{currentVolume}"
    aria-valuetext={`${currentVolume}%`}
    aria-orientation="horizontal"
  />
</div>

<script context="module">
  export const ID = 'vVolumeControl';
  export const LABEL = 'adjustVolume';
</script>

<script>
  import { tick, onDestroy } from 'svelte';
  import { focus } from '@vime/core';
  import MuteControl from './MuteControl.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const { i18n, volume, muted, isMobile } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;
  let slider;
  let muteControl;
  let focused = false;
  let prevMuted = false;

  export const getEl = () => el;
  export const getSlider = () => slider;
  export const getMuteControl = () => muteControl;

  const unmuteVolume = () => {
    if (prevMuted && !$muted && $volume === 0) $volume = 30;
    prevMuted = $muted;
  };

  $: unmuteVolume($muted);
  $: $muted = ($volume === 0);
  $: currentVolume = $muted ? 0 : $volume;
  $: if (slider) slider.style.setProperty('--value', `${currentVolume}%`);

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onVolumeChange = e => { $volume = window.parseInt(e.target.value); };
  const onFocus = e => { focused = e.detail; };
</script>

<style type="text/scss">
  @import '../../../style/common';

  @function slider-transition($prop) {
    @return $prop 0.2s cubic-bezier(0.4, 0, 1, 1);
  }

  div {
    align-items: center;
    display: flex;
    position: relative;
    margin-left: ($control-spacing / 2) !important;
    pointer-events: auto;
  }

  input[type='range'] {
    width: 75px;
    height: 40px;
    margin: 0;
    max-width: 0;
    position: relative;
    z-index: 3;
    transition: slider-transition(margin), slider-transition(max-width);

    &.active {
      max-width: 75px;
      margin: 0 ($control-spacing / 2);
    }

    &:hover {
      cursor: pointer;
    }
  }
</style>