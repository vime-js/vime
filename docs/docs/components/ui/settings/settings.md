---
title: vm-settings
sidebar_label: Settings
---

A container for a collection of submenus and options for the player. On desktop, the settings is
displayed as a small popup menu (scroll appears if `height >= maxHeight`) on the bottom right-hand
side of a video player, or slightly above the right-hand side of an audio player. On mobile,
the settings is displayed as a [bottom sheet](https://material.io/components/sheets-bottom).

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/settings/settings/settings.png"
  alt="Vime settings component"
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
    <vm-settings>
      <!-- ... -->
    </vm-settings>
  </vm-ui>
</vm-player>
```

</TabItem>

<TabItem value="react">

```tsx {2,10}
import React from 'react';
import { Player, Ui, Settings } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Settings>{/* ... */}</Settings>
      </Ui>
    </Player>
  );
}
```

</TabItem>

<TabItem value="vue">

```html {6-8,14,20} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Settings>
        <!-- ... -->
      </Settings>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Settings } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Settings,
    },
  };
</script>
```

</TabItem>

<TabItem value="svelte">

```html {5-7,12} title="example.svelte"
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <Settings>
      <!-- ... -->
    </Settings>
  </Ui>
</Player>

<script lang="ts">
  import { Player, Ui, Settings } from '@vime/svelte';
</script>
```

</TabItem>

<TabItem value="stencil">

```tsx {8}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-settings>{/* ... */}</vm-settings>
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
    <vm-settings>
      <!-- ... -->
    </vm-settings>
  </vm-ui>
</vm-player>
```

</TabItem>
</Tabs>

## Properties

| Property | Description                                                                                                                                                                                | Type                                                    | Default         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | --------------- |
| `active` | Whether the settings menu is opened/closed.                                                                                                                                                | `boolean`                                               | `false`         |
| `pin`    | Pins the settings to the defined position inside the video player. This has no effect when the view is of type `audio` (always `bottomRight`) and on mobile devices (always bottom sheet). | `"bottomLeft" ∣ "bottomRight" ∣ "topLeft" ∣ "topRight"` | `'bottomRight'` |

## Methods

| Method          | Description                                                             | Signature                                                        |
| --------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `setController` | Sets the controller responsible for opening/closing this settings menu. | `setController(controller: SettingsController) => Promise<void>` |

## Slots

| Slot | Description                                                                     |
| ---- | ------------------------------------------------------------------------------- |
|      | Used to pass in the body of the settings menu, which usually contains submenus. |

## CSS Custom Properties

| Name                               | Description                                     |
| ---------------------------------- | ----------------------------------------------- |
| `--vm-settings-border-radius`      | The border radius of the settings menu.         |
| `--vm-settings-max-height`         | The max height of the settings menu.            |
| `--vm-settings-padding`            | The padding inside the settings menu.           |
| `--vm-settings-scroll-thumb-color` | The color of the settings scrollbar thumb.      |
| `--vm-settings-scroll-track-color` | The color of the settings scrollbar track.      |
| `--vm-settings-scroll-width`       | The width of the settings scrollbar.            |
| `--vm-settings-shadow`             | The shadow cast around the settings menu frame. |
| `--vm-settings-transition`         | The CSS transitions for the settings menu.      |
| `--vm-settings-width`              | The width of the settings menu on desktop.      |

## Dependencies

### Used by

- [vm-default-settings](./default-settings)

### Depends on

- [vm-menu](./menu)
