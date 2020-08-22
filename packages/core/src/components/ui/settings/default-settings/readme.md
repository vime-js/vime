# vime-default-settings

Creates a settings menu with options for changing the playback rate, quality and captions of
the current media. This component is provider aware. For example, it will only show options for
changing the playback rate if the current provider allows changing it (`player.canSetPlaybackRate()`).
In addition, you can extend the settings with more options via the default `slot`.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/settings/default-settings/default-settings.png"
  alt="Vime default settings component"
/>

<!-- Auto Generated Below -->

## Usage

### Angular

```html {5} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-default-settings></vime-default-settings>
  </vime-ui>
</vime-player>
```

### Html

```html {5}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-default-settings></vime-default-settings>
  </vime-ui>
</vime-player>
```

### React

```tsx {2,10}
import React from 'react';
import { VimePlayer, VimeUi, VimeDefaultSettings } from '@vime/react';

function Example() {
  return render(
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeDefaultSettings />
      </VimeUi>
    </VimePlayer>
  );
}
```

### Vue

```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeDefaultSettings />
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeDefaultSettings } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeDefaultSettings,
    },
  };
</script>
```

## Slots

| Slot | Description                                                                                        |
| ---- | -------------------------------------------------------------------------------------------------- |
|      | Used to extend the settings with additional menu options (see `vime-submenu` or `vime-menu-item`). |

## Dependencies

### Used by

- [vime-default-ui](../../default-ui)

### Depends on

- [vime-menu-item](../menu-item)
- [vime-menu-radio](../menu-radio)
- [vime-submenu](../submenu)
- [vime-menu-radio-group](../menu-radio-group)
- [vime-settings](../settings)

### Graph

```mermaid
graph TD;
  vime-default-settings --> vime-menu-item
  vime-default-settings --> vime-menu-radio
  vime-default-settings --> vime-submenu
  vime-default-settings --> vime-menu-radio-group
  vime-default-settings --> vime-settings
  vime-menu-item --> vime-icon
  vime-menu-radio --> vime-menu-item
  vime-submenu --> vime-menu-item
  vime-submenu --> vime-menu
  vime-settings --> vime-menu
  vime-default-ui --> vime-default-settings
  style vime-default-settings fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
