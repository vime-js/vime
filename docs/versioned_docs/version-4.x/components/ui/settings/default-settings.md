---
title: vime-default-settings
sidebar_label: DefaultSettings
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

Creates a settings menu with options for changing the playback rate, quality and captions of
the current media. This component is provider aware. For example, it will only show options for
changing the playback rate if the current provider allows changing it (`player.canSetPlaybackRate()`).
In addition, you can extend the settings with more options via the default `slot`.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/main/packages/core/src/components/ui/settings/default-settings/default-settings.png"
  alt="Vime default settings component"
/>

<!-- Auto Generated Below -->

## Usage

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

```html {5}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-default-settings></vime-default-settings>
  </vime-ui>
</vime-player>
```

</TabItem>

<TabItem value="react">

```tsx {2,10}
import React from 'react';
import { VimePlayer, VimeUi, VimeDefaultSettings } from '@vime/react';

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeDefaultSettings />
      </VimeUi>
    </VimePlayer>
  );
}
```

</TabItem>

<TabItem value="vue">

```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeDefaultSettings />
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeDefaultSettings } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeDefaultSettings,
    },
  };
</script>
```

</TabItem>

<TabItem value="svelte">

```html {5,10} title="example.svelte"
<VimePlayer>
  <!-- ... -->
  <VimeUi>
    <!-- ... -->
    <VimeDefaultSettings />
  </VimeUi>
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeUi, VimeDefaultSettings } from '@vime/svelte';
</script>
```

</TabItem>

<TabItem value="stencil">

```tsx {8}
class Example {
  render() {
    return (
      <vime-player>
        {/* ... */}
        <vime-ui>
          {/* ... */}
          <vime-default-settings />
        </vime-ui>
      </vime-player>
    );
  }
}
```

</TabItem>

<TabItem value="angular">

```html {5} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-default-settings></vime-default-settings>
  </vime-ui>
</vime-player>
```

</TabItem>
    
</Tabs>

## Properties

| Property | Attribute | Description                                                                                                                                              | Type                                                    | Default         |
| -------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | --------------- |
| `pin`    | `pin`     | Pins the settings to the defined position inside the video player. This has no effect when the view is of type `audio`, it will always be `bottomRight`. | `"bottomLeft" ∣ "bottomRight" ∣ "topLeft" ∣ "topRight"` | `'bottomRight'` |

## Slots

| Slot | Description                                                                                        |
| ---- | -------------------------------------------------------------------------------------------------- |
|      | Used to extend the settings with additional menu options (see `vime-submenu` or `vime-menu-item`). |

## Dependencies

### Used by

- [vime-default-ui](../default-ui.md)

### Depends on

- [vime-menu-item](menu-item.md)
- [vime-menu-radio](menu-radio.md)
- [vime-submenu](submenu.md)
- [vime-menu-radio-group](menu-radio-group.md)
- [vime-settings](settings.md)

### Graph

```mermaid
graph TD;
  vime-default-settings --> vime-menu-item
  vime-default-settings --> vime-menu-radio
  vime-default-settings --> vime-submenu
  vime-default-settings --> vime-menu-radio-group
  vime-default-settings --> vime-settings
  vime-menu-item --> vime-icon
  vime-menu-radio --> vime-menu-item
  vime-submenu --> vime-menu-item
  vime-submenu --> vime-menu
  vime-settings --> vime-menu
  vime-default-ui --> vime-default-settings
  style vime-default-settings fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
