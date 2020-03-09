<svelte:options accessors />
<svelte:window on:keydown={onWindowKeyDown} />

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
      on:click={onToggle}
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
  import { Icon } from '@vime/core';
  import Control from '../Control.svelte';
  import PluginRole from '../../../core/PluginRole';
  import { ID as SettingsID } from '../../settings/Settings.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const { i18n, icons, isLive, plugins } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let control;
  let hasSettingsPlugin = false;

  export let id = null;
  export let menuId = null;
  export let autopilot = true;
  export let isActive = false;
  export let isEnabled = false;

  export const getControl = () => control;
  
  $: if (autopilot) hasSettingsPlugin = $plugins.some(p => p.ROLE === PluginRole.SETTINGS);
  $: if (autopilot) isEnabled = hasSettingsPlugin && !$isLive;

  // --------------------------------------------------------------
  // Settings Plugin
  // --------------------------------------------------------------

  const settingsPlugin = player.getPluginsRegistry().watch(SettingsID);

  let onToggle;
  let isSettingsActive;

  const _onToggle = e => {
    e.stopPropagation();
    $isSettingsActive = !$isSettingsActive;
  };

  const onWindowKeyDown = async e => {
    if (e.keyCode !== 13 || !$settingsPlugin) return;
    _onToggle()
    // Wait for dom updates so menu is ready.
    await tick();
    $settingsPlugin.getMenu().setFocusToItem(0);
  }

  $: if (autopilot && $settingsPlugin) {
    ({ isMenuActive: isSettingsActive } = $settingsPlugin.getStore());
  }

  $: if (autopilot) onToggle = (hasSettingsPlugin && $settingsPlugin) ? _onToggle : null;
  $: if (autopilot) id = $settingsPlugin ? $settingsPlugin.getLabelledBy() : null;
  $: if (autopilot) menuId = $settingsPlugin ? $settingsPlugin.getId() : null;
  $: if (autopilot) isActive = !!$isSettingsActive
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