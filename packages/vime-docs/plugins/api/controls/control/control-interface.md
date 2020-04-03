# Control

**Type:** `interface`

This is used by the [`ControlGroup`](./../control-group.md) component to render and register controls.

{% hint style="warning" %}
Don't confuse this with the [`Control`](./control.md) component.
{% endhint %}

## Props

### `ID`

**Type:** `string|null`

The [`ControlGroup`](./../control-group.md) uses this string (if available) to register the rendered 
[`default`](#default) instance in it's registry.

### `LABEL`

**Type:** `string|null`

The label is an optional string that is passed to the Vime [`Control`](./control.md) component
if you're using it. The label is used as an `id` to register tooltips with.

### `default`

A Svelte component that accepts a `player` prop.

## Example

See our [`PlaybackControl`](./../../../../../vime-player/src/plugins/controls/control/PlaybackControl.svelte) 
as an example.

