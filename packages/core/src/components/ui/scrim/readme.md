# vime-scrim

A darkened overlay or gradient that covers the current video to enable controls placed on it to be
more visible.

<!-- Auto Generated Below -->

## Usage

### Angular

```html {5} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-scrim></vime-scrim>
  </vime-ui>
</vime-player>
```

### Html

```html {5}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-scrim></vime-scrim>
  </vime-ui>
</vime-player>
```

### React

```tsx {2,10}
import React from 'react';
import { VimePlayer, VimeUi, VimeScrim } from '@vime/react';

function Example() {
  return render(
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeScrim />
      </VimeUi>
    </VimePlayer>
  );
}
```

### Svelte

```html {5,10} title="example.svelte"
<VimePlayer>
  <!-- ... -->
  <VimeUi>
    <!-- ... -->
    <VimeScrim />
  </VimeUi>
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeUi, VimeScrim } from '@vime/svelte';
</script>
```

### Vue

```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeScrim />
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeScrim } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeScrim,
    },
  };
</script>
```

## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Type                          | Default     |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | ----------- |
| `gradient` | `gradient` | If this prop is defined, a dark gradient that smoothly fades out without being noticed will be used instead of a set color. This prop also sets the direction in which the dark end of the gradient should start. If the direction is set to `up`, the dark end of the gradient will start at the bottom of the player and fade out to the center. If the direction is set to `down`, the gradient will start at the top of the player and fade out to the center. | `"down" \| "up" \| undefined` | `undefined` |

## CSS Custom Properties

| Name         | Description                        |
| ------------ | ---------------------------------- |
| `--scrim-bg` | The background color of the scrim. |

## Dependencies

### Used by

- [vime-default-controls](../controls/default-controls)

### Graph

```mermaid
graph TD;
  vime-default-controls --> vime-scrim
  style vime-scrim fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
