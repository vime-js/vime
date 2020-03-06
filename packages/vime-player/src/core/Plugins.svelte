{#each validatedPlugins.filter(() => !nativeMode) as Plugin (Plugin.ID)}
  <svelte:component
    {player}
    this={Plugin.default}
    bind:this={instances[Plugin.ID]}
    on:error
  />
{/each}

<script context="module">
  export const ID = 'vPlugins';
</script>

<script>
  import { onMount } from 'svelte';
  import { is_svelte_component } from '@vime/utils';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const registry = player.createRegistry(ID);
  const logger = player.createLogger(ID);

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------
  
  let instances = {};
  let validatedPlugins = [];

  export let plugins = [];
  export let nativeMode = false;
  
  export const hasPlugin = plugin => plugin.ID && plugins.some(p => p.ID === plugin.ID);
  export const addPlugin = plugin => { if (!hasPlugin(plugin)) plugins[plugins.length] = plugin; };
  export const addPlugins = plugins => { plugins && plugins.map(addPlugin); };
  export const removePlugin = id => { plugins = plugins.filter(p => p.ID !== id); };
  export const removePlugins = plugins => { plugins && plugins.map(removePlugin); };

  export const getRegistry = () => registry;
  export const getInstances = () => instances;
  export const getPlugins = () => validatedPlugins;

  // --------------------------------------------------------------
  // Plugin Registration
  // --------------------------------------------------------------

  const validatePlugin = Plugin => {
    const name = Plugin && (Plugin.ID || (Plugin.default && Plugin.default.name));
    if (!Plugin || !Plugin.ID) {
      logger.error(`plugin [${name}] is missing an \`ID\` property`);
      return false;
    }
    if (!Plugin.default || !is_svelte_component(Plugin.default)) {
      logger.error(`plugin [${name}] has an invalid \`default\` property, must be a SvelteComponent`);
      return false;
    }
    return true;
  };

  // Wait till component has mounted so plugins have access to it through Vime.
  let mounted = false;
  onMount(() => { mounted = true; });

  $: if (mounted) validatedPlugins = plugins.filter(validatePlugin).map(p => ({ ...p }));

  $: validatedPlugins
    .filter(p => !registry.has(p.ID) && instances[p.ID])
    .forEach(p => registry.register(p.ID, instances[p.ID]));
</script>