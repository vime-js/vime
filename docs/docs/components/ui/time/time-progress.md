---
title: vm-time-progress
sidebar_label: TimeProgress
---

Formats and displays the progression of playback as `currentTime (separator) endTime`.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/time/time-progress/time-progress.png"
  alt="Vime time progress component"
/>

<!-- Auto Generated Below -->

## Usage

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

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
<vm-time-progress separator="/" />
```


</TabItem>

<TabItem value="react">

```tsx {2,5}
import React from 'react';
import { TimeProgress } from '@vime/react';

function Example() {
  return <TimeProgress separator="/" />;
}
```


</TabItem>

<TabItem value="vue">

```html {2,6,10} title="example.vue"
<template>
  <TimeProgress separator="/" />
</template>

<script>
  import { TimeProgress } from '@vime/vue';

  export default {
    components: {
      TimeProgress,
    },
  };
</script>
```


</TabItem>

<TabItem value="svelte">

```html {1,4} title="example.svelte"
<TimeProgress separator="/" />

<script lang="ts">
  import { TimeProgress } from '@vime/svelte';
</script>
```


</TabItem>

<TabItem value="stencil">

```tsx {3}
class Example {
  render() {
    return <vm-time-progress separator="/" />;
  }
}
```


</TabItem>

<TabItem value="angular">

```html title="example.html"
<vm-time-progress separator="/" />
```


</TabItem>
</Tabs>


## Properties

| Property          | Description                                                                                                            | Type      | Default |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `alwaysShowHours` | Whether the times should always show the hours unit, even if the time is less than 1 hour (eg: `20:35` -> `00:20:35`). | `boolean` | `false` |
| `separator`       | The string used to separate the current time and end time.                                                             | `string`  | `'/'`   |


## CSS Custom Properties

| Name              | Description                                |
| ----------------- | ------------------------------------------ |
| `--vm-time-color` | The color of the text displaying the time. |


## Dependencies

### Used by

 - [vm-default-controls](./../controls/default-controls)

### Depends on

- [vm-current-time](./current-time)
- [vm-end-time](./end-time)


