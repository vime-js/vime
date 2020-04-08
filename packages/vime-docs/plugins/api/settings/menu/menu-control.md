# MenuControl

**Type:** `Component`

[View Source](../../../../../vime-complete/src/plugins/settings/menu/MenuControl.svelte)

A button to be used inside a menu. The button is styled based on its ARIA role and state. It's used
as the base for the [`MenuItem`](./menu-item.md) and [`MenuItemRadio`](./menu-item-radio.md) components.

## Props

{% hint style="info" %}
Any unlisted props are bound directly to the underlying `button` element. This is useful for setting ARIA attributes.
{% endhint %}

### `title`

**Type:** `string` | **Default:** `''`

The title of the control.

### `hint`

**Type:** `string|null` | **Default:** `null`

Optional text used to provide more information to the user about the control.

### `badge`

**Type:** `string|null` | **Default:** `null`

Optional text placed inside a small colored box which provides more information to the user about the control.

## Events

### `click`

**Data Type:** [`Event`][mdn-event]

Fired when the button is clicked.

[mdn-event]: https://developer.mozilla.org/en-US/docs/Web/API/Event
