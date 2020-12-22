---
title: vm-hls
sidebar_label: Hls
---

Enables loading, playing and controlling [HLS](https://en.wikipedia.org/wiki/HTTP_Live_Streaming) based media. If the [browser does not support HLS](https://caniuse.com/#search=hls) then the [`hls.js`](https://github.com/video-dev/hls.js) library is downloaded and used as a fallback to play the stream.

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

```html {2-4}
<vm-player controls>
  <vm-hls version="latest" poster="/media/poster.png">
    <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
  </vm-hls>
  <!-- ... -->
</vm-player>
```


</TabItem>

<TabItem value="react">

```tsx {2,14-16}
import React from 'react';
import { Player, Hls } from '@vime/react';

function Example() {
  /**
   * @see https://hls-js.netlify.app/api-docs/file/src/config.ts.html.
   */
  const hlsConfig = {
    // ...
  };

  return (
    <Player controls>
      <Hls version="latest" config={hlsConfig} poster="/media/poster.png">
        <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
      </Hls>
      {/* ... */}
    </Player>
  );
}
```


</TabItem>

<TabItem value="vue">

```html {3-5,11,16} title="example.vue"
<template>
  <Player controls>
    <Hls :config="hlsConfig" version="latest" poster="/media/poster.png">
      <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
    </Hls>
    <!-- ... -->
  </Player>
</template>

<script>
  import { Player, Hls } from '@vime/vue';

  export default {
    components: {
      Player,
      Hls,
    },

    data: {
      /**
       * @see https://hls-js.netlify.app/api-docs/file/src/config.ts.html.
       */
      hlsConfig: {
        // ...
      },
    },
  };
</script>
```


</TabItem>

<TabItem value="svelte">

```html {2-4,9} title="example.svelte"
<Player controls>
  <Hls version="latest" config="{hlsConfig}" poster="/media/poster.png">
    <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
  </Hls>
  <!-- ... -->
</Player>

<script lang="ts">
  import { Player, Hls } from '@vime/svelte';

  /**
   * @see https://hls-js.netlify.app/api-docs/file/src/config.ts.html.
   */
  const hlsConfig = {
    // ...
  };
</script>
```


</TabItem>

<TabItem value="stencil">

```tsx {5-7}
class Example {
  render() {
    return (
      <vm-player controls>
        <vm-hls version="latest" poster="/media/poster.png">
          <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
        </vm-hls>
        {/* ... */}
      </vm-player>
    );
  }
}
```

</TabItem>

<TabItem value="angular">

```html {2-4} title="example.html"
<vm-player controls>
  <vm-hls version="latest" [config]="hlsConfig" poster="/media/poster.png">
    <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
  </vm-hls>
  <!-- ... -->
</vm-player>
```

```ts title="example.ts"
class Example {
  /**
   * @see https://hls-js.netlify.app/api-docs/file/src/config.ts.html.
   */
  hlsConfig = {
    // ...
  };
}
```


</TabItem>
</Tabs>


## Properties

| Property                | Description                                                                                                                                                                                                                                                                        | Type                                               | Default      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------ |
| `autoPiP`               | **EXPERIMENTAL:** Whether the browser should automatically toggle picture-in-picture mode as the user switches back and forth between this document and another document or application.                                                                                           | `boolean ∣ undefined`                              | `undefined`  |
| `config`                | The `hls.js` configuration.                                                                                                                                                                                                                                                        | `any`                                              | `undefined`  |
| `controlsList`          | Determines what controls to show on the media element whenever the browser shows its own set of controls (e.g. when the controls attribute is specified).                                                                                                                          | `string ∣ undefined`                               | `undefined`  |
| `crossOrigin`           | Whether to use CORS to fetch the related image. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) for more information.                                                                                                                          | `"" ∣ "anonymous" ∣ "use-credentials" ∣ undefined` | `undefined`  |
| `disablePiP`            | **EXPERIMENTAL:** Prevents the browser from suggesting a picture-in-picture context menu or to request picture-in-picture automatically in some cases.                                                                                                                             | `boolean ∣ undefined`                              | `undefined`  |
| `disableRemotePlayback` | **EXPERIMENTAL:** Whether to disable the capability of remote playback in devices that are attached using wired (HDMI, DVI, etc.) and wireless technologies (Miracast, Chromecast, DLNA, AirPlay, etc).                                                                            | `boolean ∣ undefined`                              | `undefined`  |
| `libSrc`                | The URL where the `hls.js` library source can be found. If this property is used, then the `version` property is ignored.                                                                                                                                                          | `string ∣ undefined`                               | `undefined`  |
| `mediaTitle`            | The title of the current media.                                                                                                                                                                                                                                                    | `string ∣ undefined`                               | `undefined`  |
| `poster`                | A URL for an image to be shown while the video is downloading. If this attribute isn't specified, nothing is displayed until the first frame is available, then the first frame is shown as the poster frame.                                                                      | `string ∣ undefined`                               | `undefined`  |
| `preload`               | Provides a hint to the browser about what the author thinks will lead to the best user experience with regards to what content is loaded before the video is played. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload) for more information. | `"" ∣ "auto" ∣ "metadata" ∣ "none" ∣ undefined`    | `'metadata'` |
| `version`               | The NPM package version of the `hls.js` library to download and use if HLS is not natively supported.                                                                                                                                                                              | `string`                                           | `'latest'`   |


## Events

| Event     | Description                         | Type               |
| --------- | ----------------------------------- | ------------------ |
| `vmError` | Emitted when an error has occurred. | `CustomEvent<any>` |


## Slots

| Slot | Description                                                    |
| ---- | -------------------------------------------------------------- |
|      | Pass `<source>` elements to the underlying HTML5 media player. |


## Dependencies

### Depends on

- [vm-video](./video)


