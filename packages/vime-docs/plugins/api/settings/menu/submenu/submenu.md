# Submenu

**Type:** `Component`

[View Source](../../../../../../vime-player/src/plugins/settings/menu/submenu/Submenu.svelte)

A menu that is to be nested inside a more general menu.

## Props

### `title`

**Type:** `string|null` | **Default:** `null`

The title of the menu.

### `hint`

**Type:** `string|null` | **Default:** `null`

Optional text used to provide more information when the menu isn't open.

### `isActive`

**Type:** `boolean` | **Default:** `false`

Whether the menu is visible or not.

### `isEnabled`

**Type:** `boolean` | **Default:** `true`

Whether the menu and controller should be rendered in the DOM or not.

### `isLocked`

**Type:** `boolean` | **Default:** `false`

Whether the menu is rendered or not. The menu controller responsible for opening/closing the 
submenu is visible.

### `hideController`

**Type:** `boolean` | **Default:** `false`

Whether to hide the menu controller or not.

## Methods

### `getId`

**Return Type:** `string`

An auto-generated id for the menu element in the form `v-submenu-{count}`. This is to distinguish
between multiple submenus on the same page.

### `getControllerId`

**Return Type:** `string`

An auto-generated id for the menu controller in the form `v-submenu-control-{count}`.

### `getMenu`

**Return Type:** [`Menu`](../menu.md)

The underlying `Menu` instance.

### `getDivider`

**Return Type:** `HTMLElement`

The HTML element for the divider which is used to visually seperate the menu controller and the menu.

## Events

### `open`

**Data Type:** `undefined`

Fired when the menu becomes visible.

### `close`

**Data Type:** `undefined`

Fired when the menu becomes hidden.