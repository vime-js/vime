---
title: ActionDisplay
sidebar_label: ActionDisplay
---

**ID:** `vActionDisplay` | **Type:** [`Plugin`](../../complete/api/plugin.md)

This plugin displays an icon and/or value in the middle of the player to visualize an
action being performed, which fades out after a set amount of time.

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
import { Player, ActionDisplay } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [ActionDisplay],
  },
});
```

</TabItem>

<TabItem value="advanced">

```js
import { Player, ActionDisplay } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugin(ActionDisplay)
  .then(actionDisplay => {
    // ...
  });
```

</TabItem>

</Tabs>

## Props

### `autopilot`

**Type:** `boolean` | **Default:** `true`

In autopilot mode the plugin will control certain properties automatically. Set this to `false` if you'd like to
control them yourself. Properties below contain an 'Auto' descriptor if they are part of this system.

### `isEnabled`

**Type:** `boolean` | **Default:** `true` | **Auto:** `true`

Whether the plugin is enabled or not.

## Methods

### `run`

**Parameters:** `(icon: string, value: string|undefined)`

Clears the currently visible icon and value to show the new pair. After a set amount of time
they will automatically fade out.
