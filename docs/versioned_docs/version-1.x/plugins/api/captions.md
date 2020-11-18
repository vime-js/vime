---
title: Captions
sidebar_label: Captions
---

**ID:** `vCaptions` | **ROLE:** `CAPTIONS` | **Type:** [`Plugin`](../../complete/api/plugin.md)

This plugin renders and displays captions/subtitles that are set in the `tracks` prop. The current track 
is set by the `currentTrackIndex` and `locale` props. If you don't want `locale` changes to affect the 
captions, see the [`useLocale`](#uselocale) prop below.

## Setup

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
  groupId="plugins"
  defaultValue="basic"
  values={[
  { label: 'Basic', value: 'basic' },
  { label: 'Manager', value: 'advanced' },
]}>

<TabItem value="basic">

```js
import { Player, Captions } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [Captions]
  }
});
```

</TabItem>

<TabItem value="advanced">

```js
import { Player, Captions } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugin(Captions)
  .then((captions) => {
    // ...
  });
```

</TabItem>

</Tabs>

## Props

### `useLocale`

**Type:** `boolean` | **Default:** `true`

Whether `locale` changes should change the current track by looking for a track with a matching `srclang`.

### `crossorigin`

**Type:** `string|null` | **Default:** `null`

This plugin creates a [track][mdn-track] element to load text tracks and this prop is the [crossorigin][mdn-crossorigin]
attribute set on it.

[mdn-track]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
[mdn-crossorigin]: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin

### `cues`

**Type:** `VTTCue[]` | **Default:** `[]` | **Readonly:** `true`

A list of cues ([`VTTCue`][mdn-vtt-cue]) for the current track.

[mdn-vtt-cue]: https://developer.mozilla.org/en-US/docs/Web/API/VTTCue

### `currentCueIndex`

**Type:** `int` | **Default:** `-1` | **Readonly:** `true`

The index of the current cue. If it is `-1` then there are no cues.

### `currentCue`

**Type:** `VTTCue` | **Default:** `null` | **Readonly:** `true`

The current cue ([`VTTCue`][mdn-vtt-cue]).

### `activeCues`

**Type:** `VTTCue[]` | **Default:** `[]` | **Readonly:** `true`

The cues ([`VTTCue`][mdn-vtt-cue]) that are currently active. Cues are active if the `currentTime` is between the cues' 
`startTime` and `endTime`.

## Store

The following props are backed by a store which you can access via the [`getStore`](#getstore) method.

- [`cues`](#cues)
- [`currentCueIndex`](#currentcueindex)
- [`currentCue`](#currentcue)
- [`activeCues`](#activecues)

```js
const { cues } = player.vCaptions.getStore();
```

## Methods

### `getStore`

**Return Type:** `object`

See the [store](#store) section above.

### `addCue`

**Parameters:** `(cue: VTTCue)`

Validates and adds a new cue ([`VTTCue`][mdn-vtt-cue]).

### `addCues`

**Parameters:** `(cues: VTTCue[])`

Adds a list of cues ([`VTTCue`][mdn-vtt-cue]) using `addCue`.

### `removeCue`

**Parameters:** `(cue: VTTCue|int)`

Removes a cue or index from the list of cues.

### `removeCues`

**Parameters:** `(cues: VTTCue|int[])`

Removes a list of cues using `removeCue`.
