---
title: vime-embed
sidebar_label: Embed
slug: api
---

Embeds an external media player and enables interacting with it via `postMessage`. This is generally
used internally by other providers, but you could use it if your requirements are simple. You'll
also get the benefits of preconnections and lazy-loading. Refer to [existing providers](#used-by) to
see what params you can pass in, how to send commands to the player, and how to listen to events.

## Example

```html
<vime-embed
  embed-src="https://www.youtube-nocookie.com/embed/DyTCOwB0DVw"
  params="autoplay=1&muted=1&controls=0"
  media-title="Agent 327: Operation Barbershop"
  origin="https://www.youtube-nocookie.com"
/>

<script>
  const embed = document.querySelector("vime-embed");

  embed.addEventListener("vEmbedMessage", (e) => {
    const message = e.detail;
    console.log(message);
  });
</script>
```

<!-- Auto Generated Below -->

## Properties

| Property         | Attribute     | Description                                                                                                                                  | Type                                                              | Default     |
| ---------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------- |
| `decoder`        | --            | A function which accepts the raw message received from the embedded media player via `postMessage` and converts it into a POJO.              | `((data: string) => Record<string, any> ∣ undefined) ∣ undefined` | `undefined` |
| `embedSrc`       | `embed-src`   | A URL that will load the external player and media (Eg: https://www.youtube.com/embed/DyTCOwB0DVw).                                          | `string`                                                          | `''`        |
| `mediaTitle`     | `media-title` | The title of the current media so it can be set on the inner `iframe` for screen readers.                                                    | `string`                                                          | `''`        |
| `origin`         | `origin`      | Where the src request had originated from without any path information.                                                                      | `string ∣ undefined`                                              | `undefined` |
| `params`         | `params`      | The parameters to pass to the embedded player which are appended to the `embedSrc` prop. These can be passed in as a query string or object. | `string ∣ { [x: string]: any; }`                                  | `''`        |
| `preconnections` | --            | A collection of URLs to that the browser should immediately start establishing a connection with.                                            | `string[]`                                                        | `[]`        |

## Events

| Event             | Description                                                                                                                                        | Type                  |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `vEmbedLoaded`    | Emitted when the embedded player and any new media has loaded.                                                                                     | `CustomEvent<void>`   |
| `vEmbedMessage`   | Emitted when a new message is received from the embedded player via `postMessage`.                                                                 | `CustomEvent<any>`    |
| `vEmbedSrcChange` | Emitted when the `embedSrc` or `params` props change. The payload contains the `params` serialized into a query string and appended to `embedSrc`. | `CustomEvent<string>` |

## Methods

### `postMessage(message: any, target?: string | undefined) => Promise<void>`

Posts a message to the embedded media player.

#### Returns

Type: `Promise<void>`

## Dependencies

### Used by

- [vime-dailymotion](../../providers/dailymotion/readme.md)
- [vime-vimeo](../../providers/vimeo/readme.md)
- [vime-youtube](../../providers/youtube/readme.md)

### Graph

```mermaid
graph TD;
  vime-dailymotion --> vime-embed
  vime-vimeo --> vime-embed
  vime-youtube --> vime-embed
  style vime-embed fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
