<svelte:options accessors />

<script context="module">
  export const ID = 'vDblClickFullscreen';
</script>

<script>
  import { onMount, onDestroy } from 'svelte';
  import { noop, listen } from 'svelte/internal';
  import { get_fullscreen_icon } from '../utils';
  import { ID as ActionDisplayId } from './ActionDisplay.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const {
    icons, controlsEnabled, canSetFullscreen, 
    isVideoView, canInteract, isMobile, fullscreenActive
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  export let autopilot = true;
  export let enabled = false;

  $: if (autopilot) {
    enabled = $controlsEnabled && $canSetFullscreen && $canInteract && $isVideoView && !$isMobile;
  }

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onToggle = () => {
    player.requestFullscreen().catch(noop);
    const icon = get_fullscreen_icon($icons, !$fullscreenActive);
    if (player[ActionDisplayId]) player[ActionDisplayId].run(icon);
  };

  let onDblClickListener;
  const bindDblClickListener = () => {
    const onDblClick = e => {
    // TODO: this is probably not ideal, need a better solution.
      const isInputNode = ['BUTTON', 'INPUT'].includes(e.target.nodeName);
      if (!isInputNode) onToggle();
    };
    onDblClickListener = listen(player.getEl(), 'dblclick', onDblClick);
  };

  const unbindDblClickListener = () => {
    onDblClickListener && onDblClickListener();
    onDblClickListener = null;
  };

  onDestroy(unbindDblClickListener);

  $: if (enabled && !onDblClickListener) {
    bindDblClickListener();
  } else if (!enabled && onDblClickListener) {
    unbindDblClickListener();
  }
</script>