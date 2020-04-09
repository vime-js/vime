# ToggleControl

**Type:** `Component`

A [`Control`](./control.md) which toggles between an active and inactive state when clicked.

## Props

{% hint style="info" %}
Any unlisted props are passed to the underlying [`Control`](./control.md) instance.
{% endhint %}

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

## Methods

### `getControl`

**Return Type:** [`Control`](./control.md)

The underlying `Control` instance.

## Events

### Control

Forwards all `Control` [events](./control.md#events).
