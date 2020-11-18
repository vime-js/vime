---
title: Tooltips
sidebar_label: Tooltips
---

**ID:** `vTooltips` | **Type:** [`Plugin`](../../../complete/api/plugin.md)

This plugin manages [tooltips](./tooltip.md).

:::info
This plugin has a [`Registry`](../../../complete/api/registry.md) containing all registered
tooltips.

```js
const unsubscribe = player.getRegistry().subscribe(records => {
  const tooltips = records.vTooltips;
});

// ...

unsubscribe();
```
:::

## Setup

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
  groupId="plugins"
  defaultValue="basic"
  values={[
  { label: 'Basic', value: 'basic' },
  { label: 'Manager', value: 'advanced' },
]}>

<TabItem value="basic">

```js
import { Player, Tooltips } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [Tooltips]
  }
});
```

</TabItem>

<TabItem value="advanced">

```js
import { Player, Tooltips } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugin(Tooltips)
  .then((tooltips) => {
    // ...
  });
```

</TabItem>

</Tabs>

## Usage

### Create Tooltip

```js
// The target must be inside the element we want to add a tooltip for.
const target = document.getElementById('tooltip-target');
const tooltip = player.vTooltips.createTooltip('myTooltip', target);
tooltip.title = 'Content inside tooltip';
```

:::info
See [`Tooltip`](./tooltip.md) for the full API.
:::

### Update Tooltip

```js
const tooltip = player.vTooltips.getTooltip('myTooltip');
tooltip.showHint = false;
```

### Remove Tooltip

```js
player.vTooltips.removeTooltip('myTooltip');
```

### Access Tooltip via Event

```js
player.vTooltips.$on('register', registration => {
  const { id, value: tooltip } = registration;

  if (id === 'myTooltip') {
    // ...
  }
});
```

### Access Tooltip via Registry

```js
player.vTooltips.getRegistry().subscribe(tooltips => {
  const tooltip = tooltips.myTooltip;

  if (tooltip) {
    // ...
  }
});
```

## Props

### `autopilot`

**Type:** `boolean`  | **Default:** `true`

In autopilot mode the plugin will control certain properties automatically. Set this to `false` if you'd like to 
control them yourself. Properties below contain an 'Auto' descriptor if they are part of this system.

### `isEnabled`

**Type:** `boolean`  | **Default:** `true` | **Auto:** `true`

Whether to render all tooltips in the DOM or not.

### `showHints`

**Type:** `boolean`  | **Default:** `true`

Whether to show or hide [`hint`](./tooltip.md#hint) texts on all registered tooltips.

## Methods

### `getRegistry`

**Return Type:** [`Registry`](../../../complete/api/registry.md)

The plugin registry where [`Tooltip`](./tooltip.md) instances are registered.

### `getTooltips`

**Return Type:** `Tooltip[]`

All registered [`Tooltip`](./tooltip.md) instances.

### `getTooltip`

**Parameters:** `(id: string)` | **Return Type:** `Tooltip|undefined`

The [`Tooltip`](./tooltip.md) instance for the given `id`.

### `createTooltip`

**Parameters:** `(id: string, target: HTMLElement)` | **Return Type:** `Tooltip`

Creates a [`Tooltip`](./tooltip.md) instance, mounts it on the given `target`, registers it under the given `id` and
returns the instance.

### `removeTooltip`

**Parameters:** `(id: string)`

Destroys the [`Tooltip`](./tooltip.md) instance associated with the given `id` and deregisters it.

### `getTooltipComponent`

**Return Type:** `TooltipConstructor`

The [`Tooltip`](./tooltip.md) component constructor.