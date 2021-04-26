---
title: vm-menu
sidebar_label: Menu
---

This component is responsible for containing and managing menu items and submenus. The menu is ARIA
friendly by ensuring the correct ARIA properties are set, and enabling keyboard navigation when it
is focused.

You can use this component if you'd like to build out a custom settings menu. If you're looking
to only customize the content of the settings see [`vime-settings`](settings.md), and if
you want an easier starting point see [`vime-default-settings`](default-settings.md).

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/settings/menu/menu.png"
  alt="Vime settings menu component"
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
    <vm-menu identifer="menu-id" controller="menu-controller-id" active>
      <!-- ... -->
    </vm-menu>
  </vm-ui>
</vm-player>
```


</TabItem>

<TabItem value="react">

```tsx {2,20-28}
import React, { useState } from "react";
import { Player, Ui, Menu } from "@vime/react";

function Example() {
  const [isMenuActive, setIsMenuActive] = useState(false);

  const onOpen = () => {
    setIsMenuActive(true);
  };

  const onClose = () => {
    setIsMenuActive(false);
  };

  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Menu
          identifer="menu-id"
          controller="menu-controller-id"
          active={isMenuActive}
          onVmOpen={onOpen}
          onVmClose={onClose}
        >
          <!-- ... -->
        </Menu>
      </Ui>
    </Player>
  );
}
```


</TabItem>

<TabItem value="vue">

```html {6-14,20,26} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <menu
        identifer="menu-id"
        controller="menu-controller-id"
        :active="isMenuActive"
        @vmOpen="onOpen"
        @vmClose="onClose"
      >
        <!-- ... -->
      </menu>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Menu } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Menu,
    },
    data: {
      isMenuActive: false,
    },
    methods: {
      onOpen() {
        this.isMenuActive = true;
      },

      onClose() {
        this.isMenuActive = false;
      },
    },
  };
</script>
```


</TabItem>

<TabItem value="svelte">

```tsx {5-13}
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <Menu
      identifer="menu-id"
      controller="menu-controller-id"
      active={isMenuActive}
      on:vmOpen={onOpen}
      on:vmClose={onClose}
    >
      <!-- ... -->
    </Menu>
  </Ui>
</Player>
```

```html {2}
<script lang="ts">
  import { Player, Ui, Menu } from '@vime/svelte';

  let isMenuActive = false;

  const onOpen = () => {
    isMenuActive = true;
  };

  const onClose = () => {
    isMenuActive = false;
  };
</script>
```


</TabItem>

<TabItem value="stencil">

```tsx {18-26}
class Example {
  @State() isMenuActive = false;

  private onOpen() {
    this.isMenuActive = true;
  }

  private onClose() {
    this.isMenuActive = false;
  }

  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-menu
            identifer="menu-id"
            controller="menu-controller-id"
            active={this.isMenuActive}
            onVmOpen={this.onOpen.bind(this)}
            onVmClose={this.onClose.bind(this)}
          >
            {/* ... */}
          </vm-menu>
        </vm-ui>
      </vm-player>
    );
  }
}
```


</TabItem>

<TabItem value="angular">

```html {5-13} title="example.html"
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-menu
      identifer="menu-id"
      controller="menu-controller-id"
      [active]="isMenuActive"
      (vmOpen)="onOpen()"
      (vmClose)="onClose()"
    >
      <!-- ... -->
    </vm-menu>
  </vm-ui>
</vm-player>
```

```ts title="example.ts"
class Example {
  isMenuActive = false;

  onOpen() {
    this.isMenuActive = true;
  }

  onClose() {
    this.isMenuActive = false;
  }
}
```


</TabItem>
</Tabs>


## Properties

| Property                  | Description                                                                                | Type                           | Default     |
| ------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------ | ----------- |
| `active`                  | Whether the menu is open/visible.                                                          | `boolean`                      | `false`     |
| `controller`              | Reference to the controller DOM element that is responsible for opening/closing this menu. | `HTMLElement ∣ undefined`      | `undefined` |
| `identifier` _(required)_ | The `id` attribute of the menu.                                                            | `string`                       | `undefined` |
| `slideInDirection`        | The direction the menu should slide in from.                                               | `"left" ∣ "right" ∣ undefined` | `undefined` |


## Methods

| Method              | Description                                                       | Signature                                                                      |
| ------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `blurMenu`          | Removes focus from the menu.                                      | `blurMenu() => Promise<void>`                                                  |
| `calculateHeight`   | Calculates the height of the settings menu based on its children. | `calculateHeight() => Promise<number>`                                         |
| `focusMenu`         | Focuses the menu.                                                 | `focusMenu() => Promise<void>`                                                 |
| `getActiveMenuItem` | Returns the currently focused menu item.                          | `getActiveMenuItem() => Promise<HTMLVmMenuItemElement ∣ undefined>`            |
| `setActiveMenuItem` | Sets the currently focused menu item.                             | `setActiveMenuItem(item?: HTMLVmMenuItemElement ∣ undefined) => Promise<void>` |


## Events

| Event                    | Description                                           | Type                                             |
| ------------------------ | ----------------------------------------------------- | ------------------------------------------------ |
| `vmActiveMenuItemChange` | Emitted when the currently focused menu item changes. | `CustomEvent<HTMLVmMenuItemElement ∣ undefined>` |
| `vmActiveSubmenuChange`  | Emitted when the active submenu changes.              | `CustomEvent<HTMLVmSubmenuElement ∣ undefined>`  |
| `vmBlur`                 | Emitted when the menu loses focus.                    | `CustomEvent<void>`                              |
| `vmClose`                | Emitted when the menu has closed/is not active.       | `CustomEvent<HTMLVmMenuElement>`                 |
| `vmFocus`                | Emitted when the menu is focused.                     | `CustomEvent<void>`                              |
| `vmMenuHeightChange`     | Emitted when the height of the menu changes.          | `CustomEvent<number>`                            |
| `vmOpen`                 | Emitted when the menu is open/active.                 | `CustomEvent<HTMLVmMenuElement>`                 |


## Slots

| Slot | Description                                                                                           |
| ---- | ----------------------------------------------------------------------------------------------------- |
|      | Used to pass in the body of the menu which usually contains menu items, radio groups and/or submenus. |


## CSS Custom Properties

| Name                    | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| `--vm-menu-bg`          | The background color the menu.                         |
| `--vm-menu-color`       | The text color within the menu.                        |
| `--vm-menu-font-size`   | The font size of text within the menu.                 |
| `--vm-menu-font-weight` | The font weight of text within the menu.               |
| `--vm-menu-transition`  | The CSS transitions applied to the menu.               |
| `--vm-menu-z-index`     | The position in the UI z-axis stack inside the player. |


## Dependencies

### Used by

 - [vm-settings](./settings)
 - [vm-submenu](./submenu)


