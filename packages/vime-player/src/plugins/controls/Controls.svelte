<svelte:options accessors />
<svelte:window on:keydown|capture={onKeyDown} />

{#if $isControlsEnabled}
  <div 
    class="controls"
    class:video={$isVideo || $poster}
    class:inactive={!$isControlsActive}
    bind:this={el}
  >
    {#if $isVideo || !!$poster}
      <div 
        class="upper"
        class:video={$isVideo}
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
      class:audio={$isAudio}
      class:video={$isVideo}
      class:inactive={!$isControlsActive}
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
  import { is_array } from '~utils/unit'
  import { writable } from 'svelte/store'
  import PluginRole from '~core/PluginRole'

  export const ID = 'vControls'
  export const ROLE = PluginRole.CONTROLS

  export const LOWER_CONTROLS_ID = 'vLowerControls'
  export const CENTER_CONTROLS_ID = 'vCenterControls'
  export const UPPER_CONTROLS_ID = 'vUpperControls'
</script>

<script>
  import { listen } from 'svelte/internal'
  import { tick, onMount, onDestroy } from 'svelte'
  import Registry from '~core/Registry'
  import ControlGroup from './ControlGroup.svelte'

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player

  const rootEl = player.getEl()
  const { isMobile } = player.getGlobalStore()

  const {
    isAudio, isVideo, isPaused,
    isPlaybackReady, isLiveStream, mediaType,
    poster, isControlsEnabled, _isControlsActive: isControlsActive,
    canInteract
  } = player.getStore()

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el
  
  let lowerEl
  let centerEl
  let upperEl

  let lowerControlGroup
  let centerControlGroup
  let upperControlGroup
  
  let idleTimer = 0
  let hideControlsTimeout

  let centerAssists = []
  let lowerControlsHeight = 0
  let upperControlsHeight = 0

  export let lower = []
  export let center = []
  export let upper = []

  export const getEl = () => el
  export const getLowerEl = () => lowerEl
  export const getCenterEl = () => centerEl
  export const getUpperEl = () => upperEl
  export const getLowerInstances = () => lowerControlGroup.getInstances()
  export const getCenterInstances = () => centerControlGroup.getInstances()
  export const getUpperInstances = () => upperControlGroup.getInstances()

  export const centerAssist = el => {
    if (!centerAssists.includes(el)) centerAssists[centerAssists.length] = el
    return () => { centerAssists = centerAssists.filter(e => e !== el) }
  }

  $: if (!$isPaused && !$isAudio && idleTimer) {
    window.clearTimeout(hideControlsTimeout)
    $isControlsActive = true
    hideControlsTimeout = window.setTimeout(() => { $isControlsActive = false }, 2000)
  } else {
    window.clearTimeout(hideControlsTimeout)
    $isControlsActive = $isPlaybackReady && $canInteract
  }

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onShowControls = () => { idleTimer += 1 }

  // Avoid trying to tab-focus a control that is out of view, causes the video to jump.
  const onKeyDown = e => {
    if (
      e.keyCode === 9 &&
      !$isControlsActive &&
      (document.activeElement === rootEl || el.contains(document.activeElement))
    ) e.preventDefault()
    idleTimer += 1
  }

  const onCenterAssist = () => centerAssists.forEach(el => {
    const lowerControlsTopPadding = window.getComputedStyle(lowerEl).paddingTop
    const upperControlsBottomPadding = window.getComputedStyle(upperEl).paddingBottom
    el.style.paddingTop = `${upperControlsHeight - parseFloat(upperControlsBottomPadding)}px`
    el.style.paddingBottom = `${lowerControlsHeight - parseFloat(lowerControlsTopPadding)}px`
  })

  const onRemoveCenterAssist = () => centerAssists.forEach(el => {
    el.style.paddingTop = null
    el.style.paddingBottom = null
  })

  onMount(() => {
    const showControlsEvents = ['focus', 'keydown', 'mousemove', 'touchstart']
    showControlsEvents.forEach(event => onDestroy(listen(player.getEl(), event, onShowControls)))
  })

  onDestroy(() => {
    onRemoveCenterAssist()
    centerAssists = []
  })

  $: if (centerEl) centerAssist(centerEl)

  $: if ($isControlsActive && lowerEl && upperEl) {
    onCenterAssist(lowerControlsHeight, upperControlsHeight)
  } else {
    onRemoveCenterAssist()
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

    &.active {
      display: flex;
      padding: $control-spacing;
    }

    &.video {
      background: linear-gradient(to top, rgba($color-dark, 0), rgba($color-dark, 0.7));
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