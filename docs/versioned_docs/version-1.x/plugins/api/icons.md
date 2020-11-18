---
title: Icons
sidebar_label: Icons
---

**ID:** `vIcons` | **Type:** [`Plugin`](../../complete/api/plugin.md)

This plugin loads the default Vime icons into the browser.

## Defaults

- play
- pause
- captionsOn
- captionsOff
- enterFullscreen
- exitFullscreen
- enterPiP
- exitPiP
- seekForward
- seekBackward
- volumeLow
- volumeHigh
- volumeMute
- settings
- checkmark

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
import { Player, Icons } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [Icons]
  }
});
```

</TabItem>

<TabItem value="advanced">

```js
import { Player, Icons } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugin(Icons)
  .then((icons) => {
    // ...
  });
```

</TabItem>

</Tabs>
