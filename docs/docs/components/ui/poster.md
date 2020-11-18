---
title: vm-poster
sidebar_label: Poster
---

Loads the poster set in the player prop `currentPoster` and displays it. The poster will automatically
dissapear once playback starts.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/poster/poster.png"
  alt="Vime poster component"
/>

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
    <vm-poster></vm-poster>
  </vm-ui>
</vm-player>
```


</TabItem>

<TabItem value="react">

```tsx {2,10}
import React from 'react';
import { Player, Ui, Poster } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Poster />
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
      <Poster />
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Poster } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Poster,
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
    <Poster />
  </Ui>
</Player>

<script lang="ts">
  import { Player, Ui, Poster } from '@vime/svelte';
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
          <vm-poster />
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
    <vm-poster></vm-poster>
  </vm-ui>
</vm-player>
```


</TabItem>
</Tabs>


## Properties

| Property | Description                                                                                   | Type                                                               | Default   |
| -------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------- |
| `fit`    | How the poster image should be resized to fit the container (sets the `object-fit` property). | `"contain" ∣ "cover" ∣ "fill" ∣ "none" ∣ "scale-down" ∣ undefined` | `'cover'` |


## Events

| Event        | Description                             | Type                |
| ------------ | --------------------------------------- | ------------------- |
| `vmLoaded`   | Emitted when the poster has loaded.     | `CustomEvent<void>` |
| `vmWillHide` | Emitted when the poster will be hidden. | `CustomEvent<void>` |
| `vmWillShow` | Emitted when the poster will be shown.  | `CustomEvent<void>` |


## CSS Custom Properties

| Name                  | Description                                            |
| --------------------- | ------------------------------------------------------ |
| `--vm-poster-z-index` | The position in the UI z-axis stack inside the player. |


## Dependencies

### Used by

 - [vm-default-ui](./default-ui)


