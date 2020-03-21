<svelte:options accessors />
<svelte:window on:keydown={onKeyDown} />

<script context="module">
  export const ID = 'vKeyboard';
</script>

<script>
  import { is_array } from '@vime-js/utils';
  import { ID as TooltipsID } from '../tooltips/Tooltips.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const logger = player.createLogger(ID);

  const validateEvent = (id, event) => {
    if (!event || !event.keys) {
      logger.warn(`event with \`id\` [${id}] is missing a \`keys\` prop`);
      return false;
    }
    return true;
  };

  const registry = player.createRegistry(ID, validateEvent);
  const plugins = player.getPluginsRegistry();
  const { isPlayerActive, useNativeControls } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  export let autopilot = true;
  export let isEnabled = false;

  export const getRegistry = () => registry;
  
  $: if (autopilot) isEnabled = !$useNativeControls;

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onKeyDown = (e) => {
    if (!$isPlayerActive || !isEnabled) return;
  
    const listeners = Object.values($registry)
      .filter((o) => (is_array(o.keys) ? o.keys : [o.keys]).includes(e.keyCode));

    if (listeners.length > 0) {
      e.preventDefault();
      listeners.forEach((l) => l.action && l.action(e));
    }
  };

  // --------------------------------------------------------------
  // Tooltips Plugin
  // --------------------------------------------------------------

  $: tooltips = $plugins[TooltipsID];
  $: tooltipsRegistry = tooltips && tooltips.getRegistry();

  $: if ($tooltipsRegistry) {
    Object.keys($registry).forEach((id) => {
      const tooltip = $tooltipsRegistry[id];
      if (tooltip) {
        tooltip.hint = $registry[id].hint;
        tooltip.showHint = isEnabled;
      }
    });
  }
</script>