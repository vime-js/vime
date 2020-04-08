<svelte:options accessors />

{#if isEnabled}
  <div>
    <Control
      {id}
      {player}
      label={LABEL}
      title={!isActive ? $i18n.settings : null}
      aria-haspopup
      aria-controls={menuId}
      aria-expanded={isActive}
      aria-label={$i18n.settings}
      on:click
      on:keydown
      on:focuschange
      on:click={onToggle}
      on:keydown={onKeyDown}
      bind:this={control}
    >
      <Icon icon={$icons.settings} />
    </Control>
  </div>
{/if}

<script context="module">
  export const ID = 'vSettingsControl';
  export const LABEL = 'toggleSettings';
</script>

<script>
  import { tick } from 'svelte';
  import Control from './Control.svelte';
  import { ID as SettingsID } from '../../settings/Settings.svelte';
  import Icon from '../../../core/Icon.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const plugins = player.getPluginsRegistry();
  
  const {
    i18n, icons, isLive,
    hasSettings,
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let control;

  export let id = null;
  export let menuId = null;
  export let isActive = false;
  export let isEnabled = true;

  export const getControl = () => control;
  
  $: isEnabled = $hasSettings && !$isLive;

  // --------------------------------------------------------------
  // Settings Plugin
  // --------------------------------------------------------------

  let isMenuActive;

  const onToggle = (e) => {
    if (!settings) return;
    e.preventDefault();
    e.stopPropagation();
    $isMenuActive = !$isMenuActive;
  };

  const onKeyDown = async (e) => {
    if (e.keyCode !== 13 || !settings) return;
    onToggle(e);
    // Wait for dom updates so menu is ready.
    await tick();
    settings.getMenu().focus();
  };

  $: settings = $plugins[SettingsID];

  $: if (settings) id = settings.getControllerId();
  $: if (settings) menuId = settings.getId();
  $: if (settings) isActive = $isMenuActive;
  $: if (settings) { ({ isMenuActive } = settings.getStore()); }
</script>

<style type="text/scss">
  div {
    :global(.control > svg) {
      transition: transform 0.3s ease;
    }

    :global(> .control[aria-expanded='true'] > svg) {
      transform: rotate(90deg);
    }
  }
</style>