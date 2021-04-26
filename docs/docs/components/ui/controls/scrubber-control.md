---
title: vm-scrubber-control
sidebar_label: ScrubberControl
---

A control that displays the progression of playback and the amount buffered on a horizontal timeline.
The timeline is a slider (`input[type="range"]`) that can be used to change the current playback time.

If the player is buffering, the scrubber will display an animated candystripe in the porition of the
timeline that has not buffered.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/src/components/ui/controls/scrubber-control/scrubber-control.png"
  alt="Vime scrubber control component"
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
      <vm-scrubber-control></vm-scrubber-control>
    </vm-controls>
  </vm-ui>
</vm-player>
```

</TabItem>

<TabItem value="react">

```tsx {6,16}
import React from 'react';
import { Player, Ui, Controls, ScrubberControl } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls>
          <ScrubberControl />
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
        <ScrubberControl />
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Controls, ScrubberControl } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      ScrubberControl,
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
      <ScrubberControl />
    </Controls>
  </Ui>
</Player>

<script lang="ts">
  import { Player, Ui, Controls, ScrubberControl } from '@vime/svelte';
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
            <vm-scrubber-control />
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
      <vm-scrubber-control></vm-scrubber-control>
    </vm-controls>
  </vm-ui>
</vm-player>
```

</TabItem>
</Tabs>

## Properties

| Property          | Description                                                                                                                        | Type      | Default |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `alwaysShowHours` | Whether the timestamp in the tooltip should show the hours unit, even if the time is less than 1 hour (eg: `20:35` -> `00:20:35`). | `boolean` | `false` |
| `hideTooltip`     | Whether the tooltip should not be displayed.                                                                                       | `boolean` | `false` |
| `noKeyboard`      | Prevents seeking forward/backward by using the Left/Right arrow keys.                                                              | `boolean` | `false` |

## CSS Custom Properties

| Name                                 | Description                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------- |
| `--vm-scrubber-buffered-bg`          | The background color of the section that indicates how much of the media has been buffered. |
| `--vm-scrubber-loading-stripe-color` | The color of each candystripe displayed when media is buffering.                            |
| `--vm-scrubber-loading-stripe-size`  | The size of each candystripe displayed when media is buffering.                             |
| `--vm-scrubber-tooltip-spacing`      | The space between the tooltip and the scrubber.                                             |

## Dependencies

### Used by

- [vm-default-controls](./default-controls)

### Depends on

- [vm-slider](./../slider)
- [vm-tooltip](./../tooltip)
