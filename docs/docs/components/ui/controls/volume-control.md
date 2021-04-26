---
title: vm-volume-control
sidebar_label: VolumeControl
---

A control for adjusting the volume of the player and toggling the muted state.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/src/components/ui/controls/volume-control/volume-control.png"
  alt="Vime volume control component"
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
      <vm-volume-control></vm-volume-control>
    </vm-controls>
  </vm-ui>
</vm-player>
```

</TabItem>

<TabItem value="react">

```tsx {6,16}
import React from 'react';
import { Player, Ui, Controls, VolumeControl } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls>
          <VolumeControl />
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
        <VolumeControl />
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Controls, VolumeControl } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      VolumeControl,
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
      <VolumeControl />
    </Controls>
  </Ui>
</Player>

<script lang="ts">
  import { Player, Ui, Controls, VolumeControl } from '@vime/svelte';
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
            <vm-volume-control />
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
      <vm-volume-control></vm-volume-control>
    </vm-controls>
  </vm-ui>
</vm-player>
```

</TabItem>
</Tabs>

## Properties

| Property           | Description                                                                                                                          | Type                           | Default         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ | --------------- |
| `hideTooltip`      | Whether the tooltip should be hidden.                                                                                                | `boolean`                      | `false`         |
| `highVolumeIcon`   | The name of the high volume icon to resolve from the icon library.                                                                   | `string`                       | `'volume-high'` |
| `icons`            | The name of an icon library to use. Defaults to the library defined by the `icons` player property.                                  | `string ∣ undefined`           | `undefined`     |
| `lowVolumeIcon`    | The name of the low volume icon to resolve from the icon library.                                                                    | `string`                       | `'volume-low'`  |
| `muteKeys`         | A pipe (`/`) separated string of JS keyboard keys, that when caught in a `keydown` event, will toggle the muted state of the player. | `string ∣ undefined`           | `'m'`           |
| `mutedIcon`        | The name of the muted volume icon to resolve from the icon library.                                                                  | `string`                       | `'volume-mute'` |
| `noKeyboard`       | Prevents the volume being changed using the Up/Down arrow keys.                                                                      | `boolean`                      | `false`         |
| `tooltipDirection` | The direction in which the tooltip should grow.                                                                                      | `"left" ∣ "right" ∣ undefined` | `undefined`     |
| `tooltipPosition`  | Whether the tooltip is positioned above/below the control.                                                                           | `"bottom" ∣ "top"`             | `'top'`         |

## Dependencies

### Used by

- [vm-default-controls](./default-controls)

### Depends on

- [vm-mute-control](./mute-control)
- [vm-slider](./../slider)
