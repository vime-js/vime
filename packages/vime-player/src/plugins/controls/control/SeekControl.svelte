<svelte:options accessors />

{#if isEnabled}
  <div 
    class:disabled={isDisabled}
    use:vShow={isActive}
    bind:this={el}
  >
    <span 
      class="accumulator" 
      use:vShow={accumulator !== 0}
      aria-hidden={accumulator !== 0}
      aria-label={$i18n.seekTotal}
    >
      {`${shouldSeekForward ? '+' : '-'} ${format_time(Math.abs(accumulator))}`}
    </span>
    <Control
      {player}
      shouldRenderTooltip={false}
      on:click={onSeek}
      aria-disabled={isDisabled}
      aria-hidden={!isActive}
      aria-label={shouldSeekForward ? $i18n.seekForward : $i18n.seekBackward}
      bind:this={control}
    >
      <span class="title backward" class:hidden={shouldSeekForward}>{Math.abs(base)}s</span>
      <Icon icon={shouldSeekForward ? $icons.seekForward : $icons.seekBackward} />
      <span class="title forward" class:hidden={!shouldSeekForward}>{Math.abs(base)}s</span>
    </Control>
  </div>
{/if}

<script>
  import { Icon } from '@vime-js/core';
  import { format_time, vShow } from '@vime-js/utils';
  import Control from './Control.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const {
    icons, i18n, currentTime, duration,
} = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let timer;
  let accumulator = 0;
  let isDisabled = false;

  let el;
  let control;

  export let base = 0;
  export let isEnabled = true;
  export let isActive = false;

  export const getEl = () => el;
  export const getControl = () => control;

  $: shouldSeekForward = base > 0;
  $: isDisabled = shouldSeekForward ? ($currentTime + base > $duration) : ($currentTime + base < 0);

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onSeek = () => {
    if (isDisabled) return;
    window.clearTimeout(timer);
    accumulator += base;
    timer = setTimeout(() => {
      $currentTime = Math.max(0, Math.min($duration, $currentTime + accumulator));
      accumulator = 0;
      timer = null;
    }, 600);
  };
</script>

<style type="text/scss">
  @import '../../../style/common';

  div {
    position: relative;
    align-items: center;
    display: flex;

    &.disabled {
      :global(.control) {
        color: $color-white-400 !important;
      }

      span {
        color: $color-white-400;
      }
    }
  }

  .accumulator {
    width: 100%;
    text-align: center;
    position: absolute;
    top: -24px;
    color: $color-white-400;
    font-size: $font-size-small;
    z-index: 3;
  }

  .title {
    color: #fff;
    font-size: $font-size-small;
    font-weight: $font-weight-regular;
    line-height: 1.4;
    z-index: 3;

    &.forward {
      padding-left: $control-spacing;
    }

    &.backward {
      padding-right: $control-spacing;
    }

    &.hidden {
      display: none;
    }
  }
</style>