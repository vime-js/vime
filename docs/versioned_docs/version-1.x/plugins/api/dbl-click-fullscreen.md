---
title: DblClickFullscreen
sidebar_label: DblClickFullscreen
---

**ID:** `vDblClickFullscreen` | **Type:** [`Plugin`](../../complete/api/plugin.md)

This plugin adds the ability to double click the player to toggle fullscreen mode.

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
import { Player, DblClickFullscreen } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [DblClickFullscreen],
  },
});
```

</TabItem>

<TabItem value="advanced">

```js
import { Player, DblClickFullscreen } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugin(DblClickFullscreen)
  .then(dblClickFullscreen => {
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
