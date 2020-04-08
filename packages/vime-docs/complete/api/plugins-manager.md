# PluginsManager

**ID:** `vPlugin` | **Type:** `Component`

[View Source](../../../vime-complete/src/core/PluginsManager.svelte)

The `PluginsManager` is responsible for validating, adding, removing, rendering and registering 
[plugins](./plugin.md).

## Methods

### `hasPlugin`

**Parameters:** `(plugin: Plugin)` | **Return Type:** `boolean`

Whether there is a plugin with a matching `ID`.

### `addPlugin`

**Parameters:** `(plugin: Plugin)` | **Return Type:** `Promise<Component>`

Adds a new plugin to be validated, rendered and registered. This method returns a `Promise` that 
resolves with the rendered instance.

### `addPlugins`

**Parameters:** `(plugins: Plugin[])` | **Return Type:** `Promise<Component[]>`

Adds a list of plugins, each plugin is passed to [`addPlugin`](#addplugin). This method returns a `Promise` that
resolves with all the rendered instances.

### `removePlugin`

**Parameters:** `(plugin: Plugin)` | **Return Type:** `Promise<undefined>`

Unmounts and deregisters the given plugin. This method returns a `Promise` that resolves once the operation
has completed.

### `removePlugins`

**Parameters:** `(plugins: Plugin[])` | **Return Type:** `Promise<undefined>`

Removes a list of plugins, each plugin is passed to [`removePlugin`](#removeplugin). This method returns a `Promise` 
that resolves once the operation has completed.

### `getPlugins`

**Return Type:** `Component[]`

All rendered plugin instances.

### `getPlugin`

**Parameters:** `(id: string)` | **Return Type:** `Component|undefined`

The rendered plugin instance for the given `id`.

### `getRegistry(): Registry`

**Return Type:** [`Registry`](./registry.md)

The managers registry where all plugin instances are registered.

## Events

### Registry

Emits `Registry` [events](./registry.md#events).
