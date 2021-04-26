---
title: Poster
sidebar_label: Poster
---

**ID:** `vPoster` | **ROLE:** `POSTER` | **Type:** [`Plugin`](../../complete/api/plugin.md)

This plugin is responsible for loading and showing the poster set in the `currentPoster` prop.

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
import { Player, Poster } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [Poster],
  },
});
```

</TabItem>

<TabItem value="advanced">

```js
import { Player, Poster } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugin(Poster)
  .then(poster => {
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

Whether the poster is visible or not.

## Methods

### `getEl`

**Return Type:** `ImgElement`

The root `img` element that loads the poster.
