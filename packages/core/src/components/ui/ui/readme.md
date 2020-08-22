# vime-ui

Simple container that holds a collection of user interface components.

The only important role this component really has is, avoiding overlapping custom UI with the
native iOS media player UI. Therefore, custom UI is only displayed on iOS if the `playsinline` prop
is `true`, and the player is not in fullscreen mode.

<!-- Auto Generated Below -->

## Usage

### Angular

```html {3-5} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
  </vime-ui>
</vime-player>
```

### Html

```html {3-5}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
  </vime-ui>
</vime-player>
```

### React

```tsx {2,8}
import React from 'react';
import { VimePlayer, VimeUi } from '@vime/react';

function Example() {
  return render(
    <VimePlayer>
      {/* ... */}
      <VimeUi>{/* ... */}</VimeUi>
    </VimePlayer>
  );
}
```

### Vue

```html {4-6,11,16} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
    },
  };
</script>
```

## Dependencies

### Used by

- [vime-default-ui](../default-ui)

### Graph

```mermaid
graph TD;
  vime-default-ui --> vime-ui
  style vime-ui fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
