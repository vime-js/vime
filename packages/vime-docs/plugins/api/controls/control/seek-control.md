# SeekControl

**Type:** `Component`

[View Source](../../../../../vime-player/src/plugins/controls/control/SeekControl.svelte)

A control that enables the user to seek to a new time. It works by having a base value (+/-) and multiplying
it for each press by the user. If the base is 10 seconds, after 3 presses it would seek forward 30 seconds.
If the base was -10 seconds, then it would seek backwards 30 seconds.

## Props

### `base`

**Type:** `int` | **Default:** `0`

The base amount to multiply by on each press. If the number is positive it will seek forward, and if its negative
it will seek backward.

### `isEnabled`

**Type:** `boolean` | **Default:** `true`

Whether to render the control in the DOM or not.

### `isActive`

**Type:** `boolean` | **Default:** `false`

Whether the control is visible or not.

## Methods

### `getEl`

**Return Type:** `HTMLElement`

The root component HTML element.

### `getControl`

**Return Type:** [`Control`](./control.md)

The underlying `Control` instance.
