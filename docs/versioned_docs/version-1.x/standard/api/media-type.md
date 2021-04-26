---
title: MediaType
sidebar_label: MediaType
---

**Type:** `enum<int>`

Identifies the type of media by a number and can contain one of these possible values:

- `0` - `NONE`, no media has been loaded.
- `1` - The media is an `AUDIO` track.
- `2` - The media is a `VIDEO`.

## Example

```js
import { MediaType } from '@vime-js/standard';

let isAudio = player.mediaType === MediaType.AUDIO;
```

You don't need to do this because we've done it for you.

```js
const isAudio = player.isAudio;
```
