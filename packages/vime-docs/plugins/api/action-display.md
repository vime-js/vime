# ActionDisplay

**ID:** `vActionDisplay` | **Type:** [`Plugin`](../../complete/api/plugin.md)

[View Source](../../../vime-complete/src/plugins/ActionDisplay.svelte)

This plugin displays an icon and/or value in the middle of the player to visualize an 
action being performed, which fades out after a set amount of time.

## Setup

{% tabs %}
{% tab title="Basic" %}
```js
import { Player, ActionDisplay } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [ActionDisplay]
  }
});
```
{% endtab %}

{% tab title="Manager" %}
```js
import { Player, ActionDisplay } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugin(ActionDisplay)
  .then((actionDisplay) => {
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

## Methods

### `run`

**Parameters:** `(icon: string, value: string|undefined)`

Clears the currently visible icon and value to show the new pair. After a set amount of time
they will automatically fade out.

