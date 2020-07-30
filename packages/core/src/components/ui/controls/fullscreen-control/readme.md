# vime-fullscreen-control

A control for toggling fullscreen mode. This control is not displayed if fullscreen cannot be 
requested (checked via the `canSetFullscreen()` player method).

## Example

```html
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-controls>
      <vime-fullscreen-control></vime-fullscreen-control>
    </vime-controls>
  </vime-ui>
<vime-player>
```

<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description                                                                                                                                          | Type                             | Default                    |
| ------------------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------- |
| `enterIcon`        | `enter-icon`        | The URL to an SVG element or fragment to display for entering fullscreen.                                                                            | `string`                         | `'#vime-enter-fullscreen'` |
| `exitIcon`         | `exit-icon`         | The URL to an SVG element or fragment to display for exiting fullscreen.                                                                             | `string`                         | `'#vime-exit-fullscreen'`  |
| `hideTooltip`      | `hide-tooltip`      | Whether the tooltip should not be displayed.                                                                                                         | `boolean`                        | `false`                    |
| `keyCodes`         | `key-codes`         | A pipe (`\|`) seperated string of JS key codes, that when caught in a `keydown` event, will trigger a `click` event on the control.                  | `string \| undefined`            | `'70'`                     |
| `keyboardHint`     | `keyboard-hint`     | If the `keyCodes` prop is provided, this prop can provide a hint to the user inside the tooltip for what keys can be pressed to trigger the control. | `string \| undefined`            | `'(f)'`                    |
| `tooltipDirection` | `tooltip-direction` | The direction in which the tooltip should grow.                                                                                                      | `"left" \| "right" \| undefined` | `undefined`                |


## Dependencies

### Used by

 - [vime-default-controls](../default-controls)

### Depends on

- [vime-control](../control)
- [vime-icon](../../icon)
- [vime-tooltip](../../tooltip)

### Graph
```mermaid
graph TD;
  vime-fullscreen-control --> vime-control
  vime-fullscreen-control --> vime-icon
  vime-fullscreen-control --> vime-tooltip
  vime-default-controls --> vime-fullscreen-control
  style vime-fullscreen-control fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
