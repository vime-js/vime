# API

## Props

### `srcId`

**Type:** `string|null` | **Default:** `null`

Used to locate a media resource with a provider. For example, for YouTube this would be the video id.

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

### `aspectRatio`

**Type:** `string|null` | **Default:** `16:9`

The aspect ratio of the player expressed as `width:height`.

## Methods

### `getSrc`

**Return Type:** `string|null`

The embed URL (no parameters) for the current media.

### `getSrcWithParams`

**Return Type:** `string|null`

The embed URL and all parameters attached.

### `getOrigin`

**Return Type:** `string|null`

Where the `src` request had originated from without any path information.

### `getTitle`

**Return Type:** `string|null`

The title of the current media.

### `getIframe`

**Return Type:** `HTMLIFrameElement`

The DOM node for the embedded `<iframe>`.

### `sendCommand`

**Parameters:** `(command: string, args: any, force: boolean)`

Sends commands to the embed via [postmessage][mdn-postmessage]. These commands are sent through when 
the media is ready for playback, however you can `force` the command to be sent through immediately. 
The way this method is used depends on the respective provider. 

Traditional Player SDK's abstract this away for you at the cost of size, however it's really easy
to use. We have a quick [primer](./usage.md) for each provider to get you started. If you find any of this 
uncomfortable, then consider our [Standard Player](../standard/setup.md) (~8 kB heavier) to abstract this 
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

### `message`

**Data Type:** `string`

When messages are posted from the embed.

### `data`

**Data Type:** `object`

Similar to the `messsage` event, except data is decoded into a POJO. This is most likely the main
event you'll be interacting with. This is where you'll receive updates on the state of the player, 
or the response to any commands you send through. We have a quick [primer](./usage.md) for each provider 
to get you started.

### `srcchange`

**Data Type:** `string|null`

When the `src` attribute of the `iframe` is changed. This will fire when `srcId` or `params` changes.

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

**Data Type:** `any`

When an error occurs with the intial setup of the player.