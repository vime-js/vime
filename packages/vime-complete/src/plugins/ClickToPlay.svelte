<svelte:options accessors />

<script context="module">
  export const ID = 'vClickToPlay';
</script>

<script>
  import { listen } from 'svelte/internal';
  import { onDestroy } from 'svelte';
  import { get_playback_icon } from '../utils';
  import { ID as ActionDisplayId } from './ActionDisplay.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const {
    icons, paused, isControlsEnabled,
    canInteract, isVideoView, isMobile,
    useNativeControls,
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------
  
  export let autopilot = true;
  export let isEnabled = true;

  $: if (autopilot) {
    isEnabled = $isControlsEnabled
      && $canInteract
      && $isVideoView
      && !$isMobile
      && !$useNativeControls;
  }

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onToggle = () => {
    $paused = !$paused;
    const icon = get_playback_icon($icons, !$paused);
    if (player[ActionDisplayId]) player[ActionDisplayId].run(icon);
  };

  let timer;
  let onClickListener;
  const bindClickListener = () => {
    const onClick = (e) => {
      window.clearTimeout(timer);
      // Using a timer to avoid interfering with double clicking.
      timer = setTimeout(() => {
      // TODO: this is probably not ideal, need a better solution.
        const isInputNode = ['BUTTON', 'INPUT'].includes(e.target.nodeName);
        if (e.detail === 1 && !isInputNode) onToggle();
      }, 300);
    };
    onClickListener = listen(player.getEl(), 'click', onClick);
  };

  const unbindClickListener = () => {
    if (onClickListener) onClickListener();
    timer = null;
    onClickListener = null;
  };

  onDestroy(unbindClickListener);

  $: if (isEnabled && !onClickListener) {
    bindClickListener();
  } else if (!isEnabled && onClickListener) {
    unbindClickListener();
  }
</script>