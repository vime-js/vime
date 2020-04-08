# Controls

**ID:** `vControls` | **ROLE:** `CONTROLS` | **Type:** [`Plugin`](../../../complete/api/plugin.md)

[View Source](../../../../vime-complete/src/plugins/controls/Controls.svelte)

This plugin renders and manages [control groups](./control-group.md).

{% hint style="info" %}
This plugin has a [`Registry`](../../../complete/api/registry.md) containing all registered
control groups.

```js
const unsubscribe = player.getRegistry().subscribe(records => {
  const groups = records.vControls;
});

// ...

unsubscribe();
```
{% endhint %}

## Defaults

By default there are no groups/controls, but you can install an additional `DefaultControls` plugin to 
get started with the Vime defaults.

The default controls depend on:

- Whether the player is playing an audio track or video.
- Whether it is a mobile device or not.
- Whether it is a live stream or not.

## Setup

{% tabs %}
{% tab title="Basic" %}
```js
import { Player, Controls, DefaultControls } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [Controls, DefaultControls]
  }
});
```
{% endtab %}

{% tab title="Manager" %}
```js
import { Player, Controls, DefaultControls } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugins([Controls, DefaultControls])
  .then(([controls]) => {
    // ...
  });
```
{% endtab %}
{% endtabs %}

## Usage

### Create Group

```js
import { PlaybackControl, VolumeControl, ScrubberControl } from '@vime-js/complete';

player
  .vControls
  .createGroup('lowerGroup')
  .then(controlGroup => {
    /**
     * $set is part of the Svelte component API, you 
     * can individually set these props as well.
     **/
    controlGroup.$set({
      controls: [PlaybackControl, VolumeControl, ScrubberControl],
      shouldFill: true,
      position: 'flex-end:flex-start'
    });
  });
```

{% hint style="info" %}
See [`ControlGroup`](./control-group.md) for the full API.
{% endhint %}

### Update Group

```js
const controlGroup = player.vControls.getGroup('lowerGroup');
controlGroup.isActive = true;
```

### Delete Group

```js
player
  .vControls
  .removeGroup('lowerGroup')
  .then(() => {
    // ...
  });
```

### Access Group via Event

```js
player.vControls.$on('register', registration => {
  const { id, value: controlGroup } = registration;

  if (id === 'lowerGroup') {
    // ...
  }
});
```

### Access Group via Registry

```js
player.vControls.getRegistry().subscribe(groups => {
  const controlGroup = groups.lowerGroup;

  if (controlGroup) {
    // ...
  }
});
```

## Methods

### `getEl`

**Return Type:** `HTMLElement`

The root HTML element of this plugin.

### `getRegistry`

**Return Type:** [`Registry`](../../../complete/api/registry.md)

The plugin registry where `ControlGroup` instances are registered.

### `getGroups`

**Return Type:** `{ [id]: ControlGroup }`

The rendered `ControlGroup` instances.

### `getGroup`

**Parameters:** `(id: string)` | **Return Type:** `ControlGroup|undefined`

The rendered `ControlGroup` instance for the given `id`.

### `createGroup`

**Parameters:** `(id: string)` | **Return Type:** `Promise<ControlGroup>`

Creates and renders a `ControlGroup` component and returns a `Promise` that will resolve with the 
rendered instance.

### `createGroups`

**Parameters:** `(ids: string[])` | **Return Type:** `Promise<ControlGroup[]>`

Creates and renders a list of `ControlGroup` components and returns all their instances via a `Promise`.

### `removeGroup`

**Parameters:** `(id: string)` | **Return Type:** `Promise<undefined>`

Destroys a `ControlGroup` instance matching the given `id` and returns a `Promise` that will resolve
once it has completed.

### `removeGroups`

**Parameters:** `(ids: string[])` | **Return Type:** `Promise<undefined>`

Destroys multiple `ControlGroup` instances matching the given `ids` and returns a `Promise` that will
resolve once it has completed.

## Events

### Registry

Emits `Registry` [events](../../../complete/api/registry.md#events).
