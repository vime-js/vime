# Poster

**ID:** `vPoster` | **ROLE:** `POSTER` | **Type:** [`Plugin`](../../complete/api/plugin.md)

[View Source](../../../vime-player/src/plugins/Poster.svelte)

This plugin is responsible for loading and showing the poster set in the `currentPoster` prop.

## Setup

{% tabs %}
{% tab title="Basic" %}
```js
import { Player, Poster } from '@vime-js/player';

// ...

const player = new Player({
  target,
  props: {
    plugins: [Poster]
  }
});
```
{% endtab %}

{% tab title="Manager" %}
```js
import { Player, Poster } from '@vime-js/player';

// ...

player
  .getPluginsManager()
  .addPlugin(Poster)
  .then((poster) => {
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

Whether the poster is visible or not.

## Methods

### `getEl`

**Return Type:** `ImgElement`

The root `img` element that loads the poster.

