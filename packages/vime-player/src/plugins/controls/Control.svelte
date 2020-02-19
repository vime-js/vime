<button
  id={$$props.id}
  class="control"
  class:audio={$isAudio}
  class:live={$isLiveStream}
  class:videoFocus={!$isTouch}
  class:audioFocus={$isAudio && !$isTouch}
  class:touchHighlight={showHighlight}
  use:focus
  use:highlight
  on:click
  on:keydown
  on:focuschange
  on:focuschange="{e => { isFocused = e.detail }}"
  on:highlightchange="{e => { showHighlight = e.detail }}"
  aria-label={$$props['aria-label']}
  aria-pressed={$$props['aria-pressed']}
  aria-haspopup={$$props['aria-haspopup']}
  aria-controls={$$props['aria-controls']}
  aria-disabled={$$props['aria-disabled']}
  aria-expanded={$$props['aria-expanded']}
  aria-hidden={$$props['aria-hidden']}
  aria-describedby={tooltip ? tooltipID : null}
  bind:this={el}
>
  <slot />
  <svelte:component 
    {player}
    {title}
    id={tooltipID}
    isActive={isFocused}
    this={Tooltip}
    bind:this={tooltip}
  />
</button>

<script context="module">
  let tooltipIDCount = 0
</script>

<script>
  import { createEventDispatcher, onDestroy } from 'svelte'
  import { focus, highlight } from '~utils/actions'
  import { ID as TooltipsID } from '~plugins/tooltips/Tooltips.svelte'
  
  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player

  // eslint-disable-next-line prefer-const
  tooltipIDCount += 1
  const tooltipID = `tooltip-${tooltipIDCount}`

  const dispatch = createEventDispatcher()
  const plugins = player.getPluginsRegistry()
  const { isTouch, isMobile } = player.getGlobalStore()
  const { isAudio, isLiveStream, isCurrentPlayer } = player.getStore()
  
  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el
  let isFocused = false
  let showHighlight = false

  export let title
  export let label

  export const getEl = () => el
  export const getTooltip = () => tooltip

  // --------------------------------------------------------------
  // Tooltips Plugin
  // --------------------------------------------------------------
  
  let tooltip

  $: tooltips = $plugins && $plugins[TooltipsID]
  $: Tooltip = tooltips && tooltips.create()
  $: if (tooltips && tooltip) tooltips.register(label, tooltip)
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