# Menu

**Type:** `Component`

[View Source](../../../../../vime-complete/src/plugins/settings/menu/Menu.svelte)

A menu is a container for a list of choices. A choice is an interactable that performs some action. 
It is represented in the DOM as a `button` with a role of `menuitem` or `menuitemradio`. Choices can 
be grouped together by nesting menus, hence creating [submenus](./submenu/submenu.md).

{% hint style="info" %}
The main children of this component are the [`MenuItem`](./menu-item.md) and [`MenuOptions`](./menu-options.md) components
{% endhint %}

## Props

### `isActive`

**Type:** `boolean` | **Default:** `false`

Whether the menu is visible or not.

## Methods

### `getEl`

**Return Type:** `HTMLElement`

The root HTML element of the component. 

### `getChoices`

**Return Type:** `<button>[]`

List of currently available choices which are updated everytime the menu is opened.

### `getFocusedChoice`

**Return Type:** `<button>|undefined`

The currently focused choice.

{% hint style="info" %}
A choice is focused when the menu is interacted with via a keyboard.
{% endhint %}

### `getFocusedChoiceIndex`

**Return Type:** `int`

The index of the currently focused choice. If it is `-1` the no choice is currently focused.

{% hint style="info" %}
A choice is focused when the menu is interacted with via a keyboard.
{% endhint %}

### `getSubmenu`

**Parameters:** `(choice: <button>)` | **Return Type:** `HTMLElement|null`

The menu element associated with the given `choice`.

### `focus`

Sets browser focus on the menu.

### `focusChoice`

**Parameters:** `(index: int)`

Sets browser focus on the choice at the given `index`.

### `focusController`

Sets browser focus on the menu controller. The controller is the DOM element with an `id` matching
the `aria-labelledby` property.

## Events

### `open`

**Data Type:** `undefined`

Fired when the menu becomes visible.

### `close`

**Data Type:** `undefined`

Fired when the menu becomes hidden.

### `click`

**Data Type:** [`Event`][mdn-event]

Fired when the menu is clicked.

[mdn-event]: https://developer.mozilla.org/en-US/docs/Web/API/Event

### `keydown`

**Data Type:** [`Event`][mdn-event]

Fired when the menu is focused and a key is pressed down.
