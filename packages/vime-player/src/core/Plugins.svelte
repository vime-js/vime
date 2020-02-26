{#each _plugins.filter(p => !nativeMode) as Plugin (Plugin.ID)}
  <svelte:component
    {player}
    config={buildConfig(Plugin, config)}
    this={Plugin.default}
    bind:this={instances[Plugin.ID]}
    on:error
  />
{/each}

<script context="module">
  import { merge_deep } from '~utils/object';

  export const ID = 'vPlugins';

  export const buildConfig = (Plugin, config) => {
    return merge_deep(config[Plugin.ID], Plugin.DEFAULT_CONFIG || {});
  };
</script>

<script>
  import { onMount } from 'svelte';
  import { is_svelte_component } from '~utils/unit';
  import PluginRole from '../PluginRole';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const registry = player.createRegistry(ID);
  const logger = player.createLogger(ID);

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------
  
  const instances = {};

  let _plugins = [];

  export let plugins = [];
  export let nativeMode = false;
  export let config = {};

  export const addPlugin = plugin => { plugins[plugins.length] = plugin; };
  export const addPlugins = plugins => { plugins && plugins.map(addPlugin); };
  export const removePlugin = id => { plugins = plugins.filter(p => p.ID !== id); };
  export const removePlugins = plugins => { plugins && plugins.map(removePlugin); };

  export const getPlugins = () => _plugins;
  export const getRegistry = () => registry;
  export const getInstances = () => instances;

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
  let hasMounted = false;
  onMount(() => { hasMounted = true; });

  $: if (hasMounted) {
    _plugins = plugins
      .filter(validatePlugin)
      .filter(p => p.ROLE !== PluginRole.PROVIDER)
      .map(p => ({ ...p }));
  }

  $: _plugins
    .filter(p => !registry.has(p.ID) && instances[p.ID])
    .forEach(p => registry.register(p.ID, instances[p.ID]));
</script>