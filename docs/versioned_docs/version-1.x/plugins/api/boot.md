---
title: Boot
sidebar_label: Boot
---

**ID:** `vBoot` | **Type:** [`Plugin`](../../complete/api/plugin.md)

This plugin installs the following plugins:

- [Icons](icons.md)
- [Poster](poster.md)
- [Scrim](scrim.md)
- [Spinner](spinner.md)
- [Captions](captions.md)
- [Controls](controls/controls.md)
- [Settings](settings/settings.md)
- [ActionDisplay](action-display.md)
- [Tooltips](tooltips/tooltips.md)
- [Keyboard](keyboard/keyboard.md)
- [ClickToPlay](click-to-play.md)
- [DblClickFullscreen](dbl-click-fullscreen.md)

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
import { Player, Boot } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [Boot]
  }
});
```

</TabItem>

<TabItem value="advanced">

```js
import { Player, Boot } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugin(Boot)
  .then((boot) => {
    // ...
  });
```

</TabItem>

</Tabs>

## Props

### `manifest`

**Type:** `{ [id]: boolean }` | **Default:** All plugins default to `true`.

The manifest determines which plugins should be installed. All plugins are identified by
their `ID` with the `v` prefix removed and first letter lowercased.

- `vControls` = `controls`
- `vActionDisplay` = `actionDisplay`
- `vClickToPlay` = `clickToPlay`

<Tabs
  groupId="framework"
  defaultValue="js"
  values={[
  { label: 'JavaScript', value: 'js' },
  { label: 'Svelte', value: 'svelte' },
]}>

<TabItem value="js">

```js
import { Player, Boot } from '@vime-js/complete';

const target = document.getElementById('player-target');

const player = new Player({
  target,
  props: {
    plugins: [Boot]
  }
});

const off = player.$on('mount', () => {
  player.vBoot.manifest = {
    controls: false,
    actionDisplay: false,
    clickToPlay: false
  };
});
```

</TabItem>

<TabItem value="svelte">

```html
<Player
  plugins={[Boot]}
  on:mount={onPlayerMount}
  bind:this={player} 
/>

<script>
  import { Player, Boot } from '@vime-js/complete';

  let player;

  const onPlayerMount = () => {
    player.vBoot.manifest = {
      controls: false,
      actionDisplay: false,
      clickToPlay: false
    };
  };
</script>
```

</TabItem>

</Tabs>