# vime-embed

Embeds an external media player and enables interacting with it via `postMessage`.

<!-- Auto Generated Below -->


## Properties

| Property         | Attribute     | Description                                                                                                                     | Type                                                                                       | Default     |
| ---------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------- |
| `decoder`        | --            | A function which accepts the raw message received from the embedded media player via `postMessage` and converts it into a POJO. | `((data: string) => Record<string, string \| number \| boolean \| string[]>) \| undefined` | `undefined` |
| `embedSrc`       | `embed-src`   | A URL that will load the external player and media (Eg: https://www.youtube.com/embed/DyTCOwB0DVw).                             | `string`                                                                                   | `''`        |
| `mediaTitle`     | `media-title` | The title of the current media so it can be set on the inner `iframe` for screen readers.                                       | `string`                                                                                   | `''`        |
| `origin`         | `origin`      | Where the src request had originated from without any path information.                                                         | `string \| undefined`                                                                      | `undefined` |
| `params`         | --            | The parameters to pass to the embedded player. These are encoded as a query string and appended to the `embedSrc` prop.         | `{ [x: string]: string \| number \| boolean \| string[]; }`                                | `{}`        |
| `preconnections` | --            | A collection of URLs to that the browser should immediately start establishing a connection with.                               | `string[]`                                                                                 | `[]`        |


## Events

| Event             | Description                                                                                                                                        | Type                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `vEmbedLoaded`    | Emitted when the embedded player and any new media has loaded.                                                                                     | `CustomEvent<void>`                                                      |
| `vEmbedMessage`   | Emitted when a new message is received from the embedded player via `postMessage`.                                                                 | `CustomEvent<{ [x: string]: string \| number \| boolean \| string[]; }>` |
| `vEmbedSrcChange` | Emitted when the `embedSrc` or `params` props change. The payload contains the `params` serialized into a query string and appended to `embedSrc`. | `CustomEvent<string>`                                                    |


## Methods

### `postMessage(message: any, target?: string | undefined) => Promise<void>`

Posts a message to the embedded media player.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
