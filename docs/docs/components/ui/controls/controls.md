---
title: vm-controls
sidebar_label: Controls
---

Responsible for positioning and laying out individual/groups of controls.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/src/components/ui/controls/controls/controls.png"
  alt="Vime controls component"
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

```html {5-7}
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-controls full-width active-duration="3200">
      <!-- ... -->
    </vm-controls>
  </vm-ui>
</vm-player>
```

</TabItem>

<TabItem value="react">

```tsx {2,10-12}
import React from 'react';
import { Player, Ui, Controls } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls fullWidth activeDuration={3200}>
          {/* ... */}
        </Controls>
      </Ui>
    </Player>
  );
}
```

</TabItem>

<TabItem value="vue">

```html {5-7,13,19} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <Controls fullWidth :activeDuration="3200">
        <!-- ... -->
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Controls } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
    },
  };
</script>
```

</TabItem>

<TabItem value="svelte">

```tsx {5-7}
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <Controls fullWidth activeDuration={3200}>
      <!-- ... -->
    </Controls>
  </Ui>
</Player>
```

```html {2}
<script lang="ts">
  import { Player, Ui, Controls } from '@vime/svelte';
</script>
```

</TabItem>

<TabItem value="stencil">

```tsx {8-10}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-controls fullWidth activeDuration={3200}>
            {/* ... */}
          </vm-controls>
        </vm-ui>
      </vm-player>
    );
  }
}
```

</TabItem>

<TabItem value="angular">

```html {5-7} title="example.html"
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-controls full-width [active-duration]="2750">
      <!-- ... -->
    </vm-controls>
  </vm-ui>
</vm-player>
```

</TabItem>
</Tabs>

## Properties

| Property               | Description                                                                                                                 | Type                                                                             | Default        |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------- |
| `activeDuration`       | The length in milliseconds that the controls are active for before fading out. Audio players are not effected by this prop. | `number`                                                                         | `2750`         |
| `align`                | Sets the `align-items` flex property that aligns the individual controls on the cross-axis.                                 | `"center" ∣ "end" ∣ "start"`                                                     | `'center'`     |
| `direction`            | Sets the `flex-direction` property that manages the direction in which the controls are layed out.                          | `"column" ∣ "row"`                                                               | `'row'`        |
| `fullHeight`           | Whether the controls container should be 100% height. This has no effect if the view is of type `audio`.                    | `boolean`                                                                        | `false`        |
| `fullWidth`            | Whether the controls container should be 100% width. This has no effect if the view is of type `audio`.                     | `boolean`                                                                        | `false`        |
| `hidden`               | Whether the controls are visible or not.                                                                                    | `boolean`                                                                        | `false`        |
| `hideOnMouseLeave`     | Whether the controls should hide when the mouse leaves the player. Audio players are not effected by this prop.             | `boolean`                                                                        | `false`        |
| `hideWhenPaused`       | Whether the controls should show/hide when paused. Audio players are not effected by this prop.                             | `boolean`                                                                        | `false`        |
| `justify`              | Sets the `justify-content` flex property that aligns the individual controls on the main-axis.                              | `"center" ∣ "end" ∣ "space-around" ∣ "space-between" ∣ "space-evenly" ∣ "start"` | `'start'`      |
| `pin`                  | Pins the controls to the defined position inside the video player. This has no effect when the view is of type `audio`.     | `"bottomLeft" ∣ "bottomRight" ∣ "center" ∣ "topLeft" ∣ "topRight"`               | `'bottomLeft'` |
| `waitForPlaybackStart` | Whether the controls should wait for playback to start before being shown. Audio players are not effected by this prop.     | `boolean`                                                                        | `false`        |

## Slots

| Slot | Description               |
| ---- | ------------------------- |
|      | Used to pass in controls. |

## CSS Custom Properties

| Name                          | Description                                            |
| ----------------------------- | ------------------------------------------------------ |
| `--vm-controls-bg`            | The background color of the controls.                  |
| `--vm-controls-border-radius` | The border radius of the controls.                     |
| `--vm-controls-padding`       | The padding inside the controls.                       |
| `--vm-controls-spacing`       | The space between controls.                            |
| `--vm-controls-z-index`       | The position in the UI z-axis stack inside the player. |

## Dependencies

### Used by

- [vm-default-controls](./default-controls)
