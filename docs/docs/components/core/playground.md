---
title: vm-playground
sidebar_label: Playground
---

A simple playground for testing and playing with Vime and its various providers.

<!-- Auto Generated Below -->

## Properties

| Property       | Description                                                         | Type                                                                                                                        | Default                          |
| -------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `poster`       | The current poster to load.                                         | `string`                                                                                                                    | ``${BASE_MEDIA_URL}/poster.png`` |
| `provider`     | The current media provider.                                         | `Provider.Audio ∣ Provider.Dailymotion ∣ Provider.Dash ∣ Provider.HLS ∣ Provider.Video ∣ Provider.Vimeo ∣ Provider.YouTube` | `Provider.Audio`                 |
| `showControls` | Whether to show the native controls or not.                         | `boolean`                                                                                                                   | `true`                           |
| `showCustomUI` | Whether to show the custom Vime UI or not.                          | `boolean`                                                                                                                   | `false`                          |
| `src`          | The current `src` to load into the provider.                        | `string ∣ undefined`                                                                                                        | `undefined`                      |
| `theme`        | The current custom UI theme, won't work if custom UI is turned off. | `"dark" ∣ "light"`                                                                                                          | `'dark'`                         |


## Dependencies

### Depends on

- [vm-audio](./../providers/audio)
- [vm-video](./../providers/video)
- [vm-hls](./../providers/hls)
- [vm-dash](./../providers/dash)
- [vm-youtube](./../providers/youtube)
- [vm-vimeo](./../providers/vimeo)
- [vm-dailymotion](./../providers/dailymotion)
- [vm-player](./player)
- [vm-default-ui](./../ui/default-ui)


