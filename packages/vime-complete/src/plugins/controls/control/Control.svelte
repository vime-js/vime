<svelte:options accessors />

<button
  class="control"
  class:large
  class:live={$isLive}
  class:audio={!$isVideoView}
  class:videoFocus={$isVideoView && !$isTouch}
  class:audioFocus={!$isVideoView && !$isTouch}
  class:touchHighlight={showHighlight}
  use:vFocus
  use:vHighlight
  on:click
  on:keydown
  on:focuschange
  on:focuschange="{(e) => { isFocused = e.detail; }}"
  on:highlightchange="{(e) => { showHighlight = e.detail; }}"
  {...$$restProps}
  aria-describedby={tooltip ? tooltipId : null}
  bind:this={el}
>
  <slot />
  {#if shouldRenderTooltip}
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
  import { vFocus, vHighlight } from '@vime-js/utils';
  import { ID as TooltipsID } from '../../tooltips/Tooltips.svelte';
  
  // eslint-disable-next-line prefer-const
  tooltipIdCount += 1;
  const tooltipId = `v-tooltip-${tooltipIdCount}`;

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
  export let large = false;
  export let shouldRenderTooltip = true;

  export const getEl = () => el;

  // --------------------------------------------------------------
  // Tooltips Plugin
  // --------------------------------------------------------------
  
  let tooltip;

  export const getTooltip = () => tooltip;

  $: tooltips = $plugins[TooltipsID];
  $: Tooltip = tooltips && tooltips.getTooltipComponent();
  $: tooltipsRegistry = tooltips && tooltips.getRegistry();

  // TODO: this is a poor temporary fix, the same control might be reused in different
  // positions, how to register them?
  $: if (label && tooltipsRegistry && tooltip && !tooltipsRegistry.has(label)) {
    tooltipsRegistry.register(label, tooltip);
  }
</script>

<style type="text/scss">
  @import '../../../style/common';

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
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: $color-gray-300;

      @media (min-width: 480px) {
        width: 60px;
        height: 60px;

        & :global(svg) {
          transform: scale(1.4);
        }
      }

      @media (min-width: 860px) {
        width: 68px;
        height: 68px;

        & :global(svg) {
          transform: scale(1.5);
        }
      }
    }

    &.videoFocus {
      &:focus,
      &:hover,
      &[aria-expanded='true'] {
        background: var(--color, $color-white-200);
        color: #fff;
      }
    }

    &.audioFocus {
      &:focus,
      &:hover,
      &[aria-expanded='true'] {
        background: var(--color, $color-dark);
        color: #fff;
      }
    }
  }
</style>