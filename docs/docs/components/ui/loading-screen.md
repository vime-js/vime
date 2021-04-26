---
title: vm-loading-screen
sidebar_label: LoadingScreen
---

The view that is displayed while the player is booting or media is loading. By default there
are animated dots that are shown below the `<slot />` to indicate to the user content is being
loaded. The default `<slot />` is your opportunity to brand the player with your logo.

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

```html {5-7}
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-loading-screen>
      <!-- Pass in content here such as a logo (optional). -->
    </vm-loading-screen>
  </vm-ui>
</vm-player>
```


</TabItem>

<TabItem value="react">

```tsx {2,10-12}
import React from 'react';
import { Player, Ui, LoadingScreen } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <LoadingScreen>
          {/* Pass in content here such as a logo (optional). */}
        </LoadingScreen>
      </Ui>
    </Player>
  );
}
```


</TabItem>

<TabItem value="vue">

```html {6-8,14,20} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <LoadingScreen>
        <!-- Pass in content here such as a logo (optional). -->
      </LoadingScreen>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, LoadingScreen } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      LoadingScreen,
    },
  };
</script>
```


</TabItem>

<TabItem value="svelte">

```html {5-7,12} title="example.svelte"
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <LoadingScreen>
      <!-- Pass in content here such as a logo (optional). -->
    </LoadingScreen>
  </Ui>
</Player>

<script lang="ts">
  import { Player, Ui, LoadingScreen } from '@vime/svelte';
</script>
```


</TabItem>

<TabItem value="stencil">

```tsx {8-10}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-loading-screen>
            {/* Pass in content here such as a logo (optional). */}
          </vm-loading-screen>
        </vm-ui>
      </vm-player>
    );
  }
}
```


</TabItem>

<TabItem value="angular">

```html {5-7} title="example.html"
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-loading-screen>
      <!-- Pass in content here such as a logo (optional). -->
    </vm-loading-screen>
  </vm-ui>
</vm-player>
```


</TabItem>
</Tabs>


## Properties

| Property   | Description                                 | Type      | Default |
| ---------- | ------------------------------------------- | --------- | ------- |
| `hideDots` | Whether the loading dots are hidden or not. | `boolean` | `false` |


## Slots

| Slot | Description                                                                                                                                                                                                                        |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|      | Used to pass in any content to be shown above the animated dots while the player is booting or media is loading. Use this as an opportunity to brand your player, similar to how Netflix shows their logo when content is loading. |


## CSS Custom Properties

| Name                                 | Description                                              |
| ------------------------------------ | -------------------------------------------------------- |
| `--vm-loading-screen-dot-color`      | The color of the animated loading dot.                   |
| `--vm-loading-screen-dot-size`       | The size (wxh) of the dot in pixels.                     |
| `--vm-loading-screen-pulse-duration` | The length of the pulse animation to complete one cycle. |
| `--vm-loading-screen-z-index`        | The position in the UI z-axis stack inside the player.   |


## Dependencies

### Used by

 - [vm-default-ui](./default-ui)


