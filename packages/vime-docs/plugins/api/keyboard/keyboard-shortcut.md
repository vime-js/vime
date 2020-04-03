# KeyboardShortcut

**Type:** `interface`

## Props

### `hint`

**Type:** `string`

Text that helps the user understand what key to press to use this shortcut.

### `keys` 

**Type:** `int[]`

The [JS key codes][js-keycodes] to listen to.

[js-keycodes]: https://keycode.info

### `action` 

**Type:** `() => void`

A callback to call when the key is pressed.