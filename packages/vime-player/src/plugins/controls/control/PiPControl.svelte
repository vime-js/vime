<ToggleControl
  {player}
  custom
  label={LABEL}
  active={$pipActive}
  enabled={$canSetPiP}
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

  const { icons, i18n, pipActive, canSetPiP } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let toggle;

  export const getToggle = () => toggle;

  const onToggle = () => $pipActive 
    ? player.requestPiP().catch(noop) 
    : player.exitPiP().catch(noop)
</script>