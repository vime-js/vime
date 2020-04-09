<svelte:options accessors />

<script context="module">
  export const ID = 'vDblClickFullscreen';
</script>

<script>
  import { onDestroy } from 'svelte';
  import { noop, listen } from 'svelte/internal';
  import { get_fullscreen_icon } from '../utils';
  import { ID as ActionDisplayId } from './ActionDisplay.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const {
    icons, isControlsEnabled, canSetFullscreen,
    isVideoView, canInteract, isMobile, isFullscreenActive,
    useNativeControls,
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  export let autopilot = true;
  export let isEnabled = true;

  $: if (autopilot) {
    isEnabled = $isControlsEnabled
      && $canSetFullscreen
      && $canInteract
      && $isVideoView
      && !$isMobile
      && !$useNativeControls;
  }

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onToggle = () => {
    (!$isFullscreenActive
      ? player.requestFullscreen().catch(noop)
      : player.exitFullscreen().catch(noop)
    );
    const icon = get_fullscreen_icon($icons, $isFullscreenActive);
    if (player[ActionDisplayId]) player[ActionDisplayId].run(icon);
  };

  let onDblClickListener;
  const bindDblClickListener = () => {
    const onDblClick = (e) => {
    // TODO: this is probably not ideal, need a better solution.
      const isInputNode = ['BUTTON', 'INPUT'].includes(e.target.nodeName);
      if (!isInputNode) onToggle();
    };
    onDblClickListener = listen(player.getEl(), 'dblclick', onDblClick);
  };

  const unbindDblClickListener = () => {
    if (onDblClickListener) onDblClickListener();
    onDblClickListener = null;
  };

  onDestroy(unbindDblClickListener);

  $: if (isEnabled && !onDblClickListener) {
    bindDblClickListener();
  } else if (!isEnabled && onDblClickListener) {
    unbindDblClickListener();
  }
</script>