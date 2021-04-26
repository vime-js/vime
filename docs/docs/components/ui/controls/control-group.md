---
title: vm-control-group
sidebar_label: ControlGroup
---

A simple container that enables player controls to be organized into groups. Each group starts on
a new line.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/control-group/control-group.png"
  alt="Vime control group component"
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

```html {6-8,10-13}
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-controls full-width>
      <vm-control-group>
        <vm-scrubber-control></vm-scrubber-control>
      </vm-control-group>

      <vm-control-group space="top">
        <vm-playback-control></vm-playback-control>
        <vm-volume-control></vm-volume-control>
      </vm-control-group>
    </vm-controls>
  </vm-ui>
</vm-player>
```


</TabItem>

<TabItem value="react">

```tsx {6,18-20,22-25}
import React from 'react';
import {
  Player,
  Ui,
  Controls,
  ControlGroup,
  ScrubberControl,
  PlaybackControl,
  VolumeControl,
} from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        <Controls fullWidth>
          <ControlGroup>
            <ScrubberControl />
          </ControlGroup>

          <ControlGroup space="top">
            <PlaybackControl />
            <VolumeControl />
          </ControlGroup>
        </Controls>
      </Ui>
    </Player>
  );
}
```


</TabItem>

<TabItem value="vue">

```html {6-8,10-13,24,35} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <Controls>
        <ControlGroup>
          <ScrubberControl />
        </ControlGroup>

        <ControlGroup space="top">
          <PlaybackControl />
          <VolumeControl />
        </ControlGroup>
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import {
    Player,
    Ui,
    Controls,
    ControlGroup,
    ScrubberControl,
    PlaybackControl,
    VolumeControl,
  } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      ControlGroup,
      ScrubberControl,
      PlaybackControl,
      VolumeControl,
    },
  };
</script>
```


</TabItem>

<TabItem value="svelte">

```html {6-8,10-13,26} title="example.svelte"
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <Controls fullWidth>
      <ControlGroup>
        <ScrubberControl />
      </ControlGroup>

      <ControlGroup space="top">
        <PlaybackControl />
        <VolumeControl />
      </ControlGroup>
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
    ScrubberControl,
    ControlGroup,
  } from '@vime/svelte';
</script>
```


</TabItem>

<TabItem value="stencil">

```tsx {8-10,12-15}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          <vm-controls fullWidth>
            <vm-control-group>
              <vm-scrubber-control />
            </vm-control-group>

            <vm-control-group space="top">
              <vm-playback-control />
              <vm-volume-control />
            </vm-control-group>
          </vm-controls>
        </vm-ui>
      </vm-player>
    );
  }
}
```


</TabItem>

<TabItem value="angular">

```html {6-8,10-14}
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-controls>
      <vm-control-group>
        <vm-scrubber-control></vm-scrubber-control>
      </vm-control-group>

      <vm-control-group space="top">
        <vm-playback-control></vm-playback-control>
        <vm-volume-control></vm-volume-control>
        <!-- ... -->
      </vm-control-group>
    </vm-controls>
  </vm-ui>
</vm-player>
```


</TabItem>
</Tabs>


## Properties

| Property | Description                                                                                                                | Type                                 | Default  |
| -------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | -------- |
| `space`  | Determines where to add spacing/margin. The amount of spacing is determined by the CSS variable `--control-group-spacing`. | `"both" ∣ "bottom" ∣ "none" ∣ "top"` | `'none'` |


## CSS Custom Properties

| Name                         | Description                       |
| ---------------------------- | --------------------------------- |
| `--vm-control-group-spacing` | The space between control groups. |


## Dependencies

### Used by

 - [vm-default-controls](./default-controls)


