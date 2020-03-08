<button
  id={$$props.id}
  class="control"
  class:live={$isLive}
  class:audio={!$isVideoView}
  class:videoFocus={!$isTouch}
  class:audioFocus={!$isVideoView && !$isTouch}
  class:touchHighlight={showHighlight}
  use:focus
  use:highlight
  on:click
  on:keydown
  on:focuschange
  on:focuschange="{e => { isFocused = e.detail; }}"
  on:highlightchange="{e => { showHighlight = e.detail; }}"
  aria-label={$$props['aria-label']}
  aria-pressed={$$props['aria-pressed']}
  aria-haspopup={$$props['aria-haspopup']}
  aria-controls={$$props['aria-controls']}
  aria-disabled={$$props['aria-disabled']}
  aria-expanded={$$props['aria-expanded']}
  aria-hidden={$$props['aria-hidden']}
  aria-describedby={tooltip ? tooltipId : null}
  bind:this={el}
>
  <slot />
  {#if !noTooltip}
    <svelte:component 
      {player}
      {title}
      id={tooltipId}
      isActive={isFocused}
      this={Tooltip}
      bind:this={tooltip}
    />
  {/if}
</button>

<script context="module">
  let tooltipIdCount = 0;
</script>

<script>
  import { focus, highlight } from '@vime/core';
  import { ID as TooltipsID } from '../tooltips/Tooltips.svelte';
  
  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  // eslint-disable-next-line prefer-const
  tooltipIdCount += 1;
  const tooltipId = `tooltip-${tooltipIdCount}`;

  const tooltipsPlugin = player.getPluginsRegistry().watch(TooltipsID);
  
  const { 
    isVideoView, isLive, isTouch, 
    isMobile
  } = player.getStore();
  
  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;
  let isFocused = false;
  let showHighlight = false;

  export let title = null;
  export let label = null;
  export let noTooltip = false;

  export const getEl = () => el;
  export const getTooltip = () => tooltip;

  // --------------------------------------------------------------
  // Tooltips Plugin
  // --------------------------------------------------------------
  
  let tooltip;

  $: Tooltip = $tooltipsPlugin && $tooltipsPlugin.getTooltipComponent();

  // TODO: this is a poor temporary fix, the same control might be reused in different
  // positions, how to register them?
  $: if ($tooltipsPlugin && tooltip && !$tooltipsPlugin.getTooltip(label)) {
    $tooltipsPlugin.getRegistry().register(label, tooltip);
  }
</script>

<style type="text/scss">
  @import '../../style/common';

  button {
    display: flex;
    align-items: center;
    flex-direction: row;
    background: transparent;
    border: 0;
    border-radius: 3px;
    color: inherit;
    cursor: pointer;
    flex-shrink: 0;
    overflow: visible; // IE11
    padding: $control-padding;
    position: relative;
    transition: all 0.3s ease;
    color: #fff;
    pointer-events: auto;

    &.audio {
      color: $color-dark;
    }

    &.touchHighlight {
      background: $color-white-100;

      &.audio {
        background: $color-gray-100;
      }
    }

    &:focus {
      outline: 0;
    }

    &.videoFocus {
      &:focus,
      &:hover,
      &[aria-expanded='true'] {
        background: var(--theme, $color-white-200);
        color: #fff;
      }
    }

    &.audioFocus {
      &:focus,
      &:hover,
      &[aria-expanded='true'] {
        background: var(--theme, $color-dark);
        color: #fff;
      }
    }
  }
</style>