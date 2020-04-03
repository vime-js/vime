# DblClickFullscreen

**ID:** `vDblClickFullscreen` | **Type:** [`Plugin`](../../complete/api/plugin.md)

[View Source](../../../vime-player/src/plugins/DblClickFullscreen.svelte)

This plugin adds the ability to double click the player to toggle fullscreen mode.

## Setup

{% tabs %}
{% tab title="Basic" %}
```js
import { Player, DblClickFullscreen } from '@vime-js/player';

// ...

const player = new Player({
  target,
  props: {
    plugins: [DblClickFullscreen]
  }
});
```
{% endtab %}

{% tab title="Manager" %}
```js
import { Player, DblClickFullscreen } from '@vime-js/player';

// ...

player
  .getPluginsManager()
  .addPlugin(DblClickFullscreen)
  .then((dblClickFullscreen) => {
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