# vime-live-indicator

This can be used to indicate to the user that the current media is being streamed live.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/live-indicator/live-indicator.png"
  alt="Vime live indicator component"
/>

<!-- Auto Generated Below -->

## Usage

### Angular

```html {7} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-controls>
      <!-- ... -->
      <vime-live-indicator></vime-live-indicator>
    </vime-controls>
  </vime-ui>
</vime-player>
```

### Html

```html {7}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-controls>
      <!-- ... -->
      <vime-live-indicator></vime-live-indicator>
    </vime-controls>
  </vime-ui>
</vime-player>
```

### React

```tsx {6,16}
import React from 'react';
import {
  VimePlayer,
  VimeUi,
  VimeControls,
  VimeLiveIndicator,
} from '@vime/react';

function Example() {
  return render(
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeControls>
          <VimeLiveIndicator />
        </VimeControls>
      </VimeUi>
    </VimePlayer>
  );
}
```

### Svelte

```html {6,17} title="example.svelte"
<VimePlayer>
  <!-- ... -->
  <VimeUi>
    <!-- ... -->
    <VimeControls>
      <VimeLiveIndicator />
    </VimeControls>
  </VimeUi>
</VimePlayer>

<script lang="ts">
  import {
    VimePlayer,
    VimeUi,
    VimeIcons,
    VimeControls,
    VimeLiveIndicator,
  } from '@vime/svelte';
</script>
```

### Vue

```html {7,18,26} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeControls>
        <VimeLiveIndicator />
      </VimeControls>
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import {
    VimePlayer,
    VimeUi,
    VimeControls,
    VimeLiveIndicator,
  } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeControls,
      VimeLiveIndicator,
    },
  };
</script>
```

## CSS Custom Properties

| Name                     | Description                          |
| ------------------------ | ------------------------------------ |
| `--live-indicator-color` | The color of the live indicator dot. |

## Dependencies

### Used by

- [vime-default-controls](../controls/default-controls)

### Graph

```mermaid
graph TD;
  vime-default-controls --> vime-live-indicator
  style vime-live-indicator fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
