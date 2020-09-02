# vime-click-to-play

Enables toggling playback by clicking the player.

<!-- Auto Generated Below -->


## Usage

### Angular

```html {5} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-click-to-play></vime-click-to-play>
  </vime-ui>
</vime-player>
```


### Html

```html {5}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-click-to-play></vime-click-to-play>
  </vime-ui>
</vime-player>
```


### React

```tsx {2,10}
import React from 'react';
import { VimePlayer, VimeUi, VimeClickToPlay } from '@vime/react';

function Example() {
  return render(
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeClickToPlay />
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
    <VimeClickToPlay />
  </VimeUi>
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeUi, VimeClickToPlay } from '@vime/svelte';
</script>
```


### Vue

```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeClickToPlay />
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeClickToPlay } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeClickToPlay,
    },
  };
</script>
```



## Properties

| Property      | Attribute       | Description                                                                                            | Type      | Default |
| ------------- | --------------- | ------------------------------------------------------------------------------------------------------ | --------- | ------- |
| `useOnMobile` | `use-on-mobile` | By default this is disabled on mobile to not interfere with playback, set this to `true` to enable it. | `boolean` | `false` |


## Dependencies

### Used by

 - [vime-default-ui](../default-ui)

### Graph
```mermaid
graph TD;
  vime-default-ui --> vime-click-to-play
  style vime-click-to-play fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
