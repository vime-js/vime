# vime-poster

Loads the poster set in the player prop `currentPoster` and displays it. The poster will automatically
dissapear once playback starts.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/poster/poster.png"
  alt="Vime poster component"
/>

<!-- Auto Generated Below -->


## Usage

### Angular

```html {5} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-poster></vime-poster>
  </vime-ui>
</vime-player>
```


### Html

```html {5}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-poster></vime-poster>
  </vime-ui>
</vime-player>
```


### React

```tsx {2,10}
import React from 'react';
import { VimePlayer, VimeUi, VimePoster } from '@vime/react';

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimePoster />
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
    <VimePoster />
  </VimeUi>
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeUi, VimePoster } from '@vime/svelte';
</script>
```


### Vue

```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimePoster />
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimePoster } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimePoster,
    },
  };
</script>
```



## Properties

| Property | Attribute | Description                                                                                   | Type                                                                    | Default   |
| -------- | --------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------- |
| `fit`    | `fit`     | How the poster image should be resized to fit the container (sets the `object-fit` property). | `"contain" \| "cover" \| "fill" \| "none" \| "scale-down" \| undefined` | `'cover'` |


## Events

| Event       | Description                             | Type                |
| ----------- | --------------------------------------- | ------------------- |
| `vLoaded`   | Emitted when the poster has loaded.     | `CustomEvent<void>` |
| `vWillHide` | Emitted when the poster will be hidden. | `CustomEvent<void>` |
| `vWillShow` | Emitted when the poster will be shown.  | `CustomEvent<void>` |


## CSS Custom Properties

| Name               | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `--poster-z-index` | The position in the UI z-axis stack inside the player. |


## Dependencies

### Used by

 - [vime-default-ui](../default-ui)

### Graph
```mermaid
graph TD;
  vime-default-ui --> vime-poster
  style vime-poster fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
