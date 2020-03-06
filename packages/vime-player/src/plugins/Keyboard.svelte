<svelte:options accessors />
<svelte:window on:keydown={onKeyDown} />

<script context="module">
  export const ID = 'vKeyboard';
</script>

<script>
  import { ID as TooltipsID } from './tooltips/Tooltips.svelte';
  import { is_array } from '@vime/utils';

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
  const { isPlayerActive } = player.getStore();
  const tooltips = player.getRegistry().watch(TooltipsID);

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  export let enabled = true;

  export const getEvent = id => $registry[id];
  export const getEvents = () => $registry;
  export const getRegistry = () => registry;

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onKeyDown = e => {
    if (!$isPlayerActive || !enabled) return;
  
    const listeners = Object.values($registry)
      .filter(o => (is_array(o.keys) ? o.keys : [o.keys]).includes(e.keyCode));

    if (listeners.length > 0) {
      e.preventDefault();
      listeners.forEach(l => l.action && l.action(e));
    }
  };

  // --------------------------------------------------------------
  // Tooltips Plugin
  // --------------------------------------------------------------

  $: if ($tooltips) {
    Object.keys($registry).forEach(id => {
      const tooltip = $tooltips[id];
      if (tooltip) {
        tooltip.hint = $registry[id].hint;
        tooltip.showHint = enabled;
      }
    });
  }
</script>