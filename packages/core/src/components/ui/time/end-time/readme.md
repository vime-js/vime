# vime-end-time

Formats and displays the duration of the current media.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/time/end-time/end-time.png"
  alt="Vime end time component"
/>

<!-- Auto Generated Below -->


## Usage

### Angular

```html title="example.html"
<vime-end-time />
```


### Html

```html
<vime-end-time />
```


### React

```tsx {2,5}
import React from 'react';
import { VimeEndTime } from '@vime/react';

function Example() {
  return (<VimeEndTime />);
}
```


### Stencil

```tsx {3}
class Example {
  render() {
    return <vime-end-time />;
  }
}
```


### Svelte

```html {1,4} title="example.svelte"
<VimeEndTime />

<script lang="ts">
  import { VimeEndTime } from '@vime/svelte';
</script>
```


### Vue

```html {2,6,10} title="example.vue"
<template>
  <VimeEndTime />
</template>

<script>
  import { VimeEndTime } from '@vime/vue';

  export default {
    components: {
      VimeEndTime,
    },
  };
</script>
```



## Properties

| Property          | Attribute           | Description                                                                                                           | Type      | Default |
| ----------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `alwaysShowHours` | `always-show-hours` | Whether the time should always show the hours unit, even if the time is less than 1 hour (eg: `20:35` -> `00:20:35`). | `boolean` | `false` |


## Dependencies

### Used by

 - [vime-default-controls](../../controls/default-controls)
 - [vime-time-progress](../time-progress)

### Depends on

- [vime-time](../time)

### Graph
```mermaid
graph TD;
  vime-end-time --> vime-time
  vime-default-controls --> vime-end-time
  vime-time-progress --> vime-end-time
  style vime-end-time fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
