# vime-dailymotion

Enables loading, playing and controlling videos from [Dailymotion](https://www.dailymotion.com).

> You don't interact with this component for passing player properties, controlling playback, listening to player events and so on, that is all done through the `vime-player` component.

## Example

```html
<vime-player controls autoplay muted>
  <vime-dailymotion video-id="k3b11PemcuTrmWvYe0q"></vime-dailymotion>
  <!-- ... -->
</vime-player>
```

## Quirks

- You cannot change the `playbackRate` prop because there is no API for it.

- The `playsinline` property cannot be set. The player automatically sets it to `true` if `autoplay`
  is `true`.

<!-- Auto Generated Below -->


## Properties

| Property               | Attribute               | Description                                                                                                                                     | Type                  | Default     |
| ---------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `color`                | `color`                 | Change the default highlight color used in the controls (hex value without the leading #). Color set in the Partner HQ will override this prop. | `string \| undefined` | `undefined` |
| `shouldAutoplayQueue`  | `should-autoplay-queue` | Whether to automatically play the next video in the queue.                                                                                      | `boolean`             | `false`     |
| `showDailymotionLogo`  | `show-dailymotion-logo` | Whether to display the Dailymotion logo.                                                                                                        | `boolean`             | `false`     |
| `showShareButtons`     | `show-share-buttons`    | Whether to show buttons for sharing the video.                                                                                                  | `boolean`             | `false`     |
| `showUpNextQueue`      | `show-up-next-queue`    | Whether to show the 'Up Next' queue.                                                                                                            | `boolean`             | `false`     |
| `showVideoInfo`        | `show-video-info`       | Whether to show video information (title and owner) on the start screen.                                                                        | `boolean`             | `true`      |
| `syndication`          | `syndication`           | Forwards your syndication key to the player.                                                                                                    | `string \| undefined` | `undefined` |
| `videoId` _(required)_ | `video-id`              | The Dailymotion resource ID of the video to load.                                                                                               | `string`              | `undefined` |


## Dependencies

### Depends on

- [vime-embed](../../core/embed)

### Graph
```mermaid
graph TD;
  vime-dailymotion --> vime-embed
  style vime-dailymotion fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
