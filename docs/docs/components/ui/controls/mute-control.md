---
title: vm-mute-control
sidebar_label: MuteControl
---

A control for toggling whether there is audio output or not. In other words the muted state of
the player.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/src/components/ui/controls/mute-control/mute-control.png"
  alt="Vime mute control component"
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
      <vm-mute-control></vm-mute-control>
    </vm-controls>
  </vm-ui>
</vm-player>
```

</TabItem>

<TabItem value="react">

```tsx {2,11}
import React from 'react';
import { Player, Ui, Controls, MuteControl } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls>
          <MuteControl />
        </Controls>
      </Ui>
    </Player>
  );
}
```

</TabItem>

<TabItem value="vue">

```html {7,14,21} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Controls>
        <MuteControl />
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Controls, MuteControl } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      MuteControl,
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
      <MuteControl />
    </Controls>
  </Ui>
</Player>

<script lang="ts">
  import { Player, Ui, Controls, MuteControl } from '@vime/svelte';
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
            <vm-mute-control />
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
      <vm-mute-control></vm-mute-control>
    </vm-controls>
  </vm-ui>
</vm-player>
```

</TabItem>
</Tabs>

## Properties

| Property           | Description                                                                                                                                                   | Type                           | Default         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | --------------- |
| `hideTooltip`      | Whether the tooltip should not be displayed.                                                                                                                  | `boolean`                      | `false`         |
| `highVolumeIcon`   | The name of the high volume icon to resolve from the icon library.                                                                                            | `string`                       | `'volume-high'` |
| `icons`            | The name of an icon library to use. Defaults to the library defined by the `icons` player property.                                                           | `string ∣ undefined`           | `undefined`     |
| `keys`             | A slash (`/`) separated string of JS keyboard keys (`KeyboardEvent.key`), that when caught in a `keydown` event, will trigger a `click` event on the control. | `string ∣ undefined`           | `'m'`           |
| `lowVolumeIcon`    | The name of the low volume icon to resolve from the icon library.                                                                                             | `string`                       | `'volume-low'`  |
| `mutedIcon`        | The name of the muted volume icon to resolve from the icon library.                                                                                           | `string`                       | `'volume-mute'` |
| `tooltipDirection` | The direction in which the tooltip should grow.                                                                                                               | `"left" ∣ "right" ∣ undefined` | `undefined`     |
| `tooltipPosition`  | Whether the tooltip is positioned above/below the control.                                                                                                    | `"bottom" ∣ "top"`             | `'top'`         |

## Events

| Event     | Description                              | Type                |
| --------- | ---------------------------------------- | ------------------- |
| `vmBlur`  | Emitted when the control loses focus.    | `CustomEvent<void>` |
| `vmFocus` | Emitted when the control receives focus. | `CustomEvent<void>` |

## Dependencies

### Used by

- [vm-volume-control](./volume-control)

### Depends on

- [vm-control](./control)
- [vm-icon](./../icon)
- [vm-tooltip](./../tooltip)
