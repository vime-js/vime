# vime-youtube

Enables loading, playing and controlling videos from [YouTube](https://www.youtube.com).

> You don't interact with this component for passing player properties, controlling playback, listening to player events and so on, that is all done through the `vime-player` component.

## Quirks

- When the player is `paused`, `seeking` and `seeked` are fired at the same time (in order), because
  there are no updates between the events from the embed.

- Changing the `controls` prop forces the player to reload.

- You cannot change `playbackQuality` programmatically, YouTube automatically determines the best
  quality to play.

- Fullscreen changes that come from clicking the YouTube fullscreen control are not tracked on iOS,
  because the embed doesn't provide an API for it.

<!-- Auto Generated Below -->


## Usage

### Angular

```html {2} title="example.html"
<vime-player controls>
  <vime-youtube cookies="true" video-id="DyTCOwB0DVw"></vime-youtube>
  <!-- ... -->
</vime-player>
```


### Html

```html {2}
<vime-player controls>
  <vime-youtube video-id="DyTCOwB0DVw"></vime-youtube>
  <!-- ... -->
</vime-player>
```


### React

```tsx {2,7}
import React from 'react';
import { VimePlayer, VimeYoutube } from '@vime/react';

function Example() {
  return (
    <VimePlayer controls>
      <VimeYoutube videoId="DyTCOwB0DVw" />
      {/* ... */}
    </VimePlayer>
  );
}
```


### Stencil

```tsx {5}
class Example {
  render() {
    return (
      <vime-player controls>
        <vime-youtube videoId="DyTCOwB0DVw" />
        {/* ... */}
      </vime-player>
    );
  }
}
```


### Svelte

```html {2,7} title="example.svelte"
<VimePlayer controls>
  <VimeYoutube videoId="DyTCOwB0DVw" />
  <!-- ... -->
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeYoutube } from '@vime/svelte';
</script>
```


### Vue

```html {3,9,14} title="example.vue"
<template>
  <VimePlayer controls>
    <VimeYoutube videoId="DyTCOwB0DVw" />
    <!-- ... -->
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeYoutube } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeYoutube,
    },
  };
</script>
```



## Properties

| Property                | Attribute                 | Description                                                           | Type                  | Default     |
| ----------------------- | ------------------------- | --------------------------------------------------------------------- | --------------------- | ----------- |
| `cookies`               | `cookies`                 | Whether cookies should be enabled on the embed.                       | `boolean`             | `false`     |
| `poster`                | `poster`                  | The absolute URL of a custom poster to be used for the current video. | `string \| undefined` | `undefined` |
| `showFullscreenControl` | `show-fullscreen-control` | Whether the fullscreen control should be shown.                       | `boolean`             | `true`      |
| `videoId` _(required)_  | `video-id`                | The YouTube resource ID of the video to load.                         | `string`              | `undefined` |


## Dependencies

### Used by

 - [vime-playground](../../core/playground)

### Depends on

- [vime-embed](../../core/embed)

### Graph
```mermaid
graph TD;
  vime-youtube --> vime-embed
  vime-playground --> vime-youtube
  style vime-youtube fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
