---
title: Control
sidebar_label: Control
---

**Type:** `Component`

A `Control` is a button that the user taps or clicks to interact with the player.

:::caution
Don't confuse this with the [`Control`](./control-interface.md) interface.
:::

## Relationships

### Tooltips

If the [Tooltips](./../../tooltips/tooltips.md) plugin is available then the control will render a
tooltip and register it under the `label` prop value.

## Props

:::info
Any unlisted props are bound directly to the underlying `button` element. This is useful
for setting ARIA attributes.
:::

### `title`

**Type:** `string|null` | **Default:** `null`

The title of the tooltip (if available).

### `label`

**Type:** `string|null` | **Default:** `null`

The id to register the tooltip under (if available).

### `shouldRenderTooltip`

**Type:** `boolean` | **Default:** `true`

Whether to render a tooltip or not (if available).

### `large`

**Type:** `boolean` | **Default:** `false`

Whether to render a larger control or not.

## Methods

### `getEl`

**Return Type:** `<button>`

The [`button`][mdn-button] HTML element.

[mdn-button]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button

### `getTooltip`

**Return Type:** `Tooltip|undefined`

The rendered [`Tooltip`](./../../tooltips/tooltip.md) instance.

## Events

### `click`

**Data Type:** [`Event`][mdn-event]

Fired when the button is clicked.

[mdn-event]: https://developer.mozilla.org/en-US/docs/Web/API/Event

### `keydown`

**Data Type:** [`Event`][mdn-event]

Fired when the button is focused and a key is pressed down.

### `focuschange`

**Data Type:** `boolean` (Whether the control is focused or not)

Fired when the button's focused state changes.
