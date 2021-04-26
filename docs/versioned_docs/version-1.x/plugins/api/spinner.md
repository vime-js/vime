---
title: Spinner
sidebar_label: Spinner
---

**ID:** `vSpinner` | **Type:** [`Plugin`](../../complete/api/plugin.md)

A spinner is a loading indicator to notify the user that some task is preventing playback.

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
import { Player, Spinner } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [Spinner],
  },
});
```

</TabItem>

<TabItem value="advanced">

```js
import { Player, Spinner } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugin(Spinner)
  .then(spinner => {
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

### `isActive`

**Type:** `boolean` | **Default:** `false` | **Auto:** `true`

Whether the spinner is visible or not.
