# ClickToPlay

**ID:** `vClickToPlay` | **Type:** [`Plugin`](../../complete/api/plugin.md)

[View Source](../../../vime-complete/src/plugins/ClickToPlay.svelte)

This plugin adds the ability to click the player to toggle playback.

## Setup

{% tabs %}
{% tab title="Basic" %}
```js
import { Player, ClickToPlay } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [ClickToPlay]
  }
});
```
{% endtab %}

{% tab title="Manager" %}
```js
import { Player, ClickToPlay } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugin(ClickToPlay)
  .then((clickToPlay) => {
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