---
title: Provider Notes
sidebar_label: Notes
---

## YouTube

- When the player is `paused`, `seeking` and `seeked` are fired at the same time (in order), because there is
  no updates between the events from the embed.

- Vime disables cookies by default for YouTube. If you're using `@vime-js/lite` you can enable them via the `cookies`
  prop, otherwise you can enable it via `player.provider.cookies`.

- Enabling/disabling the native controls forces the player to reload. We set the player back to the
  state it was in prior to reloading.

- You cannot change `videoQuality` programmatically, YouTube automatically determines the best quality to play,
  however you can access `videoQuality` to get the current quality setting.

- Fullscreen events that come from clicking the native fullscreen control are not tracked on iOS, because
  the embed doesn't provide an API for it.

## Vimeo

- Only [Vimeo PRO](https://vimeo.com/professionals) members can set/change the `playbackRate`.

- Video quality/qualities are not supported because there is no API for it.

## Dailymotion

- An ad plays for 10 seconds at the start of every video which delays playback. The embed ignores
  all commands whilst the ad is playing. We store your commands and replay them once the ad finishes.

- Playback rate/rates are not supported because there is no API for it.
