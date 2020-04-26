# Player

**Type:** `Component`

[View Source](../../../vime-lite/src/LitePlayer.svelte)

## Props

### `src`

**Type:** `string|null` | **Default:** `null`

Used to locate a media resource to load.

{% hint style="info" %}
See our [guide](../guides/loading-media.md) on how to set this prop.
{% endhint %}

### `providers`

**Type:** `Provider[]` | **Default:** `[]`

The list of providers available to the player. A `Provider` tells the player how to embed media from
a specific provider. They are imported from the package under the name `{ProviderName}Provider`.

### `params`

**Type:** `object` | **Default:** `{}`

The parameters you'd like to pass to the player. These are encoded and appended to the embed URL.

**Player Parameters:**

- [YouTube][youtube-params]
- [Vimeo][vimeo-params]
- [Dailymotion][dailymotion-params]

[youtube-params]: https://developers.google.com/youtube/player_parameters#Parameters
[vimeo-params]: https://developer.vimeo.com/player/sdk/embed#embed-options
[dailymotion-params]: https://developer.vimeo.com/player/sdk/embed#embed-options

### `cookies`

**Type:** `boolean` | **Default:** `false`

Whether cookies should be enabled on the embed or not. This currently only works for YouTube.

### `aspectRatio`

**Type:** `string|null` | **Default:** `16:9`

The aspect ratio of the player expressed as `width:height`.

### `ignoreDefaultParams`

**Type:** `boolean` | **Default:** `false`

Whether any default parameters passed to the embed by Vime should be ignored. Default parameters are 
only passed in to resolve any visual or functional issues between the embed and Vime.

### `hasWrapper`

**Type:** `boolean` | **Default:** `true`

Whether the player should be loaded lazily with a set aspect ratio. If the wrapper is removed then
lazy loading is disabled and the player stretches to fill its first parent element with a `relative` position.

## Methods

### `getOrigin`

**Return Type:** `string|null`

Where the `src` request had originated from without any path information.

### `getEmbed`

**Return Type:** [`Embed`](./embed.md)

The underlying `Embed` instance.

### `getEmbedURL`

**Return Type:** `string|null`

The URL used to embed the current media.

### `getProvider`

**Return Type:** `Provider|null`

The currently active provider. The provider becomes active if it recognizes the current `src`. 

### `getMediaId`

**Return Type:** `string|null`

The id used by the current provider to locate the media resource. For YouTube this would be the
`videoId`.

### `getTitle`

**Return Type:** `string|null`

The title of the current media.

### `sendCommand`

**Parameters:** `(command: string, args: any, force: boolean)`

Sends commands to the embed via [postmessage][mdn-postmessage]. These commands are sent through when 
the media is ready for playback, however you can `force` the command to be sent through immediately. 
The way this method is used depends on the respective provider. 

Traditional Player SDK's abstract this away for you at the cost of size, however it's really easy
to use. We have a quick [primer](./usage.md) for each provider to get you started. If you find any of this 
uncomfortable, then consider our [Standard Player](../standard/setup.md) (~10 kB heavier) to abstract this 
all away for you.

[mdn-postmessage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage

## Events

```js
// Start listening.
const off = player.$on("someEvent", e => {
  const data = e.detail;
});

// Stop listening.
off();
```

### `load`

When the embed has initially loaded but it is not ready for playback.

### `ready`

When the media has loaded and is ready for playback.

### `message`

**Data Type:** `string`

When messages are posted from the `iframe` that contains the embedded player via [`postmessage`][mdn-postmessage].

### `data`

**Data Type:** `object`

Similar to the `messsage` event, except data is decoded into a POJO. This is most likely the main
event you'll be interacting with. This is where you'll receive updates on the state of the player, 
or the response to any commands you send through. We have a quick [primer](./usage.md) for each provider 
to get you started.

### `embedurlchange`

**Data Type:** `string|null`

When the embed URL for the current media changes.

### `originchange`

**Data Type:** `string|null`

When the origin where the `src` is being requested from changes.

### `rebuild`

Similar to `srcchange`, but only fired if `src` is not `null`. This is mainly used to be notified of 
changes to `params`.

### `titlechange`

**Data Type:** `string|null`

When the title of the media changes.

### `error`

**Data Type:** `any` (contains more information about the error)

When an error occurs with the intial setup of the player.
