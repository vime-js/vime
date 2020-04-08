# Spinner

**ID:** `vSpinner` | **Type:** [`Plugin`](../../complete/api/plugin.md)

[View Source](../../../vime-complete/src/plugins/Spinner.svelte)

A spinner is a loading indicator to notify the user that some task is preventing playback.

## Setup

{% tabs %}
{% tab title="Basic" %}
```js
import { Player, Spinner } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [Spinner]
  }
});
```
{% endtab %}

{% tab title="Manager" %}
```js
import { Player, Spinner } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugin(Spinner)
  .then((spinner) => {
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

Whether the spinner is visible or not.