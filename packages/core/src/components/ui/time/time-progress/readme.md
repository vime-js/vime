# vime-time-progress

Formats and displays the progression of playback as `currentTime (separator) endTime`.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/time/time-progress/time-progress.png"
  alt="Vime time progress component"
/>

<!-- Auto Generated Below -->

## Usage

### Angular

```html title="example.html"
<vime-time-progress separator="/" />
```

### Html

```html
<vime-time-progress separator="/" />
```

### React

```tsx {2,5}
import React from 'react';
import { VimeTimeProgress } from '@vime/react';

function Example() {
  return render(<VimeTimeProgress separator="/" />);
}
```

### Svelte

```html {1,4} title="example.svelte"
<VimeTimeProgress separator="/" />

<script lang="ts">
  import { VimeTimeProgress } from '@vime/svelte';
</script>
```

### Vue

```html {2,6,10} title="example.vue"
<template>
  <VimeTimeProgress separator="/" />
</template>

<script>
  import { VimeTimeProgress } from '@vime/vue';

  export default {
    components: {
      VimeTimeProgress,
    },
  };
</script>
```

## Properties

| Property          | Attribute           | Description                                                                                                            | Type      | Default |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `alwaysShowHours` | `always-show-hours` | Whether the times should always show the hours unit, even if the time is less than 1 hour (eg: `20:35` -> `00:20:35`). | `boolean` | `false` |
| `separator`       | `separator`         | The string used to separate the current time and end time.                                                             | `string`  | `'/'`   |

## CSS Custom Properties

| Name           | Description                                |
| -------------- | ------------------------------------------ |
| `--time-color` | The color of the text displaying the time. |

## Dependencies

### Used by

- [vime-default-controls](../../controls/default-controls)

### Depends on

- [vime-current-time](../current-time)
- [vime-end-time](../end-time)

### Graph

```mermaid
graph TD;
  vime-time-progress --> vime-current-time
  vime-time-progress --> vime-end-time
  vime-current-time --> vime-time
  vime-end-time --> vime-time
  vime-default-controls --> vime-time-progress
  style vime-time-progress fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
