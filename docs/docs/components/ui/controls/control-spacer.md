---
title: vm-control-spacer
sidebar_label: ControlSpacer
---

Used to space controls out vertically/horizontally. Under the hood it's simply `flex: 1`.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/control-spacer/control-spacer.png"
  alt="Vime control spacer component"
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

```html {8}
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-controls full-width>
      <vm-playback-control></vm-playback-control>
      <vm-volume-control></vm-volume-control>
      <vm-control-spacer></vm-control-spacer>
      <vm-fullscreen-control></vm-fullscreen-control>
    </vm-controls>
  </vm-ui>
</vm-player>
```


</TabItem>

<TabItem value="react">

```tsx {8,20}
import React from 'react';
import {
  Player,
  Ui,
  Controls,
  PlaybackControl,
  VolumeControl,
  ControlSpacer,
  FullscreenControl,
} from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        <Controls fullWidth>
          <PlaybackControl />
          <VolumeControl />
          <ControlSpacer />
          <FullscreenControl />
        </Controls>
      </Ui>
    </Player>
  );
}
```


</TabItem>

<TabItem value="vue">

```html {8,22,33} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <Controls>
        <PlaybackControl />
        <VolumeControl />
        <ControlSpacer />
        <FullscreenControl />
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import {
    Player,
    Ui,
    Controls,
    PlaybackControl,
    VolumeControl,
    ControlSpacer,
    FullscreenControl,
  } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      PlaybackControl,
      VolumeControl,
      ControlSpacer,
      FullscreenControl,
    },
  };
</script>
```


</TabItem>

<TabItem value="svelte">

```html {8,21} title="example.svelte"
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <Controls fullWidth>
      <PlaybackControl />
      <VolumeControl />
      <ControlSpacer />
      <FullscreenControl />
    </Controls>
  </Ui>
</Player>

<script lang="ts">
  import {
    Player,
    Ui,
    Controls,
    PlaybackControl,
    VolumeControl,
    ControlSpacer,
    FullscreenControl,
  } from '@vime/svelte';
</script>
```


</TabItem>

<TabItem value="stencil">

```tsx {11}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-controls fullWidth>
            <vm-playback-control />
            <vm-volume-control />
            <vm-control-spacer />
            <vm-fullscreen-control />
          </vm-controls>
        </vm-ui>
      </vm-player>
    );
  }
}
```

</TabItem>

<TabItem value="angular">

```html {8} title="example.html"
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-controls full-width>
      <vm-playback-control></vm-playback-control>
      <vm-volume-control></vm-volume-control>
      <vm-control-spacer></vm-control-spacer>
      <vm-fullscreen-control></vm-fullscreen-control>
    </vm-controls>
  </vm-ui>
</vm-player>
```


</TabItem>
</Tabs>


## Dependencies

### Used by

 - [vm-default-controls](./default-controls)


