# vime-scrubber-control

A control that displays the progression of playback and the amount buffered on a horizontal timeline.
The timeline is a slider (`input[type="range"]`) that can be used to change the current playback time.

If the player is buffering, the scrubber will display an animated candystripe in the porition of the
timeline that has not buffered.

## Example

```html {6}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-controls>
      <vime-scrubber-control></vime-scrubber-control>
    </vime-controls>
  </vime-ui>
</vime-player>
```

<!-- Auto Generated Below -->

## Properties

| Property          | Attribute           | Description                                                                                                                        | Type      | Default |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `alwaysShowHours` | `always-show-hours` | Whether the timestamp in the tooltip should show the hours unit, even if the time is less than 1 hour (eg: `20:35` -> `00:20:35`). | `boolean` | `false` |
| `hideTooltip`     | `hide-tooltip`      | Whether the tooltip should not be displayed.                                                                                       | `boolean` | `false` |
| `noKeyboard`      | `no-keyboard`       | Prevents seeking forward/backward by using the Left/Right arrow keys.                                                              | `boolean` | `false` |

## CSS Custom Properties

| Name                              | Description                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `--scrubber-buffered-bg`          | The background color of the section that indicates how much of the media has been buffered. |
| `--scrubber-loading-stripe-color` | The color of each candystripe displayed when media is buffering.                            |
| `--scrubber-loading-stripe-size`  | The size of each candystripe displayed when media is buffering.                             |

## Dependencies

### Used by

- [vime-default-controls](../default-controls)

### Depends on

- [vime-slider](../../slider)
- [vime-tooltip](../../tooltip)

### Graph

```mermaid
graph TD;
  vime-scrubber-control --> vime-slider
  vime-scrubber-control --> vime-tooltip
  vime-default-controls --> vime-scrubber-control
  style vime-scrubber-control fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
