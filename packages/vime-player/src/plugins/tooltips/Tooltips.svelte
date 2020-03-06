<svelte:options accessors />

<script context="module">
  export const ID = 'vTooltips';
</script>

<script>
  import { is_instance_of } from '@vime/utils';
  import Tooltip from './Tooltip.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const logger = player.createLogger(ID);

  const validateTooltip = (id, tooltip) => {
    if (!tooltip || !is_instance_of(tooltip, Tooltip)) {
      logger.warn(
        `attempted to register tooltip with \`id\` [${id}] but received invalid ` +
        'value, must be an instance of `Tooltip.svelte`'
      );
      return false;
    }
    tooltip.enabled = enabled;
    return true;
  };

  const registry = player.createRegistry(ID, validateTooltip);
  const { isMobile, isTouch } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  export let autopilot = true;
  export let enabled = true;
  export let showHint = true;

  export const create = () => Tooltip;
  export const getTooltip = id => $registry[id];
  export const getTooltips = () => $registry;
  export const getRegistry = () => registry;

  $: if (autopilot) enabled = !$isMobile && !$isTouch;

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  $: Object.values($registry).forEach(tooltip => { tooltip.enabled = enabled; });
  $: Object.values($registry).forEach(tooltip => { tooltip.showHint = showHint; });
</script>