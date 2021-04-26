---
title: ScrubberControl
sidebar_label: ScrubberControl
---

**ID:** `vScrubberControl` | **LABEL:** `seek` | **Type:** [`Control`](./control-interface.md)

A control that displays the progress of playback and the amount buffered. It also enables
the user to seek to a new time.

## Relationships

### Tooltips

If the [Tooltips](../../tooltips/tooltips.md) plugin is available then the control will render a tooltip
and register it under its `LABEL`. The tooltip displays the time the user's mouse pointer is hovering over on the scrubber.

## Methods

### `getEl()`

**Return Type:** `HTMLElement`

The root HTML element of the component.

### `getSlider()`

**Return Type:** `<input type="range">`

The [input range slider][mdn-input-range] that is used to seek to a new time.

[mdn-input-range]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range

### `getTooltip`

**Return Type:** `Tooltip|undefined`

The rendered [`Tooltip`](../../tooltips/tooltip.md) instance (if the Tooltips plugin is available).

### `getProgressBar`

**Return Type:** `<progress>`

The [progress indicator element][mdn-progress] that is used to show the amount buffered and when the player is buffering.

[mdn-progress]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress
