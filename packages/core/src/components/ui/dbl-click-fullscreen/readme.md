# vime-dbl-click-fullscreen

Enables toggling fullscreen mode by double clicking the player.

<!-- Auto Generated Below -->


## Usage

### Angular

```html {5} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-dbl-click-fullscreen></vime-dbl-click-fullscreen>
  </vime-ui>
</vime-player>
```


### Html

```html {5}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-dbl-click-fullscreen></vime-dbl-click-fullscreen>
  </vime-ui>
</vime-player>
```


### React

```tsx {2,10}
import React from 'react';
import { VimePlayer, VimeUi, VimeDblClickFullscreen } from '@vime/react';

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeDblClickFullscreen />
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
    <VimeDblClickFullscreen />
  </VimeUi>
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeUi, VimeDblClickFullscreen } from '@vime/svelte';
</script>
```


### Vue

```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeDblClickFullscreen />
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeDblClickFullscreen } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeDblClickFullscreen,
    },
  };
</script>
```



## Properties

| Property      | Attribute       | Description                                                                                            | Type      | Default |
| ------------- | --------------- | ------------------------------------------------------------------------------------------------------ | --------- | ------- |
| `useOnMobile` | `use-on-mobile` | By default this is disabled on mobile to not interfere with playback, set this to `true` to enable it. | `boolean` | `false` |


## CSS Custom Properties

| Name                                | Description                                            |
| ----------------------------------- | ------------------------------------------------------ |
| `--vm-dbl-click-fullscreen-z-index` | The position in the UI z-axis stack inside the player. |


## Dependencies

### Used by

 - [vime-default-ui](../default-ui)

### Graph
```mermaid
graph TD;
  vime-default-ui --> vime-dbl-click-fullscreen
  style vime-dbl-click-fullscreen fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
