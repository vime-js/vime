---
title: vm-scrim
sidebar_label: Scrim
---

A darkened overlay or gradient that covers the current video to enable controls placed on it to be
more visible.

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
    <vm-scrim></vm-scrim>
  </vm-ui>
</vm-player>
```

</TabItem>

<TabItem value="react">

```tsx {2,10}
import React from 'react';
import { Player, Ui, Scrim } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Scrim />
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
      <Scrim />
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Scrim } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Scrim,
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
    <Scrim />
  </Ui>
</Player>

<script lang="ts">
  import { Player, Ui, Scrim } from '@vime/svelte';
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
          <vm-scrim />
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
    <vm-scrim></vm-scrim>
  </vm-ui>
</vm-player>
```

</TabItem>
</Tabs>

## Properties

| Property   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Type                        | Default     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- | ----------- |
| `gradient` | If this prop is defined, a dark gradient that smoothly fades out without being noticed will be used instead of a set color. This prop also sets the direction in which the dark end of the gradient should start. If the direction is set to `up`, the dark end of the gradient will start at the bottom of the player and fade out to the center. If the direction is set to `down`, the gradient will start at the top of the player and fade out to the center. | `"down" ∣ "up" ∣ undefined` | `undefined` |

## CSS Custom Properties

| Name                 | Description                                            |
| -------------------- | ------------------------------------------------------ |
| `--vm-scrim-bg`      | The background color of the scrim.                     |
| `--vm-scrim-z-index` | The position in the UI z-axis stack inside the player. |

## Dependencies

### Used by

- [vm-default-controls](./controls/default-controls)
