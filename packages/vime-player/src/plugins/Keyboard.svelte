<svelte:options accessors />
<svelte:window on:keydown={onKeyDown} />

<script context="module">
  export const ID = 'vKeyboard';
</script>

<script>
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { is_array } from '~utils/unit';
  import { ID as TooltipsID } from '~plugins/tooltips/Tooltips.svelte';
  
  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const dispatch = createEventDispatcher();
  const registry = player.createRegistry(ID);
  const logger = player.createLogger(ID);
  const plugins = player.getPluginsRegistry();
  const { isCurrentPlayer } = player.getStore();

  const validateEvent = (id, event) => {
    if (!event || !event.keys) {
      logger.warn(`event with \`id\` [${id}] is missing a \`keys\` prop`);
      return false;
    }
    return true;
  };

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  export let isEnabled = true;

  export const getEvent = id => $registry[id];
  export const getEvents = () => $registry;
  export const update = (id, event) => { registry.update(id, { ...$registry[id], ...event }); };
  export const deregister = id => { registry.deregister(id); };

  export const register = (id, event) => {
    if (!validateEvent(id, event)) return;
    registry.register(id, event);
  };

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onKeyDown = e => {
    if (!$isCurrentPlayer || !isEnabled) return;
  
    const listeners = Object.values($registry)
      .filter(o => (is_array(o.keys) ? o.keys : [o.keys]).includes(e.keyCode));
  
    if (listeners.length > 0) {
      e.preventDefault();
      listeners.forEach(l => {
        l.action && l.action(e);
        dispatch(l.id, l);
      });
    }
  };

  $: dispatch('isenabled', isEnabled);

  // --------------------------------------------------------------
  // Tooltips Plugin
  // --------------------------------------------------------------

  $: tooltips = $plugins[TooltipsID];

  $: if (tooltips) {
    Object.keys($registry).forEach(id => {
      const tooltip = tooltips.getTooltip(id);
      if (tooltip) {
        tooltip.hint = $registry[id].hint;
        tooltip.showHint = isEnabled;
      }
    });
  }
</script>