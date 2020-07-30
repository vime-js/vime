# vime-volume-control

A control for adjusting the volume of the player and toggling the muted state.

## Example

```html
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-controls>
      <vime-volume-control></vime-volume-control>
    </vime-controls>
  </vime-ui>
<vime-player>
```

<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description                                                                                                                                                             | Type                             | Default               |
| ------------------ | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | --------------------- |
| `hideTooltip`      | `hide-tooltip`       | Whether the tooltip should be hidden.                                                                                                                                   | `boolean`                        | `false`               |
| `highVolumeIcon`   | `high-volume-icon`   | The URL to an SVG element or fragment.                                                                                                                                  | `string`                         | `'#vime-volume-high'` |
| `lowVolumeIcon`    | `low-volume-icon`    | The URL to an SVG element or fragment.                                                                                                                                  | `string`                         | `'#vime-volume-low'`  |
| `muteKeyCodes`     | `mute-key-codes`     | A pipe (`\|`) seperated string of JS key codes, that when caught in a `keydown` event, will toggle the muted state of the player.                                       | `string \| undefined`            | `'77'`                |
| `muteKeyboardHint` | `mute-keyboard-hint` | If the `keyCodes` prop is provided, this prop can provide a hint to the user inside the control tooltip, on what key presses will toggle the muted state of the player. | `string \| undefined`            | `'(m)'`               |
| `mutedIcon`        | `muted-icon`         | The URL to an SVG element or fragment.                                                                                                                                  | `string`                         | `'#vime-volume-mute'` |
| `noKeyboard`       | `no-keyboard`        | Prevents the volume being changed using the Up/Down arrow keys.                                                                                                         | `boolean`                        | `false`               |
| `tooltipDirection` | `tooltip-direction`  | The direction in which the tooltip should grow.                                                                                                                         | `"left" \| "right" \| undefined` | `undefined`           |


## Dependencies

### Used by

 - [vime-default-controls](../default-controls)

### Depends on

- [vime-mute-control](../mute-control)
- [vime-slider](../../slider)

### Graph
```mermaid
graph TD;
  vime-volume-control --> vime-mute-control
  vime-volume-control --> vime-slider
  vime-mute-control --> vime-control
  vime-mute-control --> vime-icon
  vime-mute-control --> vime-tooltip
  vime-default-controls --> vime-volume-control
  style vime-volume-control fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
