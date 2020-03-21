<button
  id={$$props.id}
  class="control"
  class:large
  class:live={$isLive}
  class:audio={!$isVideoView}
  class:videoFocus={$isVideoView && !$isTouch}
  class:audioFocus={!$isVideoView && !$isTouch}
  class:touchHighlight={showHighlight}
  use:focus
  use:highlight
  on:click
  on:keydown
  on:focuschange
  on:focuschange="{(e) => { isFocused = e.detail; }}"
  on:highlightchange="{(e) => { showHighlight = e.detail; }}"
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
  import { focus, highlight } from '@vime-js/core';
  import { ID as TooltipsID } from '../tooltips/Tooltips.svelte';
  
  // eslint-disable-next-line prefer-const
  tooltipIdCount += 1;
  const tooltipId = `tooltip-${tooltipIdCount}`;

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const plugins = player.getPluginsRegistry();
  const { isVideoView, isLive, isTouch } = player.getStore();
  
  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;
  let isFocused = false;
  let showHighlight = false;

  export let title = null;
  export let label = null;
  export let noTooltip = false;
  export let large = false;

  export const getEl = () => el;

  // --------------------------------------------------------------
  // Tooltips Plugin
  // --------------------------------------------------------------
  
  let tooltip;

  export const getTooltip = () => tooltip;

  $: tooltipsPlugin = $plugins[TooltipsID];
  $: Tooltip = tooltipsPlugin && tooltipsPlugin.getTooltipComponent();
  $: tooltipsRegistry = tooltipsPlugin && tooltipsPlugin.getRegistry();

  // TODO: this is a poor temporary fix, the same control might be reused in different
  // positions, how to register them?
  $: if (tooltipsRegistry && tooltip && !tooltipsRegistry.has(label)) {
    tooltipsRegistry.register(label, tooltip);
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

    &.large {
      padding: $control-padding * 2;

      & :global(svg) {
        transform: scale(1.5);
      }
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