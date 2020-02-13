<svelte:options accessors />

<script context="module">
  export const ID = 'vDblClickFullscreen'
</script>

<script>
  import { listen } from 'svelte/internal'
  import { onMount, onDestroy } from 'svelte'
  import { get_fullscreen_icon } from '~utils/icon'
  import { ID as ActionDisplayId } from '~plugins/ActionDisplay.svelte'

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player

  const { isMobile } = player.getGlobalStore()

  const {
    icons, isFullscreenActive, isControlsEnabled,
    isFullscreenSupported, isFullscreenEnabled, isAudio,
    isPlaybackReady
  } = player.getStore()

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  export let resolve = true
  export let isEnabled = false

  $: if (resolve) {
    isEnabled = $isControlsEnabled &&
      $isFullscreenSupported &&
      $isFullscreenEnabled &&
      $isPlaybackReady &&
      !$isMobile &&
      !$isAudio
  }

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onToggle = () => {
    $isFullscreenActive = !$isFullscreenActive
    const icon = get_fullscreen_icon($icons, !$isFullscreenActive)
    if (player[ActionDisplayId]) player[ActionDisplayId].run(icon)
  }

  let dblClickOff
  const onBindDblClick = () => {
    const onDblClick = e => {
    // TODO: this is probably not ideal, need a better solution.
      const isInputNode = ['BUTTON', 'INPUT'].includes(e.target.nodeName)
      if (!isInputNode) onToggle()
    }
    dblClickOff = listen(player.getEl(), 'dblclick', onDblClick)
  }

  const onUnbindDblClick = () => {
    dblClickOff && dblClickOff()
    dblClickOff = null
  }

  onDestroy(onUnbindDblClick)

  $: if (isEnabled && !dblClickOff) {
    onBindDblClick()
  } else if (!isEnabled && dblClickOff) {
    onUnbindDblClick()
  }
</script>