<svelte:options accessors />

{#if isEnabled && title}
  <span
    {id}
    role="tooltip"
    class:audio={$isAudio}
    class:onTop
    class:onBottom
    class:growLeft
    class:growRight
    aria-hidden={!isActive || $isTouch}
    bind:this={el}
  >
    {(showHint && hint) ? `${title} (${hint})` : title}
  </span>
{/if}

<script>
  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const { isTouch, isAudio } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;
  let onTop = true;
  let onBottom = false;
  let growLeft = false;
  let growRight = false;

  export let id = null;
  export let title = null;
  export let hint = null;
  export let isEnabled = true;
  export let isActive = false;
  export let showHint = true;
  export let noBounding = false;

  export const getEl = () => el;

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onBound = () => {
    const rect = el.getBoundingClientRect();
    const bounds = player.getEl().getBoundingClientRect();
    onBottom = onBottom ? (rect.top - bounds.top > rect.height) : (rect.top <= bounds.top);
    onTop = !onBottom
    growLeft = growLeft ? (rect.right - bounds.right) < rect.width : (rect.right - bounds.right) > 0;
    growRight = growRight ? (rect.left - bounds.left) < rect.width : (bounds.left - rect.left) > 0;
  };

  $: if (el && !noBounding) onBound(title, isActive);
</script>

<style type="text/scss">
  @import '../../style/common';
  
  $tooltip-padding: ($control-spacing / 2);

  span {
    background: $color-dark;
    border-radius: 3px;
    box-shadow: 0 0 2px $color-gray-500;
    color: $color-white-700;
    font-size: $font-size-small;
    font-weight: $font-weight-regular;
    line-height: 1.3;
    opacity: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: $tooltip-padding;
    pointer-events: none;
    position: absolute;
    transition: opacity 0.2s ease;
    white-space: nowrap;
    z-index: 10;

    &[aria-hidden='false'] {
      opacity: 1;
    }

    &.onTop {
      bottom: 100%;
      margin-bottom: $control-spacing;
    }

    &.onBottom {
      top: 100%;
      margin-top: $control-spacing;
    }

    &.growLeft {
      left: auto;
      right: 0;
      transform: none;
    }

    &.growRight {
      left: 0;
      transform: none;
    }

    &.audio {
      background: #fff;
      color: $color-dark;
      box-shadow: 0 0 2px $color-gray-500 !important;
    }
  }
</style>