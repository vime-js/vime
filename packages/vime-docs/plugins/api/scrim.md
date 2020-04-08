# Scrim

**ID:** `vScrim` | **Type:** [`Plugin`](../../complete/api/plugin.md)

[View Source](../../../vime-complete/src/plugins/Scrim.svelte)

A scrim is a temporary low opacity black surface for making controls or other content more visible.

## Setup

{% tabs %}
{% tab title="Basic" %}
```js
import { Player, Scrim } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [Scrim]
  }
});
```
{% endtab %}

{% tab title="Manager" %}
```js
import { Player, Scrim } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugin(Scrim)
  .then((scrim) => {
    // ...
  });
```
{% endtab %}
{% endtabs %}

## Props

### `autopilot`

**Type:** `boolean`  | **Default:** `true`

In autopilot mode the plugin will control certain properties automatically. Set this to `false` if you'd like to 
control them yourself. Properties below contain an 'Auto' descriptor if they are part of this system.

### `isEnabled`

**Type:** `boolean`  | **Default:** `true` | **Auto:** `true`

Whether the plugin is enabled or not.

### `isActive`

**Type:** `boolean`  | **Default:** `false` | **Auto:** `true`

Whether the scrim is visible or not.