{#each controls.filter(validateControl) as Control}
  <svelte:component
    {player}
    this={Control.default}
    bind:this={instances[Control.ID]}
  />
{/each}

<script>
  import { is_svelte_component } from '@vime/utils';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let id;
  export let player;

  const registry = player.createRegistry(id);
  const logger = player.createLogger(id);

  const validateControl = Control => {
    if (!Control || !is_svelte_component(Control.default)) {
      const name = Control && (Control.ID || (Control.default && Control.default.name));
      logger.error(`control [${name}] has an invalid \`default\` property, must be a SvelteComponent`);
      return false;
    }
    return true;
  };

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  const instances = {};

  export let controls = [];

  export const getInstances = () => {
    const { undefined: _, ...rest } = instances;
    return rest;
  };

  $: controls
    .filter(validateControl)
    .filter(c => c.ID && !registry.has(c.ID) && instances[c.ID])
    .forEach(c => registry.register(c.ID, instances[c.ID]));
</script>