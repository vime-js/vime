# vime-menu

This component is responsible for containing and managing menu items and submenus. The menu is ARIA
friendly by ensuring the correct ARIA properties are set, and enabling keyboard navigation when it
is focused.

You can use this component if you'd like to build out a custom settings menu. If you're looking
to only customize the content of the settings see [`vime-settings`](../settings/readme.md), and if
you want an easier starting point see [`vime-default-settings`](../default-settings/readme.md).

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/settings/menu/menu.png"
  alt="Vime settings menu component"
/>

<!-- Auto Generated Below -->

## Usage

### Angular

```html {5-11} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-menu
      identifer="menu-id"
      controller="menu-controller-id"
      [active]="isMenuActive"
    >
      <!-- ... -->
    </vime-menu>
  </vime-ui>
</vime-player>
```

```ts title="example.ts"
class Example {
  isMenuActive = false;

  // ...
}
```

### Html

```html {5-7}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-menu identifer="menu-id" controller="menu-controller-id" active>
      <!-- ... -->
    </vime-menu>
  </vime-ui>
</vime-player>
```

### React

```tsx {2,12-18}
import React, { useState } from "react";
import { VimePlayer, VimeUi, VimeMenu } from "@vime/react";

function Example() {
  const [isMenuActive, setIsMenuActive] = useState(false);

  return render(
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeMenu
          identifer="menu-id"
          controller="menu-controller-id"
          active={isMenuActive}
        >
          <!-- ... -->
        </VimeMenu>
      </VimeUi>
    </VimePlayer>
  );
}
```

### Vue

```html {6-12,18,24} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeMenu
        identifer="menu-id"
        controller="menu-controller-id"
        :active="isMenuActive"
      >
        <!-- ... -->
      </VimeMenu>
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeMenu } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeMenu,
    },

    data: {
      isMenuActive: false,
    },
  };
</script>
```

## Properties

| Property                  | Attribute    | Description                                                                        | Type      | Default     |
| ------------------------- | ------------ | ---------------------------------------------------------------------------------- | --------- | ----------- |
| `active`                  | `active`     | Whether the menu is open/visible.                                                  | `boolean` | `false`     |
| `controller` _(required)_ | `controller` | The `id` attribute value of the control responsible for opening/closing this menu. | `string`  | `undefined` |
| `identifier` _(required)_ | `identifier` | The `id` attribute of the menu.                                                    | `string`  | `undefined` |

## Events

| Event                  | Description                                           | Type                                                            |
| ---------------------- | ----------------------------------------------------- | --------------------------------------------------------------- |
| `vClose`               | Emitted when the menu has closed/is not active.       | `CustomEvent<void>`                                             |
| `vFocusMenuItemChange` | Emitted when the currently focused menu item changes. | `CustomEvent<HTMLVimeMenuItemElement \| undefined>`             |
| `vMenuItemsChange`     | Emitted when the menu items present changes.          | `CustomEvent<NodeListOf<HTMLVimeMenuItemElement> \| undefined>` |
| `vOpen`                | Emitted when the menu is open/active.                 | `CustomEvent<void>`                                             |

## Methods

### `focusOnOpen() => Promise<void>`

This should be called directly before opening the menu to set the keyboard focus on it. This
is a one-time operation and needs to be called everytime prior to opening the menu.

#### Returns

Type: `Promise<void>`

### `getController() => Promise<HTMLElement>`

Returns the controller responsible for opening/closing this menu.

#### Returns

Type: `Promise<HTMLElement>`

### `getFocusedMenuItem() => Promise<HTMLVimeMenuItemElement>`

Returns the currently focused menu item.

#### Returns

Type: `Promise<HTMLVimeMenuItemElement>`

## Slots

| Slot | Description                                                                                           |
| ---- | ----------------------------------------------------------------------------------------------------- |
|      | Used to pass in the body of the menu which usually contains menu items, radio groups and/or submenus. |

## CSS Custom Properties

| Name                 | Description                              |
| -------------------- | ---------------------------------------- |
| `--menu-bg`          | The background color the menu.           |
| `--menu-color`       | The text color within the menu.          |
| `--menu-font-size`   | The font size of text within the menu.   |
| `--menu-font-weight` | The font weight of text within the menu. |

## Dependencies

### Used by

- [vime-settings](../settings)
- [vime-submenu](../submenu)

### Graph

```mermaid
graph TD;
  vime-settings --> vime-menu
  vime-submenu --> vime-menu
  style vime-menu fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
