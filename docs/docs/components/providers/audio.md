---
title: vm-audio
sidebar_label: Audio
---

Enables loading, playing and controlling audio via the HTML5 [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) element.

> You don't interact with this component for passing player properties, controlling playback, listening to player events and so on, that is all done through the `vime-player` component.

<!-- Auto Generated Below -->

## Usage

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
groupId="framework"
defaultValue="html"
values={[
  { label: 'HTML', value: 'html' },
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Stencil', value: 'stencil' },
  { label: 'Angular', value: 'angular' }
]}>

<TabItem value="html">

```html {2-5}
<vm-player controls>
  <vm-audio>
    <source data-src="/media/audio.mp3" type="audio/mp3" />
    <!-- <source> and <track> elements are placed here. -->
  </vm-audio>
  <!-- ... -->
</vm-player>
```


</TabItem>

<TabItem value="react">

```tsx {2,7-10}
import React from 'react';
import { Player, Audio } from '@vime/react';

function Example() {
  return (
    <Player controls>
      <Audio>
        <source data-src="/media/audio.mp3" type="audio/mp3" />
        {/* <source> and <track> elements are placed here. */}
      </Audio>
      {/* ... */}
    </Player>
  );
}
```


</TabItem>

<TabItem value="vue">

```html {3-6,12,17} title="example.vue"
<template>
  <Player controls>
    <audio>
      <source data-src="/media/audio.mp3" type="audio/mp3" />
      <!-- <source> and <track> elements are placed here. -->
    </audio>
    <!-- ... -->
  </Player>
</template>

<script>
  import { Player, Audio } from '@vime/vue';

  export default {
    components: {
      Player,
      Audio,
    },
  };
</script>
```


</TabItem>

<TabItem value="svelte">

```html {2-5,10} title="example.svelte"
<Player controls>
  <audio>
    <source data-src="/media/audio.mp3" type="audio/mp3" />
    <!-- <source> and <track> elements are placed here. -->
  </audio>
  <!-- ... -->
</Player>

<script lang="ts">
  import { Player, Audio } from '@vime/svelte';
</script>
```


</TabItem>

<TabItem value="stencil">

```tsx {5-8}
class Example {
  render() {
    return (
      <vm-player controls>
        <vm-audio>
          <source data-src="/media/audio.mp3" type="audio/mp3" />
          {/* <source> and <track> elements are placed here. */}
        </vm-audio>
        {/* ... */}
      </vm-player>
    );
  }
}
```


</TabItem>

<TabItem value="angular">

```html {2-5} title="example.html"
<vm-player controls>
  <vm-audio>
    <source data-src="/media/audio.mp3" type="audio/mp3" />
    <!-- <source> and <track> elements are placed here. -->
  </vm-audio>
  <!-- ... -->
</vm-player>
```


</TabItem>
</Tabs>


## Properties

| Property                | Description                                                                                                                                                                                                                                                                        | Type                                               | Default      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------ |
| `crossOrigin`           | Whether to use CORS to fetch the related image. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) for more information.                                                                                                                          | `"" ∣ "anonymous" ∣ "use-credentials" ∣ undefined` | `undefined`  |
| `disableRemotePlayback` | **EXPERIMENTAL:** Whether to disable the capability of remote playback in devices that are attached using wired (HDMI, DVI, etc.) and wireless technologies (Miracast, Chromecast, DLNA, AirPlay, etc).                                                                            | `boolean ∣ undefined`                              | `undefined`  |
| `mediaTitle`            | The title of the current media.                                                                                                                                                                                                                                                    | `string ∣ undefined`                               | `undefined`  |
| `preload`               | Provides a hint to the browser about what the author thinks will lead to the best user experience with regards to what content is loaded before the video is played. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload) for more information. | `"" ∣ "auto" ∣ "metadata" ∣ "none" ∣ undefined`    | `'metadata'` |


## Slots

| Slot | Description                                                                  |
| ---- | ---------------------------------------------------------------------------- |
|      | Pass `<source>` and `<track>` elements to the underlying HTML5 media player. |


## Dependencies

### Depends on

- [vm-file](./file)


