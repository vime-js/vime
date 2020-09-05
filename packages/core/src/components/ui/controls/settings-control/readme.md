# vime-settings-control

A control for toggling the visiblity of the settings menu. This control is not displayed if no
settings (`vime-settings`) has been provided for the current player.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/settings-control/settings-control.png"
  alt="Vime settings control component"
/>

<!-- Auto Generated Below -->


## Usage

### Angular

```html {7} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-controls>
      <!-- ... -->
      <vime-settings-control></vime-settings-control>
    </vime-controls>
  </vime-ui>
</vime-player>
```


### Html

```html {7}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-controls>
      <!-- ... -->
      <vime-settings-control></vime-settings-control>
    </vime-controls>
  </vime-ui>
</vime-player>
```


### React

```tsx {6,16}
import React from 'react';
import {
  VimePlayer,
  VimeUi,
  VimeControls,
  VimeSettingsControl,
} from '@vime/react';

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeControls>
          <VimeSettingsControl />
        </VimeControls>
      </VimeUi>
    </VimePlayer>
  );
}
```


### Svelte

```html {6,16} title="example.svelte"
<VimePlayer>
  <!-- ... -->
  <VimeUi>
    <!-- ... -->
    <VimeControls>
      <VimeSettingsControl />
    </VimeControls>
  </VimeUi>
</VimePlayer>

<script lang="ts">
  import {
    VimePlayer,
    VimeUi,
    VimeControls,
    VimeSettingsControl,
  } from '@vime/svelte';
</script>
```


### Vue

```html {7,18,26} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeControls>
        <VimeSettingsControl />
      </VimeControls>
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import {
    VimePlayer,
    VimeUi,
    VimeControls,
    VimeSettingsControl,
  } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeControls,
      VimeSettingsControl,
    },
  };
</script>
```



## Properties

| Property           | Attribute           | Description                                     | Type                             | Default            |
| ------------------ | ------------------- | ----------------------------------------------- | -------------------------------- | ------------------ |
| `icon`             | `icon`              | The URL to an SVG element or fragment to load.  | `string`                         | `'#vime-settings'` |
| `tooltipDirection` | `tooltip-direction` | The direction in which the tooltip should grow. | `"left" \| "right" \| undefined` | `undefined`        |


## Dependencies

### Used by

 - [vime-default-controls](../default-controls)

### Depends on

- [vime-control](../control)
- [vime-icon](../../icon)
- [vime-tooltip](../../tooltip)

### Graph
```mermaid
graph TD;
  vime-settings-control --> vime-control
  vime-settings-control --> vime-icon
  vime-settings-control --> vime-tooltip
  vime-default-controls --> vime-settings-control
  style vime-settings-control fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
