<svelte:options accessors />
<svelte:window on:keydown|capture={onKeyDown} />

{#if $isControlsEnabled && !$useNativeControls}
  <div 
    class="controls"
    class:video={$isVideoView}
    class:inactive={!$isControlsActive}
    bind:this={el}
  >
    {#if $isVideoView}
      <div 
        class="upper"
        class:active={upper.length > 0}
        bind:this={upperEl}
      >
        <ControlGroup
          {player}
          id={UPPER_CONTROLS_ID}
          controls={upper}
          bind:this={upperControlGroup}
          on:register
          on:deregister
        />
      </div>
      <div 
        class="center"
        bind:this={centerEl}
      >
        <ControlGroup
          {player}
          id={CENTER_CONTROLS_ID}
          controls={center}
          bind:this={centerControlGroup}
          on:register
          on:deregister
        />
      </div>
    {/if}
    <div
      class="lower"
      class:mobile={$isMobile}
      class:audio={!$isVideoView}
      class:video={$isVideoView}
      class:inactive={!$isControlsActive}
      bind:this={lowerEl}
    >
      <ControlGroup
        {player}
        id={LOWER_CONTROLS_ID}
        controls={lower}
        bind:this={lowerControlGroup}
        on:register
        on:deregister
      />
    </div>
  </div>
{/if}

<script context="module">
  import { writable } from 'svelte/store';
  import { is_array } from '@vime-js/utils';
  import PluginRole from '../../core/PluginRole';

  export const ID = 'vControls';
  export const ROLE = PluginRole.CONTROLS;

  export const LOWER_CONTROLS_ID = 'vLowerControls';
  export const CENTER_CONTROLS_ID = 'vCenterControls';
  export const UPPER_CONTROLS_ID = 'vUpperControls';
</script>

<script>
  import { tick, onMount, onDestroy } from 'svelte';
  import { raf, listen } from 'svelte/internal';
  import { Registry } from '@vime-js/core';
  import ControlGroup from './ControlGroup.svelte';

  import {
    set_style, get_computed_height, get_computed_height_without_padding,
    set_style_raf
  } from '@vime-js/utils';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const rootEl = player.getEl();

  const {
    paused, playbackReady, isLive,
    mediaType, isVideoView, isControlsEnabled,
    canInteract, isMobile, useNativeControls, _isControlsActive:
    isControlsActive, rebuilding
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;
  
  let lowerEl;
  let centerEl;
  let upperEl;

  let lowerControlGroup;
  let centerControlGroup;
  let upperControlGroup;
  
  let idleTimer = 0;
  let hideControlsTimeout;

  let centerAssists = [];

  export let lower = [];
  export let center = [];
  export let upper = [];

  export const getEl = () => el;
  export const getLowerEl = () => lowerEl;
  export const getCenterEl = () => centerEl;
  export const getUpperEl = () => upperEl;
  export const getLowerInstances = () => lowerControlGroup.getInstances();
  export const getCenterInstances = () => centerControlGroup.getInstances();
  export const getUpperInstances = () => upperControlGroup.getInstances();
  export const getLowerControlsHeight = () => get_computed_height(lowerEl);
  export const getUpperControlsHeight = () => get_computed_height(upperEl);
  export const hasLowerControls = () => lower.length > 0;
  export const hasCenterControls = () => center.length > 0;
  export const hasUpperControls = () => upper.length > 0;

  export const centerAssist = el => {
    if (!centerAssists.includes(el)) centerAssists[centerAssists.length] = el;
    return () => { centerAssists = centerAssists.filter(e => e !== el); };
  };

  $: if (!$paused && $isVideoView && idleTimer) {
    window.clearTimeout(hideControlsTimeout);
    $isControlsActive = true;
    hideControlsTimeout = window.setTimeout(() => { $isControlsActive = false; }, 2750);
  } else {
    window.clearTimeout(hideControlsTimeout);
    $isControlsActive = ($playbackReady && $canInteract) || $rebuilding;
  }

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onShowControls = () => { idleTimer += 1; };

  // Avoid trying to tab-focus a control that is out of view, causes the video to jump.
  const onKeyDown = e => {
    if (
      e.keyCode === 9 &&
      !$isControlsActive &&
      (document.activeElement === rootEl || el.contains(document.activeElement))
    ) e.preventDefault();
    idleTimer += 1;
  };

  const onCenterAssist = async el => {
    await tick();
    raf(() => {
      const paddingBottom = getLowerControlsHeight();
      set_style(el, 'paddingBottom', (lower.length > 0) ? `${paddingBottom}px` : null);
      set_style(el, 'transition', 'padding 0.2s linear');
    });
  };

  const runCenterAssist = () => centerAssists.forEach(onCenterAssist);
  
  const removeCenterAssist = () => centerAssists.forEach(el => {
    set_style_raf(el, 'paddingBottom');
    set_style_raf(el, 'transition');
  });

  onMount(() => {
    const showControlsEvents = ['focus', 'keydown', 'mousemove', 'touchstart'];
    showControlsEvents.forEach(event => onDestroy(listen(player.getEl(), event, onShowControls)));
  });

  onDestroy(() => {
    removeCenterAssist();
    centerAssists = [];
  });

  const positionCenterControls = async () => {
    await tick();
    raf(() => {
      const lHeight = get_computed_height_without_padding(lowerEl);
      const uHeight = get_computed_height_without_padding(upperEl);
      let paddingBottom = null;
      if (hasLowerControls() && hasUpperControls()) {
        paddingBottom = lHeight + uHeight;
      } else if (hasLowerControls()) {
        paddingBottom = lHeight;
      } else if (hasUpperControls()) {
        paddingBottom = uHeight;
      }
      set_style(centerEl, 'paddingBottom', `${paddingBottom}px`);
    });
  };

  $: if (centerEl) positionCenterControls(lower, upper);
  $: if (centerEl) set_style(centerEl, 'transition', 'padding 0.2s linear');

  $: if ($isControlsEnabled && lowerEl) {
    runCenterAssist(centerAssists, lower);
  } else {
    removeCenterAssist();
  }
</script>

<style type="text/scss">
  @import '../../style/common';

  .controls {
    position: relative;
    display: flex;
    flex-flow: column;
    transition: opacity 0.4s ease-in-out;
    z-index: 3;
    pointer-events: none;

    &.video {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }

    &.inactive {
      opacity: 0;

      & > div {
        visibility: hidden;
      }
    }
  }

  .center,
  .lower {
    :global(> div),
    :global(> .control) {
      margin-left: $control-spacing;

      &:first-child {
        margin-left: 0;
      }
    }
  }

  .upper {
    width: 100%;
    align-items: center;
    flex-flow: wrap;
    background: linear-gradient(to top, rgba($color-dark, 0), rgba($color-dark, 0.7));

    &.active {
      padding: $control-spacing;
      display: flex;
    }

    :global(> div),
    :global(> .control) {
      margin-left: ($control-spacing / 2);
    }
  }

  .center {
    display: flex;
    width: 100%;
    flex: 1;
    flex-flow: wrap;
    justify-content: center;
    align-items: center;

    :global(.control) {
      color: #fff !important;
    }
  }

  .lower {
    display: flex;
    width: 100%;
    align-items: center;
    flex-flow: wrap;

    &.audio {
      background: #fff;
      border-radius: inherit;
      color: $color-dark;
      padding: $control-spacing;
      box-shadow: 0 0 8px 2px $color-gray-100;
    }

    &.video {
      background: linear-gradient(rgba($color-dark, 0), rgba($color-dark, 0.7));
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
      bottom: 0;
      color: #fff;
      left: 0;
      padding: $control-spacing ($control-spacing / 2) ($control-spacing / 2);
      position: absolute;
      right: 0;
      transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
      z-index: 4;

      @media (min-width: $bp-sm) {
        padding: $control-spacing;
      }
    }

    &.mobile.video {
      padding: $control-spacing;
    }

    &.inactive {
      position: absolute;
      opacity: 0;
      pointer-events: none;
      transform: translateY(100%);
    }
  }
</style>