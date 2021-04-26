---
title: vm-ui
sidebar_label: UI
---

Simple container that holds a collection of user interface components.

The only important role this component really has is, avoiding overlapping custom UI with the
native iOS media player UI. Therefore, custom UI is only displayed on iOS if the `playsinline` prop
is `true`, and the player is not in fullscreen mode.

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

```html {3-5}
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
  </vm-ui>
</vm-player>
```


</TabItem>

<TabItem value="react">

```tsx {2,8}
import React from 'react';
import { Player, Ui } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>{/* ... */}</Ui>
    </Player>
  );
}
```


</TabItem>

<TabItem value="vue">

```html {4-6,11,16} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
    },
  };
</script>
```


</TabItem>

<TabItem value="svelte">

```html {3-5,9} title="example.svelte"
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
  </Ui>
</Player>

<script lang="ts">
  import { Player, Ui } from '@vime/svelte';
</script>
```


</TabItem>

<TabItem value="stencil">

```tsx {6}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>{/* ... */}</vm-ui>
      </vm-player>
    );
  }
}
```


</TabItem>

<TabItem value="angular">

```html {3-5} title="example.html"
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
  </vm-ui>
</vm-player>
```


</TabItem>
</Tabs>


## Slots

| Slot | Description                                   |
| ---- | --------------------------------------------- |
|      | Used to pass in UI components for the player. |


## CSS Custom Properties

| Name              | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `--vm-ui-z-index` | The position in the root z-axis stack inside the player. |


## Dependencies

### Used by

 - [vm-default-ui](./default-ui)


