---
title: vime-icon
sidebar_label: Icon
slug: api
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

Renders and displays an SVG icon. The SVG markup can be passed in directly or it can be loaded via
a URL. It's preferrable to load a sprite via `vime-icons` and reference the icon using the `href`
property.

<!-- Auto Generated Below -->

## Usage

<Tabs
groupId="framework"
defaultValue="html"
values={[
{ label: 'HTML', value: 'html' },
{ label: 'React', value: 'react' },
{ label: 'Vue', value: 'vue' },
{ label: 'Angular', value: 'angular' }
]}>

<TabItem value="html">

```html
<!-- Markup -->
<vime-icon>
  <rect width="300" height="100" />
</vime-icon>

<!-- URL -->
<vime-icon href="#vime-play"></vime-icon>
```

</TabItem>

<TabItem value="react">

```tsx {2,8-10,13}
import React from 'react';
import { VimeIcon } from '@vime/react';

function Example() {
  return render(
    <div>
      {/* Markup */}
      <VimeIcon>
        <rect width="300" height="100" />
      </VimeIcon>

      {/* URL */}
      <VimeIcon href="#vime-play" />
    </div>
  );
}
```

</TabItem>

<TabItem value="vue">

```html {4-6,9,14,18} title="example.vue"
<template>
  <div>
    <!-- Markup -->
    <VimeIcon>
      <rect width="300" height="100" />
    </VimeIcon>

    <!-- URL -->
    <VimeIcon href="#vime-play" />
  </div>
</template>

<script>
  import { VimeIcon } from '@vime/vue';

  export default {
    components: {
      VimeIcon,
    },
  };
</script>
```

</TabItem>

<TabItem value="angular">

```html title="example.html"
<!-- Markup -->
<vime-icon>
  <rect width="400" height="200" />
</vime-icon>

<!-- URL -->
<vime-icon href="#vime-play"></vime-icon>
```

</TabItem>
    
</Tabs>

## Properties

| Property  | Attribute | Description                                                                       | Type                 | Default     |
| --------- | --------- | --------------------------------------------------------------------------------- | -------------------- | ----------- |
| `color`   | `color`   | The color (fill) of the icon.                                                     | `string ∣ undefined` | `undefined` |
| `href`    | `href`    | The URL to an SVG element or fragment to load.                                    | `string ∣ undefined` | `undefined` |
| `opacity` | `opacity` | The amount of transparency to add to the icon.                                    | `number`             | `1`         |
| `scale`   | `scale`   | The amount to scale the size of the icon (respecting aspect ratio) up or down by. | `number`             | `1`         |

## Slots

| Slot | Description                                            |
| ---- | ------------------------------------------------------ |
|      | Used to pass in SVG markup to be drawn by the browser. |

## CSS Custom Properties

| Name            | Description             |
| --------------- | ----------------------- |
| `--icon-height` | The height of the icon. |
| `--icon-width`  | The width of the icon.  |

## Dependencies

### Used by

- [vime-caption-control](../controls/caption-control/readme.md)
- [vime-fullscreen-control](../controls/fullscreen-control/readme.md)
- [vime-menu-item](../settings/menu-item/readme.md)
- [vime-mute-control](../controls/mute-control/readme.md)
- [vime-pip-control](../controls/pip-control/readme.md)
- [vime-playback-control](../controls/playback-control/readme.md)
- [vime-settings-control](../controls/settings-control/readme.md)

### Graph

```mermaid
graph TD;
  vime-caption-control --> vime-icon
  vime-fullscreen-control --> vime-icon
  vime-menu-item --> vime-icon
  vime-mute-control --> vime-icon
  vime-pip-control --> vime-icon
  vime-playback-control --> vime-icon
  vime-settings-control --> vime-icon
  style vime-icon fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
