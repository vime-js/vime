<svelte:options accessors />
<svelte:window on:keydown|capture={onKeyDown} />

{#if $controlsEnabled}
  <div 
    class="controls"
    class:video={$isVideoView}
    class:inactive={!$controlsActive}
    bind:this={el}
  >
    {#if $isVideoView}
      <div 
        class="upper"
        class:active={upper.length > 0}
        bind:this={upperEl}
        bind:clientHeight={upperControlsHeight}
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
      class:audio={!$isVideoView}
      class:video={$isVideoView}
      class:inactive={!$controlsActive}
      bind:this={lowerEl}
      bind:clientHeight={lowerControlsHeight}
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
  import { is_array } from '@vime/utils';
  import PluginRole from '../../core/PluginRole';

  export const ID = 'vControls';
  export const ROLE = PluginRole.CONTROLS;

  export const LOWER_CONTROLS_ID = 'vLowerControls';
  export const CENTER_CONTROLS_ID = 'vCenterControls';
  export const UPPER_CONTROLS_ID = 'vUpperControls';
</script>

<script>
  import { tick, onMount, onDestroy } from 'svelte';
  import { listen } from 'svelte/internal';
  import { Registry } from '@vime/core';
  import ControlGroup from './ControlGroup.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const rootEl = player.getEl();

  const {
    isAudio, paused, playbackReady, 
    isLive, mediaType, isVideoView, 
    controlsEnabled, controlsActive, canInteract, 
    isMobile
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
  let lowerControlsHeight = 0;
  let upperControlsHeight = 0;

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
  export const hasLowerControls = () => lower.length > 0;
  export const hasCenterControls = () => center.length > 0;
  export const hasUpperControls = () => upper.length > 0;

  export const centerAssist = el => {
    if (!centerAssists.includes(el)) centerAssists[centerAssists.length] = el;
    return () => { centerAssists = centerAssists.filter(e => e !== el); };
  };

  $: if (!$paused && !$isAudio && idleTimer) {
    window.clearTimeout(hideControlsTimeout);
    $controlsActive = true;
    hideControlsTimeout = window.setTimeout(() => { $controlsActive = false; }, 2750);
  } else {
    window.clearTimeout(hideControlsTimeout);
    $controlsActive = $playbackReady && $canInteract;
  }

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onShowControls = () => { idleTimer += 1; };

  // Avoid trying to tab-focus a control that is out of view, causes the video to jump.
  const onKeyDown = e => {
    if (
      e.keyCode === 9 &&
      !$controlsActive &&
      (document.activeElement === rootEl || el.contains(document.activeElement))
    ) e.preventDefault();
    idleTimer += 1;
  };

  const getLowerControlsYPadding = () => {
    if (!lowerEl) return 0;
    return parseFloat(window.getComputedStyle(lowerEl).paddingTop) +
      parseFloat(window.getComputedStyle(lowerEl).paddingBottom);
  }

  const onCenterAssist = el => {
    const paddingBottom = lowerControlsHeight + getLowerControlsYPadding();
    el.style.paddingBottom = (lower.length > 0) ? `${paddingBottom}px` : null;
    el.style.transition = 'padding 0.2s linear';
  }

  const runCenterAssist = () => centerAssists.forEach(onCenterAssist);
  const removeCenterAssist = () => centerAssists.forEach(el => {
    el.style.paddingBottom = null;
    el.style.transition = null;
  })

  onMount(() => {
    const showControlsEvents = ['focus', 'keydown', 'mousemove', 'touchstart'];
    showControlsEvents.forEach(event => onDestroy(listen(player.getEl(), event, onShowControls)));
  });

  onDestroy(() => {
    removeCenterAssist();
    centerAssists = [];
  });

  $: if (centerEl) {
    onCenterAssist(centerEl, lower, lowerEl, lowerControlsHeight)
    if (lower.length === 0 && upper.length > 0) {
      centerEl.style.paddingBottom = `${upperControlsHeight}px`;
    }
  }

  $: if ($controlsEnabled && lowerEl) {
    runCenterAssist(
      centerAssists,
      lower,
      lowerControlsHeight,
    );
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
      display: flex;
      padding: $control-spacing;
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

    &.inactive {
      position: absolute;
      opacity: 0;
      pointer-events: none;
      transform: translateY(100%);
    }
  }
</style>