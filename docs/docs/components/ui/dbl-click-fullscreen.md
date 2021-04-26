---
title: vm-dbl-click-fullscreen
sidebar_label: DblClickFullscreen
---

Enables toggling fullscreen mode by double clicking the player.

<!-- Auto Generated Below -->

## Usage

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
groupId="framework"
defaultValue="html"
values={[
{ label: 'HTML', value: 'html' },
{ label: 'React', value: 'react' },
{ label: 'Vue', value: 'vue' },
{ label: 'Svelte', value: 'svelte' },
{ label: 'Stencil', value: 'stencil' },
{ label: 'Angular', value: 'angular' }
]}>

<TabItem value="html">

```html {5}
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-dbl-click-fullscreen></vm-dbl-click-fullscreen>
  </vm-ui>
</vm-player>
```

</TabItem>

<TabItem value="react">

```tsx {2,10}
import React from 'react';
import { Player, Ui, DblClickFullscreen } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <DblClickFullscreen />
      </Ui>
    </Player>
  );
}
```

</TabItem>

<TabItem value="vue">

```html {6,12,18} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <DblClickFullscreen />
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, DblClickFullscreen } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      DblClickFullscreen,
    },
  };
</script>
```

</TabItem>

<TabItem value="svelte">

```html {5,10} title="example.svelte"
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <DblClickFullscreen />
  </Ui>
</Player>

<script lang="ts">
  import { Player, Ui, DblClickFullscreen } from '@vime/svelte';
</script>
```

</TabItem>

<TabItem value="stencil">

```tsx {8}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-dbl-click-fullscreen />
        </vm-ui>
      </vm-player>
    );
  }
}
```

</TabItem>

<TabItem value="angular">

```html {5} title="example.html"
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-dbl-click-fullscreen></vm-dbl-click-fullscreen>
  </vm-ui>
</vm-player>
```

</TabItem>
</Tabs>

## Properties

| Property      | Description                                                                                            | Type      | Default |
| ------------- | ------------------------------------------------------------------------------------------------------ | --------- | ------- |
| `useOnMobile` | By default this is disabled on mobile to not interfere with playback, set this to `true` to enable it. | `boolean` | `false` |

## CSS Custom Properties

| Name                                | Description                                            |
| ----------------------------------- | ------------------------------------------------------ |
| `--vm-dbl-click-fullscreen-z-index` | The position in the UI z-axis stack inside the player. |

## Dependencies

### Used by

- [vm-default-ui](./default-ui)
