---
title: vm-tooltip
sidebar_label: Tooltip
---

A small pop-up box that appears when a user moves their mouse over an element. Their main purpose
is to provide a description about the function of that element.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/tooltip/tooltip.png"
  alt="Vime tooltip component"
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
      <vm-control>
        <vm-tooltip>Title</vm-tooltip>
      </vm-control>
    </vm-controls>
  </vm-ui>
</vm-player>
```

</TabItem>

<TabItem value="react">

```tsx {7,18}
import React from 'react';
import { Player, Ui, Controls, Control, Tooltip } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls>
          <Control>
            <Tooltip>Title</Tooltip>
          </Control>
        </Controls>
      </Ui>
    </Player>
  );
}
```

</TabItem>

<TabItem value="vue">

```html {8,21,30} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Controls>
        <Control>
          <Tooltip>Title</Tooltip>
        </Control>
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Controls, Control, Tooltip } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      Control,
      Tooltip,
    },
  };
</script>
```

</TabItem>

<TabItem value="svelte">

```html {7,19} title="example.svelte"
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <Controls>
      <Control>
        <Tooltip>Title</Tooltip>
      </Control>
    </Controls>
  </Ui>
</Player>

<script lang="ts">
  import { Player, Ui, Controls, Control, Tooltip } from '@vime/svelte';
</script>
```

</TabItem>

<TabItem value="stencil">

```tsx {10}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-controls>
            <vm-control>
              <vm-tooltip>Title</vm-tooltip>
            </vm-control>
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
      <vm-control>
        <vm-tooltip>Title</vm-tooltip>
      </vm-control>
    </vm-controls>
  </vm-ui>
</vm-player>
```

</TabItem>
</Tabs>

## Properties

| Property    | Description                                                                                                                           | Type                           | Default     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ----------- |
| `active`    | Whether the tooltip is visible or not.                                                                                                | `boolean`                      | `false`     |
| `direction` | Determines if the tooltip should grow according to its contents to the left/right. By default content grows outwards from the center. | `"left" ∣ "right" ∣ undefined` | `undefined` |
| `hidden`    | Whether the tooltip is displayed or not.                                                                                              | `boolean`                      | `false`     |
| `position`  | Determines if the tooltip appears on top/bottom of it's parent.                                                                       | `"bottom" ∣ "top"`             | `'top'`     |

## Slots

| Slot | Description                                  |
| ---- | -------------------------------------------- |
|      | Used to pass in the contents of the tooltip. |

## CSS Custom Properties

| Name                            | Description                                                      |
| ------------------------------- | ---------------------------------------------------------------- |
| `--vm-tooltip-bg`               | The background color of the tooltip.                             |
| `--vm-tooltip-border-radius`    | The border radius of the tooltip.                                |
| `--vm-tooltip-box-shadow`       | The box shadow cast around the tooltip.                          |
| `--vm-tooltip-color`            | The text color of the tooltip.                                   |
| `--vm-tooltip-fade-duration`    | The length in seconds that the tooltip will take to fade in/out. |
| `--vm-tooltip-fade-timing-func` | The transition timing function for fading in and out.            |
| `--vm-tooltip-font-size`        | The font size of the tooltip text.                               |
| `--vm-tooltip-left`             | The left offset of the tooltip.                                  |
| `--vm-tooltip-padding`          | The padding inside the tooltip.                                  |
| `--vm-tooltip-spacing`          | The space between the tooltip and its parent when active.        |
| `--vm-tooltip-z-index`          | The position in the UI z-axis stack inside the player.           |

## Dependencies

### Used by

- [vm-caption-control](./controls/caption-control)
- [vm-fullscreen-control](./controls/fullscreen-control)
- [vm-mute-control](./controls/mute-control)
- [vm-pip-control](./controls/pip-control)
- [vm-playback-control](./controls/playback-control)
- [vm-scrubber-control](./controls/scrubber-control)
- [vm-settings-control](./controls/settings-control)
