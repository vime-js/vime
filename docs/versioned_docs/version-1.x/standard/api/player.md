---
title: Player
sidebar_label: Player
---

**Type:** `Component`

This component is at the heart of Vime. It's responsible for rendering providers, providing an interface
to interact with them, and assisting in normalizing cross-browser and provider differences. It's internally used by 
the Complete Player.

:::info
See the [notes](../notes.md) page for more information on provider specifics.
:::

## Store

All props below are powered behind the scenes by a [store][svelte-store]. They are plain JS objects that 
contain a `subscribe` function and an optional `set` function. You can subscribe to receive updates 
of some value as it changes over time. The `subscribe` function returns an `unsubscribe` function that 
you can call to stop listening.

[svelte-store]: https://svelte.dev/docs#svelte_store

### Usage

```js
// All props below are available here.
const { paused } = player.getStore();

const unsubscribe = paused.subscribe(isPaused => {
  console.log('paused state changed to:', isPaused);
});

// ...

unsubscribe();
```

## Props

### `src`

**Type:** `any` | **Default:** `null`

Used to locate media resources to load.

:::info
See our [guide](../../guides/loading-media.md) on how to set this prop.
:::

### `canSetPoster`

**Type:** `boolean` | **Default:** `false` | **Readonly**: `true`

Whether the current provider supports setting a custom poster.

### `poster`

**Type:** `string|null` | **Default:** `null`

A custom poster to load if a provider supports it. You can check [`canSetPoster`](#cansetposter) 
before you try setting this property.

### `providers`

**Type:** `Provider[]` | **Default:** `[]`

The current list of providers that are available to the player.

### `Provider`

**Type:** `Provider|null` | **Default:** `null`

The current `Provider` who can play the current `src`. If it is `null` then no provider
can play the current `src`.

### `provider`

**Type:** `component|null` | **Default:** `null` | **Readonly**: `true`

The currently active provider instance.

### `providerConfig`

**Type:** `object` | **Default:** `{}`

Provider specific configuration.

### `providerVersion`

**Type:** `string` | **Default:** `'latest'`

The NPM version of a provider package to load into the browser.

### `origin`

**Type:** `string|null` | **Default:** `16:9` | **Readonly**: `true`

Where the `src` request had originated from without any path information.

### `title`

**Type:** `string|null` | **Default:** `null` | **Readonly**: `true`

The title of the current media.

### `currentSrc`

**Type:** `any` | **Default:** `null` | **Readonly**: `true`

The currently loaded media resources.

### `playbackReady`

**Type:** `boolean` | **Default:** `false` | **Readonly**: `true`

Whether the current media is ready for playback.

### `rebuilding`

**Type:** `boolean` | **Default:** `false` | **Readonly**: `true`

If the provider is currently rebuilding itself. This happens if we are forced to send a new parameter
to the embed. For example, there is no API for enabling/disabling YouTube controls, so we change it
via the controls parameter which requires the embed to reload.

### `canInteract`

**Type:** `boolean` | **Default:** `false` | **Readonly**: `true`

Whether you can interact with the player. If `true` then the player is ready for playback and it's 
not currently rebuilding.

### `useNativeView`

**Type:** `boolean` | **Default:** `true` | **Readonly:** `true`

Whether the provider should display any elements outside of the controls, such as titles, logos
etc. Not all providers support this.

### `useNativeControls`

**Type:** `boolean` | **Default:** `true` | **Readonly:** `true`

Whether to show/hide native controls.

### `useNativeCaptions`

**Type:** `boolean` | **Default:** `true` | **Readonly:** `true`

Whether to enable/disable native captions. If `false` then the provider is given an empty set of `tracks`.

### `nativePoster`

**Type:** `string|null` | **Default:** `null` | **Readonly:** `true`

The absolute URL of the native poster for the current `src`. For example, the thumbnail for a YouTube video.

### `mediaType`

**Type:** `MediaType` | **Default:** `0` | **Readonly:** `true`

The type of the media, see [`MediaType`](./media-type.md).

### `isAudio`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether the current media is of type audio.

### `isVideo`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether the current media is of type video.

### `isLive`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether the current media is a live stream.

### `paused`

**Type:** `boolean` | **Default:** `true`

Whether the player is paused or not.

### `currentTime`

**Type:** `double` | **Default:** `0`

The current playback time in seconds, setting this will seek the media to the new time.

### `buffered`

**Type:** `double` | **Default:** `0` | **Readonly:** `true`

The length of the media that the browser has loaded in seconds.

### `duration`

**Type:** `double` | **Default:** `0` | **Readonly:** `true`

The total playback length of the media in seconds.

### `muted`

**Type:** `boolean` | **Default:** `false`

Whether the audio is muted or not.

### `volume`

**Type:** `int` | **Default:** `30`

An integer `(0 - 100)` that determines the current volume level of the audio. If `0`, the audio is muted.
This cannot be set on mobile as it is controlled by system controls.

### `playing`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether the current media is playing or not.

### `buffering`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether the current media is buffering (temporarily paused loading), or not.

### `playbackStarted`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether playback has started or not.

### `playbackEnded`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether playback has ended or not.

### `seeking`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether the player is seeking to a new time or not.

### `isPlayerActive`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether this is the currently active player or not. The player is active if it is the last player
to have been interacted with programtically or by the user.

### `isControlsEnabled`

**Type:** `boolean` | **Default:** `true`

Whether to show or hide controls.

### `isControlsActive`

**Type:** `boolean` | **Default:** `true`

Whether the the controls are currently visible or not. 

### `state`

**Type:** `PlayerState` | **Default:** `1` | **Readonly:** `true`

The current state of the player, see [`PlayerState`](./player-state.md).

### `canSetPlaybackRate`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether the current provider supports setting the playback rate.

### `playbackRates`

**Type:** `double[]` | **Default:** `[1]` | **Readonly:** `true`

The list of available playback rates.

### `playbackRate`

**Type:** `double` | **Default:** `1`

The current playback rate of the media. You can check [`canSetPlaybackRate`](#cansetplaybackrate) 
before you try setting this property.

### `canSetVideoQuality`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether the current provider supports setting the video quality.

### `videoQualities`

**Type:** `VideoQuality[]` | **Default:** `[]` | **Readonly:** `true`

The list of available video qualities, see [`VideoQuality`](./video-quality.md).

### `videoQuality`

**Type:** `VideoQuality` | **Default:** `0`

The current video quality of the media, see [`VideoQuality`](./video-quality.md).
You can check [`canSetVideoQuality`](#cansetvideoquality) before you try setting this property.

### `isVideoView`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

If the player is displayed as a video. It is `true` if there is a video loaded or if a poster is set.

### `isVideoReady`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

If `isVideoView` is `true` and the player is ready for playback.

### `progress`

**Type:** `object` | **Readonly:** `true`

The progress of the current playback and the amount buffered.

```js
// Example to demonstrate the shape of the object.
const progress = {
  played: {
    seconds: 30,
    percent: 25,
  },
  buffered: {
    seconds: 45,
    percent: 37.5,
  }
};
```

### `canSetTracks`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether the current provider supports setting tracks/captions.

### `tracks`

**Type:** `object[]` | **Default:** `[]`

A list of tracks to be loaded. Each track is represented as a `object` that contains any valid 
[TextTrackElement][mdn-text-track] property.

[mdn-text-track]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track

### `canSetTrack`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether the current provider supports changing text tracks.

### `currentTrackIndex`

**Type:** `int` | **Default:** `-1`

The index of the currently active track. If it is `-1`, then no track is active.

### `currentTrack`

**Type:** `object|null` | **Default:** `null` | **Readonly:** `true`

The currently active track.

### `isCaptionsActive`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

If captions are currently visible or not. This is `false` if `currentTrackIndex` is `-1`.

### `canSetPiP`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether the current provider supports picture-in-picture (PiP). 

:::caution
This doesn't guarantee that the player will enter PiP. It determines whether the request can be made.
:::

### `isPiPActive`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether the player is in picture-in-picture mode or not.

### `canSetFullscreen`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether fullscreen is supported by the current provider or native [Fullscreen API][mdn-fullscreen-api].

:::caution
This doesn't guarantee that the player will enter fullscreen. It determines whether the request can be made.
:::

[mdn-fullscreen-api]: https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API

### `isFullscreenActive`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether the player is in fullscreen mode or not.

### `autopause`

**Type:** `boolean` | **Default:** `true`

Whether to pause this player when another player becomes active.

### `aspectRatio`

**Type:** `string|null` | **Default:** `16:9`

The aspect ratio of the player expressed as `width:height`.

### `playsinline`

**Type:** `boolean` | **Default:** `true`

When the player begins playback on mobile, whether it should play inline or go fullscreen. If 
`autoplay` is true then this will be forced to be `true`.

### `canAutoplay`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether playback can begin immediately. This assumes [`playsinline`](#playsinline) is true.

### `canMutedAutoplay`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether playback can begin immediately if the volume is muted. This assumes [`playsinline`](#playsinline) 
is true.

### `autoplay`

**Type:** `boolean` | **Default:** `false`

Whether playback should begin as soon as it's ready. 

:::info
This will automatically fallback to `muting` if [`canAutoplay`](#canautoplay) returns `false`. In addition, 
the [`playsinline`](#playsinline) property will be forced to be `true`.
:::

### `loop`

**Type:** `boolean` | **Default:** `false`

Whether playback should start over from the beginning when it reaches the end.

## Methods

### `getStore`

**Return Type:** `object`

Returns an `object` where each `key` is a prop listed above, and the corresponding `value` is a 
[Svelte store](#store).

### `tick`

**Return Type:** `Promise<undefined>`

Returns a `Promise` that will resolve once all pending player state changes are flushed.

### `requestPiP`

**Return Type:** `Promise<string|undefined>`

Requests the player to enter picture-in-picture (PiP) mode. Returns a `Promise` that will resolve if the 
request is made, or reject with a reason for failure. A resolved `Promise` doesn't gurantee that it was successful.
To know when it is active or not, you can subscribe to [`isPiPActive`](#ispipactive). You can also call 
[`canSetPiP`](#cansetpip) to see if the current provider supports it.

**Possible Rejection Reasons**

- The current provider does not support it.
- The request is made on an audio track.
- The player is not ready for playback.
- The user has not interacted with the page/player yet.

**Notes**

- At this time, captions are [not supported in PiP](https://bugs.chromium.org/p/chromium/issues/detail?id=854935).
- Only supported in Desktop Chrome 70+ and Desktop Safari 10+ at the moment.

**Listening to Changes**

```js
const { isPiPActive } = player.getStore();

const unsubscribe = isPiPActive.subscribe(isActive => {
  console.log('pip change:', isActive);
});

// ...

unsubscribe();
```

### `exitPiP`

**Return Type:** `Promise<string|undefined>`

Requests the player to exit picture-in-picture (PiP) mode. Returns a `Promise` that will resolve if the 
request is made, or reject with a reason for failure. See [`requestPiP`](#requestpip) for more information.

**Possible Rejection Reasons**

- Player is not in PiP mode.
- Player is out of view and has not mounted yet.

### `requestFullscreen`

**Return Type:** `Promise<string|undefined>`

Requests the player to enter fullscreen mode. Returns a `Promise` that will resolve if the 
request is made, or reject with a reason for failure. A resolved `Promise` doesn't gurantee that it was successful.
To know when it is active or not, you can subscribe to [`isFullscreenActive`](#isfullscreenactive).
You can also call [`canSetFullscreen`](#cansetfullscreen) to see if it is supported or not.

**Possible Rejection Reasons**

- The request is made on an audio track.
- The player is not ready for playback.
- The user has not interacted with the page yet.
- The [Fullscreen API][mdn-fullscreen-api] is not available and the current provider does not support it.

**Notes**

- See [Fullscreen API support][cani-fullscreen].

[cani-fullscreen]: https://caniuse.com/#feat=fullscreen

**Listening to Changes**

```js
const { isFullscreenActive } = player.getStore();

const unsubscribe = isFullscreenActive.subscribe(isActive => {
  console.log('fullscreen change:', isActive);
});

// ...

unsubscribe();
```

### `exitFullscreen`

**Return Type:** `Promise<string|undefined>`

Requests the player to exit fullscreen mode. Returns a `Promise` that will resolve if the 
request is made, or reject with a reason for failure. See [`requestFullscreen`](#requestfullscreen)
for more information.

**Possible Rejection Reasons**

- Player is not in fullscreen mode.
- Player is out of view and has not mounted yet.