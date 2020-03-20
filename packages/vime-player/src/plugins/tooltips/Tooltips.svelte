<svelte:options accessors />

<script context="module">
  export const ID = 'vTooltips';
</script>

<script>
  import { is_instance_of } from '@vime-js/utils';
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
    tooltip.isEnabled = isEnabled;
    return true;
  };

  const registry = player.createRegistry(ID, validateTooltip);
  
  const { 
    isMobile, isTouch, isControlsEnabled,
    useNativeControls
  } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  export let autopilot = true;
  export let showHints = true;
  export let isEnabled = true;

  export const getRegistry = () => registry;
  export const getTooltipComponent = () => Tooltip;

  $: if (autopilot) isEnabled = !$isMobile && !$isTouch && $isControlsEnabled && !$useNativeControls;

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  $: Object.values($registry).forEach(tooltip => { tooltip.isEnabled = isEnabled; });
  $: Object.values($registry).forEach(tooltip => { tooltip.showHint = showHints; });
</script>