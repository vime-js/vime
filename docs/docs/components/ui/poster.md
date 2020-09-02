---
title: vime-poster
sidebar_label: Poster
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

Loads the poster set in the player prop `currentPoster` and displays it. The poster will automatically
dissapear once playback starts.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/poster/poster.png"
  alt="Vime poster component"
/>

<!-- Auto Generated Below -->

## Usage

<Tabs
groupId="framework"
defaultValue="html"
values={[
{ label: 'HTML', value: 'html' },
{ label: 'React', value: 'react' },
{ label: 'Vue', value: 'vue' },
{ label: 'Svelte', value: 'svelte' },
{ label: 'Angular', value: 'angular' }
]}>

<TabItem value="html">

```html {5}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-poster></vime-poster>
  </vime-ui>
</vime-player>
```

</TabItem>


<TabItem value="react">

```tsx {2,10}
import React from 'react';
import { VimePlayer, VimeUi, VimePoster } from '@vime/react';

function Example() {
  return render(
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimePoster />
      </VimeUi>
    </VimePlayer>
  );
}
```

</TabItem>


<TabItem value="vue">

```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimePoster />
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimePoster } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimePoster,
    },
  };
</script>
```

</TabItem>


<TabItem value="svelte">

```html {5,10} title="example.svelte"
<VimePlayer>
  <!-- ... -->
  <VimeUi>
    <!-- ... -->
    <VimePoster />
  </VimeUi>
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeUi, VimePoster } from '@vime/svelte';
</script>
```

</TabItem>


<TabItem value="angular">

```html {5} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-poster></vime-poster>
  </vime-ui>
</vime-player>
```

</TabItem>
    
</Tabs>


## Properties

| Property | Attribute | Description                                                                                   | Type                                                               | Default   |
| -------- | --------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------- |
| `fit`    | `fit`     | How the poster image should be resized to fit the container (sets the `object-fit` property). | `"contain" ∣ "cover" ∣ "fill" ∣ "none" ∣ "scale-down" ∣ undefined` | `'cover'` |

## Events

| Event       | Description                             | Type                |
| ----------- | --------------------------------------- | ------------------- |
| `vLoaded`   | Emitted when the poster has loaded.     | `CustomEvent<void>` |
| `vWillHide` | Emitted when the poster will be hidden. | `CustomEvent<void>` |
| `vWillShow` | Emitted when the poster will be shown.  | `CustomEvent<void>` |

## Dependencies

### Used by

- [vime-default-ui](default-ui.md)

### Graph

```mermaid
graph TD;
  vime-default-ui --> vime-poster
  style vime-poster fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
