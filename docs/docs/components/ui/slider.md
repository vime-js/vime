---
title: vm-slider
sidebar_label: Slider
---

A custom styled and ARIA friendly `input[type="range"]` component for inputting numeric values.
In addition, there are optimizations made for improved touch support (more information can be found
at https://github.com/sampotts/rangetouch).

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/slider/slider.png"
  alt="Vime slider component"
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
<vm-slider step="5" max="100" value="50" label="Volume" />

<script>
  const slider = document.querySelector('vm-slider');

  slider.addEventListener('vmValueChange', event => {
    const newValue = event.detail;
  });
</script>
```

</TabItem>

<TabItem value="react">

```tsx {2,12-18}
import React, { useState } from 'react';
import { Slider } from '@vime/react';

function Example() {
  const [value, setValue] = useState(50);

  const onValueChange = (event: CustomEvent<number>) => {
    setValue(event.detail);
  };

  return (
    <Slider
      label="Volume"
      step={5}
      max={100}
      value={value}
      onVmValueChange={onValueChange}
    />
  );
}
```

</TabItem>

<TabItem value="vue">

```html {2-8,12,16} title="example.vue"
<template>
  <Slider
    label="Volume"
    :step="5"
    :max="100"
    :value="value"
    @vmValueChange="onValueChange"
  />
</template>

<script>
  import { Slider } from '@vime/vue';

  export default {
    components: {
      Slider,
    },
    data: {
      value: 50,
    },
    methods: {
      onValueChange(value) {
        this.value = value;
      },
    },
  };
</script>
```

</TabItem>

<TabItem value="svelte">

```tsx
<Slider
  label="Volume"
  step={5}
  max={100}
  value={value}
  on:vmValueChange={onValueChange}
/>
```

```html {2}
<script lang="ts">
  import { Slider } from '@vime/svelte';

  let value = 50;

  const onValueChange = (event: CustomEvent<number>) => {
    value = event.detail;
  };
</script>
```

</TabItem>

<TabItem value="stencil">

```tsx {10-16}
class Example {
  @State() value = 50;

  private onValueChange(event: CustomEvent<number>) {
    this.value = event.detail;
  }

  render() {
    return (
      <Slider
        label="Volume"
        step={5}
        max={100}
        value={this.value}
        onVmValueChange={this.onValueChange.bind(this)}
      />
    );
  }
}
```

</TabItem>

<TabItem value="angular">

```html title="example.html"
<vm-slider
  label="Volume"
  [step]="5"
  [max]="100"
  [value]="value"
  (vmValueChange)="onValueChange($event)"
/>
```

```ts title="example.ts"
class Example {
  value = 50;

  onValueChange(event: CustomEvent<number>) {
    this.value = event.detail;
  }
}
```

</TabItem>
</Tabs>

## Properties

| Property    | Description                                                                                | Type                 | Default     |
| ----------- | ------------------------------------------------------------------------------------------ | -------------------- | ----------- |
| `label`     | A human-readable label for the purpose of the slider.                                      | `string ∣ undefined` | `undefined` |
| `max`       | The greatest permitted value.                                                              | `number`             | `10`        |
| `min`       | The lowest value in the range of permitted values.                                         | `number`             | `0`         |
| `step`      | A number that specifies the granularity that the value must adhere to.                     | `number`             | `1`         |
| `value`     | The current value.                                                                         | `number`             | `5`         |
| `valueText` | Human-readable text alternative for the current value. Defaults to `value:max` percentage. | `string ∣ undefined` | `undefined` |

## Events

| Event           | Description                                                     | Type                  |
| --------------- | --------------------------------------------------------------- | --------------------- |
| `vmBlur`        | Emitted when the slider loses focus.                            | `CustomEvent<void>`   |
| `vmFocus`       | Emitted when the slider receives focus.                         | `CustomEvent<void>`   |
| `vmValueChange` | Emitted when the value of the underlying `input` field changes. | `CustomEvent<number>` |

## CSS Custom Properties

| Name                               | Description                                                       |
| ---------------------------------- | ----------------------------------------------------------------- |
| `--vm-slider-thumb-bg`             | The background color of the slider thumb.                         |
| `--vm-slider-thumb-height`         | The height of the slider thumb.                                   |
| `--vm-slider-thumb-shadow`         | The shadow cast around the slider thumb.                          |
| `--vm-slider-thumb-width`          | The width of the slider thumb.                                    |
| `--vm-slider-track-color`          | The color of the track.                                           |
| `--vm-slider-track-focused-height` | The height of the track when it is focused.                       |
| `--vm-slider-track-height`         | The height of the track.                                          |
| `--vm-slider-value-color`          | The color of the part of the track filled upto the current value. |

## Dependencies

### Used by

- [vm-scrubber-control](./controls/scrubber-control)
- [vm-volume-control](./controls/volume-control)
