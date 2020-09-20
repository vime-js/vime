# vime-skeleton

A temporary placeholder that is used while content is loading. The implementation was inspired 
by [Shoelace](https://github.com/shoelace-style/shoelace), thanks Cory!

<!-- Auto Generated Below -->


## Usage

### Angular

```html {5} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-skeleton></vime-skeleton>
  </vime-ui>
</vime-player>
```


### Html

```html {5}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-skeleton></vime-skeleton>
  </vime-ui>
</vime-player>
```


### React

```tsx {2,10}
import React from 'react';
import { VimePlayer, VimeUi, VimeSkeleton } from '@vime/react';

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeSkeleton />
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
    <VimeSkeleton />
  </VimeUi>
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeUi, VimeSkeleton } from '@vime/svelte';
</script>
```


### Vue

```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeSkeleton />
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeSkeleton } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeSkeleton,
    },
  };
</script>
```



## Properties

| Property | Attribute | Description                                    | Type                | Default   |
| -------- | --------- | ---------------------------------------------- | ------------------- | --------- |
| `effect` | `effect`  | Determines which effect the skeleton will use. | `"none" \| "sheen"` | `'sheen'` |


## CSS Custom Properties

| Name                        | Description                                                |
| --------------------------- | ---------------------------------------------------------- |
| `--vm-skeleton-color`       | The color of the skeleton.                                 |
| `--vm-skeleton-sheen-color` | The sheen color when the skeleton is in its loading state. |
| `--vm-skeleton-z-index`     | The position in the UI z-axis stack inside the player.     |


## Dependencies

### Used by

 - [vime-default-ui](../default-ui)

### Graph
```mermaid
graph TD;
  vime-default-ui --> vime-skeleton
  style vime-skeleton fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
