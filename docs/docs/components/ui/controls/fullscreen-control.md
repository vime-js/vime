---
title: vm-fullscreen-control
sidebar_label: FullscreenControl
---

A control for toggling fullscreen mode. This control is not displayed if fullscreen cannot be
requested (checked via the `canSetFullscreen()` player method).

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/fullscreen-control/fullscreen-control.png"
  alt="Vime fullscreen control component"
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

```html {7}
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-controls>
      <!-- ... -->
      <vm-fullscreen-control></vm-fullscreen-control>
    </vm-controls>
  </vm-ui>
</vm-player>
```


</TabItem>

<TabItem value="react">

```tsx {6,16}
import React from 'react';
import { Player, Ui, Controls, FullscreenControl } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls>
          <FullscreenControl />
        </Controls>
      </Ui>
    </Player>
  );
}
```


</TabItem>

<TabItem value="vue">

```html {7,18,26} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Controls>
        <FullscreenControl />
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Controls, FullscreenControl } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      FullscreenControl,
    },
  };
</script>
```


</TabItem>

<TabItem value="svelte">

```html {6,16} title="example.svelte"
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <Controls>
      <FullscreenControl />
    </Controls>
  </Ui>
</Player>

<script lang="ts">
  import { Player, Ui, ClickToPlay, FullscreenControl } from '@vime/svelte';
</script>
```


</TabItem>

<TabItem value="stencil">

```tsx {9}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-controls>
            <vm-fullscreen-control />
          </vm-controls>
        </vm-ui>
      </vm-player>
    );
  }
}
```


</TabItem>

<TabItem value="angular">

```html {7} title="example.html"
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-controls>
      <!-- ... -->
      <vm-fullscreen-control></vm-fullscreen-control>
    </vm-controls>
  </vm-ui>
</vm-player>
```


</TabItem>
</Tabs>


## Properties

| Property           | Description                                                                                                                                                   | Type                           | Default              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | -------------------- |
| `enterIcon`        | The name of the enter fullscreen icon to resolve from the icon library.                                                                                       | `string`                       | `'fullscreen-enter'` |
| `exitIcon`         | The name of the exit fullscreen icon to resolve from the icon library.                                                                                        | `string`                       | `'fullscreen-exit'`  |
| `hideTooltip`      | Whether the tooltip should not be displayed.                                                                                                                  | `boolean`                      | `false`              |
| `icons`            | The name of an icon library to use. Defaults to the library defined by the `icons` player property.                                                           | `string ∣ undefined`           | `undefined`          |
| `keys`             | A slash (`/`) separated string of JS keyboard keys (`KeyboardEvent.key`), that when caught in a `keydown` event, will trigger a `click` event on the control. | `string ∣ undefined`           | `'f'`                |
| `tooltipDirection` | The direction in which the tooltip should grow.                                                                                                               | `"left" ∣ "right" ∣ undefined` | `undefined`          |
| `tooltipPosition`  | Whether the tooltip is positioned above/below the control.                                                                                                    | `"bottom" ∣ "top"`             | `'top'`              |


## Dependencies

### Used by

 - [vm-default-controls](./default-controls)

### Depends on

- [vm-control](./control)
- [vm-icon](./../icon)
- [vm-tooltip](./../tooltip)


