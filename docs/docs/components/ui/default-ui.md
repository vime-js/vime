---
title: vm-default-ui
sidebar_label: DefaultUI
---

This component is a shorthand way to setup the entire default vime user interface, such as controls,
settings, captions and so on.

## Visuals

There are also alternative interfaces for live media, and the light player theme, but they're not
shown here for the sake of brevity.

### Audio

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/default-ui/default-ui--audio.png"
  alt="Vime default audio player"
/>

### Desktop Video

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/default-ui/default-ui--desktop.png"
  alt="Vime default desktop video player"
/>

### Mobile Video

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/default-ui/default-ui--mobile.png"
  alt="Vime default desktop mobile player"
/>

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

```html {3}
<vm-player>
  <!-- ... -->
  <vm-default-ui></vm-default-ui>
</vm-player>
```


</TabItem>

<TabItem value="react">

```tsx {2,8}
import React from 'react';
import { Player, DefaultUi } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <DefaultUi />
    </Player>
  );
}
```


</TabItem>

<TabItem value="vue">

```html {4,9,14} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <DefaultUi />
  </Player>
</template>

<script>
  import { Player, DefaultUi } from '@vime/vue';

  export default {
    components: {
      Player,
      DefaultUi,
    },
  };
</script>
```


</TabItem>

<TabItem value="svelte">

```html {3,7} title="example.svelte"
<Player>
  <!-- ... -->
  <DefaultUi />
</Player>

<script lang="ts">
  import { Player, DefaultUi } from '@vime/svelte';
</script>
```


</TabItem>

<TabItem value="stencil">

```tsx {6}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-default-ui />
      </vm-player>
    );
  }
}
```


</TabItem>

<TabItem value="angular">

```html {3} title="example.html"
<vm-player>
  <!-- ... -->
  <vm-default-ui></vm-default-ui>
</vm-player>
```


</TabItem>
</Tabs>


## Properties

| Property               | Description                                                           | Type      | Default |
| ---------------------- | --------------------------------------------------------------------- | --------- | ------- |
| `noCaptions`           | Whether the custom captions UI should not be loaded.                  | `boolean` | `false` |
| `noClickToPlay`        | Whether clicking the player should not toggle playback.               | `boolean` | `false` |
| `noControls`           | Whether the custom default controls should not be loaded.             | `boolean` | `false` |
| `noDblClickFullscreen` | Whether double clicking the player should not toggle fullscreen mode. | `boolean` | `false` |
| `noLoadingScreen`      | Whether the default loading screen should not be loaded.              | `boolean` | `false` |
| `noPoster`             | Whether the custom poster UI should not be loaded.                    | `boolean` | `false` |
| `noSettings`           | Whether the custom default settings menu should not be loaded.        | `boolean` | `false` |
| `noSpinner`            | Whether the custom spinner UI should not be loaded.                   | `boolean` | `false` |


## Slots

| Slot | Description                                                          |
| ---- | -------------------------------------------------------------------- |
|      | Used to extend the default user interface with custom UI components. |


## Dependencies

### Depends on

- [vm-ui](./ui)
- [vm-click-to-play](./click-to-play)
- [vm-dbl-click-fullscreen](./dbl-click-fullscreen)
- [vm-captions](./captions)
- [vm-poster](./poster)
- [vm-spinner](./spinner)
- [vm-loading-screen](./loading-screen)
- [vm-default-controls](./controls/default-controls)
- [vm-default-settings](./settings/default-settings)


