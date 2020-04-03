# Tooltip

**Type:** `Component`

[View Source](../../../../vime-player/src/plugins/tooltips/Tooltip.svelte)

A tooltip is a small pop-up box that appears when a user moves their mouse over an element. Their main 
purpose is to provide the user with a description about that element.

## Props

### `id`

**Type:** `string|null` | **Default:** `null`

Reflects the `id` attribute of the root element.

### `title`

**Type:** `string|null` | **Default:** `null`

The content to be displayed inside the tooltip.

### `hint`

**Type:** `string|null` | **Default:** `null`

The hint is some optional text that provides more context.

### `isEnabled`

**Type:** `boolean` | **Default:** `true`

Whether to render the tooltip in the DOM or not.

### `isActive`

**Type:** `boolean` | **Default:** `false`

Whether to show or hide the tooltip.

### `showHint`

**Type:** `boolean` | **Default:** `true`

Whether to show or hide the `hint` text.

### `noBounding`

**Type:** `boolean` | **Default:** `false`

Whether the tooltip should stop checking if the its outside the players boundaries and 
changing direction of its content to stay inside.

## Methods

### `getEl`

**Return Type:** `HTMLElement`

The root HTML element of the tooltip instance.