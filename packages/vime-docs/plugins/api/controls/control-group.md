# ControlGroup

**Type:** `Component`

[View Source](../../../../vime-player/src/plugins/controls/ControlGroup.svelte)

Manages rendering and laying out a group of [controls](control/control-interface). The layout is 
managed via [CSS Flexbox][css-flexbox] properties.

[css-flexbox]: https://css-tricks.com/snippets/css/a-guide-to-flexbox/

## Props

### `controls`

**Type:** `Control[]` | **Defaut:** `[]`

Collection of [controls](control/control-interface.md) to be rendered and registered.

### `isEnabled`

**Type:** `boolean` | **Defaut:** `true`

Whether the group should be rendered into the DOM or not.

### `isActive`

**Type:** `boolean` | **Defaut:** `false`

Whether the group is visible or not.

### `shouldFill`

**Type:** `boolean` | **Defaut:** `false`

Whether the group should take up all available space in its container by setting `flex: 1` on the 
root component element.

### `flow`

**Type:** `string|null` | **Defaut:** `null`

Sets the `flex-flow` CSS property of the group (see [W3 Schools - flex-flow property][css-flex-flow]. 
By default the `flex-flow` is `row wrap`.

[css-flex-flow]: https://www.w3schools.com/cssref/css3_pr_flex-flow.asp

### `position`

**Type:** `string|null` | **Defaut:** `null`

Sets the `align-items` and `justify-content` CSS properties of the group. This property is written 
as `(align-items):(justify-content)`. For example, `flex-center:flex-start`.

## Methods

### `getEl`

**Return Type:** `HTMLElement`

The root HTML element of the component.

### `hasControls`

**Return Type:** `boolean`

Whether the group has any controls or not.

### `reset`

Reset all props to their default values.

### `getInstances`

**Return Type:** `{ [id]: Component }`

The rendered control instances.