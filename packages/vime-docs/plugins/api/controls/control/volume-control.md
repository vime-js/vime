 # VolumeControl

**ID:** `vVolumeControl` | **LABEL:** `adjustVolume` | **Type:** [`Control`](./control-interface.md)

A control that adjusts the volume level of the player.

## Methods

### `getEl`

**Return Type:** `HTMLElement`

The root HTML element of the component.

### `getSlider(): <input type="range">`

**Return Type:** `<input type="range">`

The [input range slider][mdn-input-range] that controls the `volume` of the player.

[mdn-input-range]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range

### `getMuteControl`

**Return Type:** [`MuteControl`](./mute-control.md)

The underlying `MuteControl` instance.