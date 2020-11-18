---
title: Player
sidebar_label: Player
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

Everything starts with the [player component](../components/core/player), which wraps 
all [providers](./providers), plugins (coming soon) and [UI](./ui) components together. It's responsible
for holding the state of the player such as whether to autoplay or show controls, and the state 
of media playback such as the current time or duration. This is the primary component 
you will interact with similar to the `audio` and `video` HTML5 elements, and for simple needs you wont 
need to go much further than this.

Let's setup the "shell" of the player so we can start laying out the rest of it:

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

```html title="player.html"
<vm-player>
  <!-- Provider component is placed here. -->

  <vm-ui>
    <!-- UI components are placed here. -->
  </vm-ui>
</vm-player>
```

</TabItem>

<TabItem value="react">

```tsx title="Player.tsx"
import React from 'react';
import { Player, Ui } from '@vime/react';

function Player() {
  return (
    <Player>
      {/* Provider component is placed here. */}

      <Ui>
        {/* UI components are placed here. */}
      </Ui>
    </Player>
  );
}
```

</TabItem>

<TabItem value="vue">

```html title="Player.vue"
<template>
  <Player>
    <!-- Provider component is placed here. -->

    <Ui>
      <!-- UI components are placed here. -->
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
    },
  };
</script>
```

</TabItem>

<TabItem value="svelte">

```html title="Player.svelte"
<Player>
  <!-- Provider component is placed here. -->

  <Ui>
    <!-- UI components are placed here. -->
  </Ui>
</Player>

<script lang="ts">
  import { Player, Ui } from '@vime/svelte';
</script>
```

</TabItem>

<TabItem value="stencil">

```tsx title="player.tsx"
class Player {
  // ...

  render() {
    return (
      <vm-player>
        {/* Provider component is placed here. */}

        <vm-ui>
          {/* UI components are placed here. */}
        </vm-ui>
      </vm-player>
    );
  }
}
```

</TabItem>

<TabItem value="angular">

```html title="player.html"
<vm-player>
  <!-- Provider component is placed here. -->

  <vm-ui>
    <!-- UI components are placed here. -->
  </vm-ui>
</vm-player>
```

</TabItem>
    
</Tabs>

All the player properties, methods, events and CSS properties are listed and demonstrated in the 
[player component API](../components/core/player) document, so feel free to dig through and see what power 
lays ahead. There are also simple examples setup on our GitHub so you can get a feel of the player 
quickly:

- [HTML](https://github.com/vime-js/vime/tree/master/examples/html)
- [React](https://github.com/vime-js/vime/tree/master/examples/react)
- [Vue](https://github.com/vime-js/vime/tree/master/examples/vue)
- [Angular](https://github.com/vime-js/vime/tree/master/examples/angular)
- [Svelte](https://github.com/vime-js/vime/tree/master/examples/svelte)
- [Stencil](https://github.com/vime-js/vime/tree/master/examples/stencil)

🚂 &nbsp;Let's move onto [setting up our provider!](./providers)