---
title: vm-default-controls
sidebar_label: DefaultControls
---

Default set of controls for when you're in a hurry. The controls displayed depend on whether
the media is audio/video/live, and whether the device is mobile/desktop. See
[`vime-default-ui`](../default-ui.md) for visuals.

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

```html {5}
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-default-controls active-duration="2750"></vm-default-controls>
  </vm-ui>
</vm-player>
```


</TabItem>

<TabItem value="react">

```tsx {2,10}
import React from 'react';
import { Player, Ui, DefaultControls } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <DefaultControls activeDuration={3200} />
      </Ui>
    </Player>
  );
}
```


</TabItem>

<TabItem value="vue">

```html {6,12,18} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <DefaultControls :activeDuration="3200" />
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, DefaultControls } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      DefaultControls,
    },
  };
</script>
```


</TabItem>

<TabItem value="svelte">

```tsx {5}
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <DefaultControls activeDuration={3200} />
  </Ui>
</Player>
```

```html {2}
<script lang="ts">
  import { Player, Ui, DefaultControls } from '@vime/svelte';
</script>
```


</TabItem>

<TabItem value="stencil">

```tsx {8}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-default-controls activeDuration={3200} />
        </vm-ui>
      </vm-player>
    );
  }
}
```


</TabItem>

<TabItem value="angular">

```html {5} title="example.html"
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-default-controls [active-duration]="2750"></vm-default-controls>
  </vm-ui>
</vm-player>
```


</TabItem>
</Tabs>


## Properties

| Property               | Description                                                                                                                 | Type      | Default |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `activeDuration`       | The length in milliseconds that the controls are active for before fading out. Audio players are not effected by this prop. | `number`  | `2750`  |
| `hideOnMouseLeave`     | Whether the controls should hide when the mouse leaves the player. Audio players are not effected by this prop.             | `boolean` | `false` |
| `hideWhenPaused`       | Whether the controls should show/hide when paused. Audio players are not effected by this prop.                             | `boolean` | `false` |
| `waitForPlaybackStart` | Whether the controls should wait for playback to start before being shown. Audio players are not effected by this prop.     | `boolean` | `false` |


## Dependencies

### Used by

 - [vm-default-ui](./../default-ui)

### Depends on

- [vm-controls](./controls)
- [vm-playback-control](./playback-control)
- [vm-volume-control](./volume-control)
- [vm-current-time](./../time/current-time)
- [vm-control-spacer](./control-spacer)
- [vm-scrubber-control](./scrubber-control)
- [vm-live-indicator](./../live-indicator)
- [vm-end-time](./../time/end-time)
- [vm-settings-control](./settings-control)
- [vm-scrim](./../scrim)
- [vm-caption-control](./caption-control)
- [vm-fullscreen-control](./fullscreen-control)
- [vm-control-group](./control-group)
- [vm-time-progress](./../time/time-progress)
- [vm-pip-control](./pip-control)


