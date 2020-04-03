# MenuOptions

**Type:** `Component`

[View Source](../../../../../vime-player/src/plugins/settings/menu/MenuOptions.svelte)

Groups and renders [`MenuItemRadio`](./menu-item-radio.md) components.

## Props

### `group`

**Type:** `any` | **Default:** `undefined`

The value of the currently selected radio button.

### `options`

**Type:** `any[]` | **Default:** `[]`

List of objects, where each `object` is a set of `MenuItemRadio` [props](./menu-item.md#props).

## Methods

### `getRadios`

**Return Type:** `MenuItemRadio[]`

The rendered [`MenuItemRadio`](./menu-item-radio.md) instances.

## Events

### `valuechange`

**Data Type:** `any`

Fired when a radio button is clicked. The event data contains the radio's respective value.