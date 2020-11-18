---
title: Plugin
sidebar_label: Plugin
---

**Type:** `interface`

## Props

### `ID`

A `string` used to identify the plugin.

### `ROLE`

An optional [PluginRole](./plugin-role.md).

### `default`

A Svelte component that accepts a `player` prop.

## Example

This is a Svelte component that compiles into a valid Plugin.

```html
<div></div>

<script context="module">
  import { PluginRole } from '@vime-js/complete';

  export const ID = 'myPluginId';

  // Optional.
  export const ROLE = PluginRole.POSTER;
</script>

<script>
  export let player;

  // ...
</script>
```