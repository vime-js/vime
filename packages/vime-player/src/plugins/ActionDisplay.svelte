<svelte:options accessors />

{#if enabled && value}
  <div 
    class="container"
    bind:this={valueContainer}
  >
    <div 
      class="value" 
      class:show
    >
      {value}
    </div>
  </div>
{/if}

{#if enabled && icon}
  <div 
    class="container"
    bind:this={actionContainer}
  >
    <div
      class="action"
      class:show 
      bind:this={iconRef}
    >
      <Icon {icon} />
    </div>
  </div>
{/if}

<script context="module">
  export const ID = 'vActionDisplay';
</script>

<script>
  import { tick } from 'svelte';
  import { Icon } from '@vime/core';
  import { ID as ControlsId } from './controls/Controls.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const { isMobile, controlsEnabled, playbackReady, isVideoView } = player.getStore();
  const controlsPlugin = player.getPluginsRegistry().watch(ControlsId);

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let timer;
  let icon;
  let value;
  let iconRef;
  let show = false;

  let valueContainer;
  let actionContainer;

  export let autopilot = true;
  export let enabled = false;

  $: if (autopilot) enabled = $controlsEnabled && $playbackReady && $isVideoView && !$isMobile;

  export const run = async (i, v = null) => {
    icon = i;
    value = v;
    window.clearTimeout(timer);
    show = false;
    await tick();
    // eslint-disable-next-line no-void
    if (iconRef) void iconRef.offsetWidth; // Trigger reflow
    show = true;
    timer = setTimeout(() => { show = false; }, 600);
  };

  // --------------------------------------------------------------
  // Controls Plugin
  // --------------------------------------------------------------

  $: if (valueContainer && $controlsPlugin) $controlsPlugin.centerAssist(valueContainer);
  $: if (actionContainer && $controlsPlugin) $controlsPlugin.centerAssist(actionContainer);
</script>

<style type="text/scss">
  @import '../style/common';

  @keyframes expand {
    25% {
      opacity: 0.1;
    }
    50% {
      opacity: 0.38;
    }
    100% {
      opacity: 0;
      transform: scale(2);
    }
  }

  .container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    z-index: 2;
    pointer-events: none;
  }

  .value {
    margin-top: $control-spacing * 2;
    background: $color-gray-400;
    color: #fff;
    font-size: $font-size-extra-large;
    padding: $control-spacing ($control-spacing * 4);
    border-radius: 2px;
    opacity: 0;
    transition: opacity 0.6s ease-in-out;

    &.show {
      opacity: 1;
    }
  }

  .action {
    display: flex;
    align-items: center;
    justify-content:center;
    margin: auto 0;
    background: #000;
    border: 0;
    border-radius: 100%;
    color: #fff;
    width: 50px;
    height: 50px;
    opacity: 0;

    &.show {
      animation: expand 0.6s ease-in-out;
    }
  }
</style>