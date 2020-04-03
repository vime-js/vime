# ToggleControl

**Type:** `Component`

A [`Control`](./control.md) which toggles between an active and inactive state when clicked.

## Props

### `label`

**Type:** `string|undefined` | **Default:** `undefined`

The `Control` [`label`](./control.md#label).

### `activeTitle`

**Type:** `string|undefined` | **Default:** `undefined`

The `Control` [`title`](./control.md#title) when the control is in an active state.

### `inactiveTitle`

**Type:** `string|undefined` | **Default:** `undefined`

The `Control` [`title`](./control.md#title) when the control is in an inactive state.

### `activeIcon`

**Type:** `string|undefined` | **Default:** `undefined`

The icon to use when the control is in an active state.

### `inactiveIcon`

**Type:** `string|undefined` | **Default:** `undefined`

The icon to use when the control is in an inactive state.

### `isEnabled`

**Type:** `boolean` | **Default:** `true`

Whether to render the control in the DOM or not.

### `isActive`

**Type:** `boolean` | **Default:** `false`

Whether the control is in an active state or not.

### `large`

**Type:** `boolean` | **Default:** `false`

Sets the `Control` [`large`](./control.md#large) property.

## Methods

### `getControl`

**Return Type:** [`Control`](./control.md)

The underlying `Control` instance.

## Events

### Control

Forwards all `Control` [events](./control.md#events).
