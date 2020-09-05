# vime-time

Formats and displays a length of time provided in seconds.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/time/time/time.png"
  alt="Vime time component"
/>

<!-- Auto Generated Below -->


## Usage

### Angular

```html title="example.html"
<vime-time label="Time" [seconds]="120" />
```


### Html

```html
<vime-time label="Time" seconds="120" />
```


### React

```tsx {2,5}
import React from 'react';
import { VimeTime } from '@vime/react';

function Example() {
  return (<VimeTime label="Time" seconds={120} />);
}
```


### Svelte

```tsx
<VimeTime label="Time" seconds={120} />
```

```html
<script lang="ts">
  import { VimeTime } from '@vime/svelte';
</script>
```


### Vue

```html {2,6,10} title="example.vue"
<template>
  <VimeTime label="Time" :seconds="120" />
</template>

<script>
  import { VimeTime } from '@vime/vue';

  export default {
    components: {
      VimeTime,
    },
  };
</script>
```



## Properties

| Property             | Attribute           | Description                                                                                                           | Type      | Default     |
| -------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `alwaysShowHours`    | `always-show-hours` | Whether the time should always show the hours unit, even if the time is less than 1 hour (eg: `20:35` -> `00:20:35`). | `boolean` | `false`     |
| `label` _(required)_ | `label`             | The `aria-label` property of the time.                                                                                | `string`  | `undefined` |
| `seconds`            | `seconds`           | The length of time in seconds.                                                                                        | `number`  | `0`         |


## CSS Custom Properties

| Name                 | Description                                 |
| -------------------- | ------------------------------------------- |
| `--time-color`       | The color of the text displaying the time.  |
| `--time-font-size`   | The size of the font displaying the time.   |
| `--time-font-weight` | The weight of the font displaying the time. |


## Dependencies

### Used by

 - [vime-current-time](../current-time)
 - [vime-end-time](../end-time)

### Graph
```mermaid
graph TD;
  vime-current-time --> vime-time
  vime-end-time --> vime-time
  style vime-time fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
