<svelte:options accessors />

<script context="module">
  export const ID = 'vClickToPlay'
</script>

<script>
  import { listen } from 'svelte/internal'
  import { onMount, onDestroy } from 'svelte'
  import { get_playback_icon } from '~utils/icon'
  import { ID as ActionDisplayId } from '~plugins/ActionDisplay.svelte'

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player

  const { isMobile } = player.getGlobalStore()

  const {
    icons, isPaused, isControlsEnabled,
    canInteract, isAudio
  } = player.getStore()

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------
  
  export let resolve = true
  export let isEnabled = false

  $: if (resolve) isEnabled = $isControlsEnabled && $canInteract && !$isMobile && !$isAudio

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onToggle = () => {
    $isPaused = !$isPaused
    const icon = get_playback_icon($icons, !$isPaused)
    if (player[ActionDisplayId]) player[ActionDisplayId].run(icon)
  }

  let timer
  let clickOff
  const onBindClick = () => {
    const onClick = e => {
      window.clearTimeout(timer)
      // Using a timer to avoid interfering with double clicking.
      timer = setTimeout(() => {
      // TODO: this is probably not ideal, need a better solution.
        const isInputNode = ['BUTTON', 'INPUT'].includes(e.target.nodeName)
        if (e.detail === 1 && !isInputNode) onToggle()
      }, 150)
    }
    clickOff = listen(player.getEl(), 'click', onClick)
  }

  const onUnbindClick = () => {
    clickOff && clickOff()
    timer = null
    clickOff = null
  }

  onDestroy(onUnbindClick)

  $: if (isEnabled && !clickOff) {
    onBindClick()
  } else if (!isEnabled && clickOff) {
    onUnbindClick()
  }
</script>