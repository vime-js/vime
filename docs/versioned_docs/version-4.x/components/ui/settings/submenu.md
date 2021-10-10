---
title: vime-submenu
sidebar_label: Submenu
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

A menu that is to be nested inside another menu. A submenu is closed by default and it provides a
menu item that will open/close it. It's main purpose is to organize a menu by grouping related
sections/options together that can be navigated to by the user.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/main/packages/core/src/components/ui/settings/submenu/submenu.png"
  alt="Vime submenu component"
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

```html {6-8}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-settings>
      <vime-submenu label="Title">
        <!-- ... -->
      </vime-submenu>
    </vime-settings>
  </vime-ui>
</vime-player>
```

</TabItem>

<TabItem value="react">

```tsx {2,11}
import React from 'react';
import { VimePlayer, VimeUi, VimeSettings, VimeSubmenu } from '@vime/react';

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeSettings>
          <VimeSubmenu label="Title">{/* ... */}</VimeSubmenu>
        </VimeSettings>
      </VimeUi>
    </VimePlayer>
  );
}
```

</TabItem>

<TabItem value="vue">

```html {7-9,16,23} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeSettings>
        <VimeSubmenu label="Title">
          <!-- ... -->
        </VimeSubmenu>
      </VimeSettings>
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeSettings, VimeSubmenu } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeSettings,
      VimeSubmenu,
    },
  };
</script>
```

</TabItem>

<TabItem value="svelte">

```html {6-8,18} title="example.svelte"
<VimePlayer>
  <!-- ... -->
  <VimeUi>
    <!-- ... -->
    <VimeSettings>
      <VimeSubmenu label="Title">
        <!-- ... -->
      </VimeSubmenu>
    </VimeSettings>
  </VimeUi>
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeUi, VimeSettings, VimeSubmenu } from '@vime/svelte';
</script>
```

</TabItem>

<TabItem value="stencil">

```tsx {8-10}
class Example {
  render() {
    return (
      <vime-player>
        {/* ... */}
        <vime-ui>
          {/* ... */}
          <vime-settings>
            <vime-submenu label="Title">{/* ... */}</vime-submenu>
          </vime-settings>
        </vime-ui>
      </vime-player>
    );
  }
}
```

</TabItem>

<TabItem value="angular">

```html {6-8} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-settings>
      <vime-submenu label="Title">
        <!-- ... -->
      </vime-submenu>
    </vime-settings>
  </vime-ui>
</vime-player>
```

</TabItem>
    
</Tabs>

## Properties

| Property             | Attribute | Description                                                                                                                                                                     | Type                 | Default     |
| -------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------- |
| `active`             | `active`  | Whether the submenu is open/closed.                                                                                                                                             | `boolean`            | `false`     |
| `hidden`             | `hidden`  | Whether the submenu should be displayed or not.                                                                                                                                 | `boolean`            | `false`     |
| `hint`               | `hint`    | This can provide additional context about the current state of the submenu. For example, the hint could be the currently selected option if the submenu contains a radio group. | `string ∣ undefined` | `undefined` |
| `label` _(required)_ | `label`   | The title of the submenu.                                                                                                                                                       | `string`             | `undefined` |

## Slots

| Slot | Description                                                                                                                       |
| ---- | --------------------------------------------------------------------------------------------------------------------------------- |
|      | Used to pass in the body of the submenu which is usually a set of choices in the form of a radio group (`vime-menu-radio-group`). |

## Dependencies

### Used by

- [vime-default-settings](default-settings.md)

### Depends on

- [vime-menu-item](menu-item.md)
- [vime-menu](menu.md)

### Graph

```mermaid
graph TD;
  vime-submenu --> vime-menu-item
  vime-submenu --> vime-menu
  vime-menu-item --> vime-icon
  vime-default-settings --> vime-submenu
  style vime-submenu fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
