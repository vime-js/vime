---
title: Preview API
sidebar_label: API
---

## Props

### `src`

**Type:** `string|null` | **Default:** `null`

Used to locate a media resource.

:::info
See our [guide](../guides/loading-media.md) on how to set this prop.
:::

### `poster`

**Type:** `string|null` | **Default:** `null`

The URL of a custom poster to load. This will override the poster loaded from the `src`.

### `aspectRatio`

**Type:** `string|null` | **Default:** `16:9`

The aspect ratio of the preview expressed as `width:height`.

### `showPlayIcon`

**Type:** `boolean` | **Default:** `false`

Whether to show a play icon in the center of the preview.

### `playIconScale`

**Type:** `double` | **Default:** `2`

Resizes the play icon based on the amount of scaling given.

### `isEnabled`

**Type:** `boolean` | **Default:** `true`

Whether to show or hide the preview. When hidden it is removed from the DOM.

## Methods

### `getNativePoster`

**Return Type:** `string|null`

The URL for the poster of the current `src`. If `poster` is set before setting `src` then this will return `null`.

## Events

```js
// Start listening.
const off = preview.$on("someEvent", e => {
  const data = e.detail;
});

// Stop listening.
off();
```

### `loading`

**Data Type:** `boolean`

Fires `true` when the poster begins loading, and `false` when it has loaded.

### `posterchange`

**Data Type:** `string|null`

Fires when the currently visible poster is changed.
