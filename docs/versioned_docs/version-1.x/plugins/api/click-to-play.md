---
title: ClickToPlay
sidebar_label: ClickToPlay
---

**ID:** `vClickToPlay` | **Type:** [`Plugin`](../../complete/api/plugin.md)

This plugin adds the ability to click the player to toggle playback.

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
import { Player, ClickToPlay } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [ClickToPlay],
  },
});
```

</TabItem>

<TabItem value="advanced">

```js
import { Player, ClickToPlay } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugin(ClickToPlay)
  .then(clickToPlay => {
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
