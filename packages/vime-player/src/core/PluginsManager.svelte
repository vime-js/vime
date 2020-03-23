{#each validatedPlugins as Plugin (Plugin.ID)}
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
  import { tick, onMount } from 'svelte';
  import { IS_IOS, is_svelte_component } from '@vime-js/utils';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const registry = player.createRegistry(ID);
  const logger = player.createLogger(ID);
  const { plugins, playsinline, isFullscreenActive } = player.getStore();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  const instances = {};
  let validatedPlugins = [];

  export const hasPlugin = (plugin) => plugin.ID && $plugins.some((p) => p.ID === plugin.ID);

  export const addPlugin = async (newPlugin) => {
    if (hasPlugin(newPlugin)) return Promise.resolve(instances[newPlugin.ID]);
    $plugins[$plugins.length] = newPlugin;
    await tick();
    return instances[newPlugin.ID];
  };

  export const addPlugins = (newPlugins) => {
    const promises = newPlugins.map(addPlugin);
    return Promise.all(promises);
  };

  export const removePlugin = (id) => {
    $plugins = $plugins.filter((p) => p.ID !== id);
    return tick();
  };

  export const removePlugins = (delPlugins) => {
    delPlugins.map(removePlugin);
    return tick();
  };

  export const getRegistry = () => registry;
  export const getPlugin = (id) => instances[id];
  export const getPlugins = () => instances;

  $: isEnabled = (IS_IOS && $playsinline && !$isFullscreenActive) || !IS_IOS;

  // --------------------------------------------------------------
  // Plugin Registration
  // --------------------------------------------------------------

  const validatePlugin = (Plugin) => {
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

  $: if (mounted) {
    validatedPlugins = isEnabled ? $plugins.filter(validatePlugin).map((p) => ({ ...p })) : [];
  }

  $: validatedPlugins
    .filter((p) => !registry.has(p.ID) && instances[p.ID])
    .forEach((p) => registry.register(p.ID, instances[p.ID]));
</script>