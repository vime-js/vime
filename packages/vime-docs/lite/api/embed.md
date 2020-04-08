# Embed

**Type:** `Component`

[View Source](../../../vime-lite/src/Embed.svelte)

Used to embed an external media player.

## Props

### `src`

**Type:** `string|null` | **Default:** `null`

Reflects the `src` attribute of the root `iframe`. It should contain a URL that will load the external player and media.

### `title`

**Type:** `string|null` | **Default:** `null`

Reflects the `title` attribute of the root `iframe`. It should contain the title of the current media.

### `params`

**Type:** `object` | **Default:** `{}`

The parameters to pass to the embedded player. These are encoded and appended to the `src`.

### `origin`

**Type:** `string|null` | **Default:** `null`

Where the `src` request had originated from without any path information.

### `preconnections`

**Type:** `string[]` | **Default:** `[]`

A collection of URLs to [preconnect][css-tricks-preconnect].

[css-tricks-preconnect]: https://css-tricks.com/using-relpreconnect-to-establish-network-connections-early-and-increase-performance/

### `decoder`

**Type:** `((data: string) => object)|null` | **Default:** `null`

A function which accepts a message received from `postmessage` and converts it into a POJO.

## Methods

### `getId`

**Return Type:** `string|null`

Reflects the `id` attribute of the root `iframe`. This is auto-generated in the form `vime-embed-{count}` 
where count is an integer that is incremented for each embed instance.

### `getIframe`

**Return Type:** `<iframe>`

The root [`iframe`][mdn-iframe] element.

[mdn-iframe]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe

### `getSrc`

**Return Type:** `string|null`

The [`src`](#src) prop with all [`params`](#params) appended.

### `postMessage`

**Parameters:** `(message: any, target: string?)`

Sends messages to the `iframe`.

## Events

### `load`

When the embedded player and media has loaded.

### `srcchange`

**Data Type:** `string|null` (the src + params)

When the `src` or `params` prop changes.

### `message`

**Data Type:** `string`

When messages are received from the `iframe` via `postmessage`.

### `data`

**Data Type:** `object`

When messages are received from the `iframe` and are decoded by the [`decoder`](#decoder).

### `rebuild`

When the `params` change but the `src` remains the same.
