---
title: PlayerState
sidebar_label: PlayerState
---

**Type:** `enum<int>`

Identifies the state of the player by a number and can contain one of these possible values:

- `1` - The player is in an `IDLE` state, no media has been loaded and the player is doing nothing.
- `2` - The player is in a `CUED` state, media has been loaded and is ready for playback.
- `3` - The player is `PLAYING`.
- `4` - The player is `PAUSED`.
- `5` - The player is `BUFFERING`.
- `6` - Playback has `ENDED`.

## Example

```js
import { PlayerState } from '@vime-js/standard'

const { state } = player.getStore();

state.subscribe(newState => {
  if (newState !== PlayerState.PLAYING) return;
  console.log('playing');
});
```

For demonstration purposes, the following is a simpler alternative.

```js
const { playing } = player.getStore();

playing.subscribe(isPlaying => {
  if (!isPlaying) return;
  console.log('playing');
})
```