<ToggleControl
  {player}
  label={LABEL}
  autopilot={false}
  isActive={$isPiPActive}
  isEnabled={$canSetPiP}
  activeIcon={$icons.exitPiP}
  inactiveIcon={$icons.enterPiP}
  activeTitle={$i18n.exitPiP}
  inactiveTitle={$i18n.enterPiP}
  aria-label={$i18n.pip}
  on:click={onToggle}
  bind:this={toggle}
/>

<script context="module">
  export const ID = 'vPiPControl';
  export const LABEL = 'togglePiP';
</script>

<script>
  import { noop } from 'svelte/internal';
  import ToggleControl from './ToggleControl.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const {
    icons, i18n, isPiPActive, canSetPiP,
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let toggle;

  export const getToggle = () => toggle;

  const onToggle = () => {
    !$isPiPActive ? player.requestPiP().catch(noop) : player.exitPiP().catch(noop);
  };
</script>