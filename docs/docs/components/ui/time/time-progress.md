---
title: vime-time-progress
sidebar_label: TimeProgress
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

Formats and displays the progression of playback as `currentTime (separator) endTime`.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/time/time-progress/time-progress.png"
  alt="Vime time progress component"
/>

<!-- Auto Generated Below -->

## Usage

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

```html
<vime-time-progress separator="/" />
```

</TabItem>


<TabItem value="react">

```tsx {2,5}
import React from 'react';
import { VimeTimeProgress } from '@vime/react';

function Example() {
  return <VimeTimeProgress separator="/" />;
}
```

</TabItem>


<TabItem value="vue">

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

</TabItem>


<TabItem value="svelte">

```html {1,4} title="example.svelte"
<VimeTimeProgress separator="/" />

<script lang="ts">
  import { VimeTimeProgress } from '@vime/svelte';
</script>
```

</TabItem>


<TabItem value="stencil">

```tsx {3}
class Example {
  render() {
    return <vime-time-progress separator="/" />;
  }
}
```

</TabItem>


<TabItem value="angular">

```html title="example.html"
<vime-time-progress separator="/" />
```

</TabItem>
    
</Tabs>


## Properties

| Property          | Attribute           | Description                                                                                                            | Type      | Default |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `alwaysShowHours` | `always-show-hours` | Whether the times should always show the hours unit, even if the time is less than 1 hour (eg: `20:35` -> `00:20:35`). | `boolean` | `false` |
| `separator`       | `separator`         | The string used to separate the current time and end time.                                                             | `string`  | `'/'`   |

## CSS Custom Properties

| Name              | Description                                |
| ----------------- | ------------------------------------------ |
| `--vm-time-color` | The color of the text displaying the time. |

## Dependencies

### Used by

- [vime-default-controls](../controls/default-controls.md)

### Depends on

- [vime-current-time](current-time.md)
- [vime-end-time](end-time.md)

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
