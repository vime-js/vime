---
title: vm-live-indicator
sidebar_label: LiveIndicator
---

This can be used to indicate to the user that the current media is being streamed live.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/src/components/ui/live-indicator/live-indicator.png"
  alt="Vime live indicator component"
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

```html {7}
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-controls>
      <!-- ... -->
      <vm-live-indicator></vm-live-indicator>
    </vm-controls>
  </vm-ui>
</vm-player>
```

</TabItem>

<TabItem value="react">

```tsx {6,16}
import React from 'react';
import { Player, Ui, Controls, LiveIndicator } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls>
          <LiveIndicator />
        </Controls>
      </Ui>
    </Player>
  );
}
```

</TabItem>

<TabItem value="vue">

```html {7,18,26} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Controls>
        <LiveIndicator />
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Controls, LiveIndicator } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      LiveIndicator,
    },
  };
</script>
```

</TabItem>

<TabItem value="svelte">

```html {6,17} title="example.svelte"
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <Controls>
      <LiveIndicator />
    </Controls>
  </Ui>
</Player>

<script lang="ts">
  import { Player, Ui, Icons, Controls, LiveIndicator } from '@vime/svelte';
</script>
```

</TabItem>

<TabItem value="stencil">

```tsx {9}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-controls>
            <vm-live-indicator />
          </vm-controls>
        </vm-ui>
      </vm-player>
    );
  }
}
```

</TabItem>

<TabItem value="angular">

```html {7} title="example.html"
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-controls>
      <!-- ... -->
      <vm-live-indicator></vm-live-indicator>
    </vm-controls>
  </vm-ui>
</vm-player>
```

</TabItem>
</Tabs>

## CSS Custom Properties

| Name                        | Description                          |
| --------------------------- | ------------------------------------ |
| `--vm-live-indicator-color` | The color of the live indicator dot. |

## Dependencies

### Used by

- [vm-default-controls](./controls/default-controls)
