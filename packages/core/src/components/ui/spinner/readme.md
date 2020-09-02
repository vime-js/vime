# vime-spinner

Displays a loading indicator when the video is `buffering`.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/spinner/spinner.png"
  alt="Vime spinner component"
/>

<!-- Auto Generated Below -->


## Usage

### Angular

```html {5} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-spinner></vime-spinner>
  </vime-ui>
</vime-player>
```


### Html

```html {5}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-spinner></vime-spinner>
  </vime-ui>
</vime-player>
```


### React

```tsx {2,10}
import React from 'react';
import { VimePlayer, VimeUi, VimeSpinner } from '@vime/react';

function Example() {
  return render(
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeSpinner />
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
    <VimeSpinner />
  </VimeUi>
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeUi, VimeSpinner } from '@vime/svelte';
</script>
```


### Vue

```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeSpinner />
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeSpinner } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeSpinner,
    },
  };
</script>
```



## Events

| Event       | Description                              | Type                |
| ----------- | ---------------------------------------- | ------------------- |
| `vWillHide` | Emitted when the spinner will be hidden. | `CustomEvent<void>` |
| `vWillShow` | Emitted when the spinner will be shown.  | `CustomEvent<void>` |


## CSS Custom Properties

| Name                         | Description                                                |
| ---------------------------- | ---------------------------------------------------------- |
| `--spinner-fill-color`       | The color of the progress within the track.                |
| `--spinner-height`           | The height of the spinner.                                 |
| `--spinner-spin-duration`    | How long it takes the spinner to complete a full rotation. |
| `--spinner-spin-timing-func` | The animation timing function to use for the spin.         |
| `--spinner-thickness`        | The thickness of the spinner in px.                        |
| `--spinner-track-color`      | The color of the track the spinner is rotating in.         |
| `--spinner-width`            | The width of the spinner.                                  |


## Dependencies

### Used by

 - [vime-default-ui](../default-ui)

### Graph
```mermaid
graph TD;
  vime-default-ui --> vime-spinner
  style vime-spinner fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
