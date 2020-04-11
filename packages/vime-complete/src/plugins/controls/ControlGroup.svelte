<svelte:options accessors />

{#if isEnabled && controls.length > 0}
  <div
    class="group"
    class:fill={shouldFill}
    use:vShow={isActive}
    bind:this={el}
  >
    <div 
      class="container"
      class:mobile={$isMobile}
      class:audio={!$isVideoView}
      class:video={$isVideoView}
      class:gradientUp
      class:gradientDown
      bind:this={containerEl}
    >
      {#each controls as Control}
        <svelte:component
          {player}
          this={Control.default}
          bind:this={instances[Control.ID]}
        />
      {/each}
    </div>
  </div>
{/if}

<script>
  import { set_style, vShow } from '@vime-js/utils';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const { isMobile, isVideoView } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;
  let containerEl;

  const instances = {};

  export let controls = [];
  export let isEnabled = true;
  export let isActive = false;
  export let shouldFill = false;
  export let flow = null;
  export let position = null;
  export let gradientUp = false;
  export let gradientDown = false;

  export const getEl = () => el;
  export const hasControls = () => controls.length > 0;

  export const getInstances = () => {
    const { undefined: _, ...rest } = instances;
    return rest;
  };

  export const reset = () => {
    controls = [];
    isEnabled = true;
    isActive = false;
    shouldFill = false;
    flow = null;
    position = null;
  };

  const onPositionChange = () => {
    if (!position) {
      set_style(el, 'alignItems');
      set_style(containerEl, 'justifyContent');
      return;
    }
    const [align, justify] = position.split(':');
    set_style(el, 'alignItems', align);
    set_style(isColumnFlow ? el : containerEl, 'justifyContent', justify);
  };

  const onFlowChange = () => {
    set_style(containerEl, 'flexFlow', flow);
    set_style(containerEl, 'width', (isColumnFlow) ? 'auto' : null);
  };

  $: if (el && containerEl) onPositionChange(position, isColumnFlow);
  $: if (containerEl) onFlowChange(flow, isColumnFlow);
  $: isColumnFlow = flow && flow.includes('column');
</script>

<style type="text/scss">
  @import '../../style/common';

  .group {
    width: 100%;
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    color: #fff;
    position: relative;

    &.fill {
      flex: 1;
    }
  }

  .container {
    position: relative;
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    align-items: center;
    padding: $control-spacing;

    &.audio {
      background: #fff;
      color: $color-dark;
      padding: $control-spacing;
      box-shadow: 0 0 8px 2px $color-gray-100;
    }
    
    &.video {
      background-clip: padding-box;
      padding: $control-spacing ($control-spacing / 2) ($control-spacing / 2);

      @media (min-width: $bp-sm) {
        padding: $control-spacing;
      }

      &.gradientUp {
        background: linear-gradient(transparent, rgba(90, 90, 90, 0.4));
      }

      &.gradientDown {
        background: linear-gradient(rgba(90, 90, 90, 0.4), transparent);
      }

      &.mobile {
        padding: $control-spacing;
      }
    }

    :global(> div),
    :global(> .control) {
      margin-left: $control-spacing;

      &:first-child {
        margin-left: 0;
      }
    }
  }
</style>