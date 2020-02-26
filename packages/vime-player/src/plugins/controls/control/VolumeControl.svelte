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
    class:active={!$isMobile && isFocused}
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
  import { focus } from '~utils/actions';
  import MuteControl from './MuteControl.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const { isMobile } = player.getGlobalStore();
  const { i18n, volume, isMuted } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;
  let slider;
  let muteControl;
  let isFocused = false;
  let prevMuted = false;

  export const getEl = () => el;
  export const getSlider = () => slider;
  export const getMuteControl = () => muteControl;

  const unmuteVolume = () => {
    if (prevMuted && !$isMuted && $volume === 0) $volume = 30;
    prevMuted = $isMuted;
  };

  $: unmuteVolume($isMuted);
  $: $isMuted = ($volume === 0);
  $: currentVolume = $isMuted ? 0 : $volume;
  $: if (slider) slider.style.setProperty('--value', `${currentVolume}%`);

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onVolumeChange = e => { $volume = window.parseInt(e.target.value); };
  const onFocus = e => { isFocused = e.detail; };
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