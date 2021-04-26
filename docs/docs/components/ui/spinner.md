---
title: vm-spinner
sidebar_label: Spinner
---

Displays a loading indicator when the video is `buffering`.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/src/components/ui/spinner/spinner.png"
  alt="Vime spinner component"
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
    <vm-spinner></vm-spinner>
  </vm-ui>
</vm-player>
```

</TabItem>

<TabItem value="react">

```tsx {2,10}
import React from 'react';
import { Player, Ui, Spinner } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Spinner />
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
      <Spinner />
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Spinner } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Spinner,
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
    <Spinner />
  </Ui>
</Player>

<script lang="ts">
  import { Player, Ui, Spinner } from '@vime/svelte';
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
          <vm-spinner />
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
    <vm-spinner></vm-spinner>
  </vm-ui>
</vm-player>
```

</TabItem>
</Tabs>

## Properties

| Property               | Description                                                                          | Type      | Default |
| ---------------------- | ------------------------------------------------------------------------------------ | --------- | ------- |
| `showWhenMediaLoading` | Whether the spinner should be active when the player is booting or media is loading. | `boolean` | `false` |

## Events

| Event        | Description                              | Type                |
| ------------ | ---------------------------------------- | ------------------- |
| `vmWillHide` | Emitted when the spinner will be hidden. | `CustomEvent<void>` |
| `vmWillShow` | Emitted when the spinner will be shown.  | `CustomEvent<void>` |

## CSS Custom Properties

| Name                            | Description                                                |
| ------------------------------- | ---------------------------------------------------------- |
| `--vm-spinner-fill-color`       | The color of the progress within the track.                |
| `--vm-spinner-height`           | The height of the spinner.                                 |
| `--vm-spinner-spin-duration`    | How long it takes the spinner to complete a full rotation. |
| `--vm-spinner-spin-timing-func` | The animation timing function to use for the spin.         |
| `--vm-spinner-thickness`        | The thickness of the spinner in px.                        |
| `--vm-spinner-track-color`      | The color of the track the spinner is rotating in.         |
| `--vm-spinner-width`            | The width of the spinner.                                  |
| `--vm-spinner-z-index`          | The position in the UI z-axis stack inside the player.     |

## Dependencies

### Used by

- [vm-default-ui](./default-ui)
