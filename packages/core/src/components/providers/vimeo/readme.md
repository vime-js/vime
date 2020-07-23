# vime-vimeo

Enables loading, playing and controlling videos from [Vimeo](https://www.vimeo.com).

## Quirks

- Only [Vimeo PRO](https://vimeo.com/professionals) members can set/change the playbackRate.

- `playbackQuality` and `playbackQualities` are not supported because there is no API for it.

<!-- Auto Generated Below -->

## Properties

| Property               | Attribute  | Description                                                                                                      | Type                  | Default     |
| ---------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `byline`               | `byline`   | Whether to display the video owner's name.                                                                       | `boolean`             | `true`      |
| `color`                | `color`    | The hexadecimal color value of the playback controls. The embed settings of the video might override this value. | `string \| undefined` | `undefined` |
| `portrait`             | `portrait` | Whether to display the video owner's portrait.                                                                   | `boolean`             | `true`      |
| `videoId` _(required)_ | `video-id` | The Vimeo resource ID of the video to load.                                                                      | `string`              | `undefined` |


## Dependencies

### Depends on

- [vime-embed](../../core/embed)

### Graph
```mermaid
graph TD;
  vime-vimeo --> vime-embed
  style vime-vimeo fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
