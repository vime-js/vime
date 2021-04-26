---
title: How it Works
sidebar_label: Hot it Works
---

This is section dives deeper into how the plugin system works, this is mostly useful if you want to
build your own plugins or controls.

:::caution
This document is still a work in progress.
:::

## Lifecycle

Plugins are Svelte components that implement the [plugin interface](../complete/api/plugin.md) and
add some functionality/feature to the player. They are managed by the [`PluginsManager`](../complete/api/plugins-manager.md)
whose responsible for validating, adding, removing, rendering and registering them. It can be accessed through the player
by calling `player.getPluginsManager()`.

### Create

1. Validate the plugin to make sure it implements the plugin interface.
2. Mount the plugin on the DOM using [`svelte:component`][svelte-component].
3. The rendered instance is registered with the managers `Registry` (more on this later).
4. The `Registry` dispatches an event to the root so the player can attach the plugin to itself.

### Destroy

5. When it's time (player/plugin is being destroyed) the plugin is unmounted from the DOM.
6. The managers `Registry` is notified via a callback that the component has been destroyed and deregisters it.
7. Finally, the `Registry` dispatches an event to the root so the player can deattach the plugin.

[svelte-component]: https://svelte.dev/docs#svelte_component

## Registry

Plugins and their child values are registered using a [`Registry`](../complete/api/registry.md). A registry
is essentially a container who holds unique id references to values. Majority of time, these values are
rendered plugin instances (the result of mounting a Svelte component to the DOM), or other registries (known as subregistries).

### Problem

The problem that the registry solves is, how do we access and communicate between semi-unrelated
component trees that are dynamically rendered and removed. Basically, if we create a plugin called
`MySuperDuperPlugin`, then how does `OtherSuperDuperPlugin` listen for when it becomes
available and get a reference to it.

### Solution

The [registry pattern][wiki-registry-pattern] is the approach used in Vime to solve the mentioned problem.

All you need to know is:

- In Vime, there is a global object called a registry in which all shared values are stored.
- These objects can be nested in one another to create subregistries.
- Subregistries are created by plugins.
- You access subregistries through the root registry, stored under their respective plugin `ID`.
- The only "special" subregistry is the `vPlugins` registry which holds all plugin instances.
- You can access the root registry by calling `player.getRegistry()`.
- You can access the plugins subregistry by calling `player.getPluginsRegistry()`.

[wiki-registry-pattern]: https://wiki.c2.com/?RegistryPattern

### Flow

1. The `Player` creates a root `Registry` on initialization.
2. Once the player has mounted, the `PluginsManager` is mounted and creates a subregistry (the `vPlugins` registry).
3. The `PluginsManger` renders plugins and registers their instances in its subregistry.
4. Finally, each plugin may decide to create its own subregistry to register child components or anything else.
