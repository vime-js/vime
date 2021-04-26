---
title: vm-icon
sidebar_label: Icon
---

_This component was inspired by [Shoelace](https://shoelace.style/)._

Loads and renders an SVG icon. The icon be loaded from an [icon library](./icon-library) or from
an absolute URL via the `src` property. Only SVGs on a local or CORS-enabled endpoint are
supported. If you're using more than one custom icon, it might make sense to register a custom
[icon library](./icon-library).

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

```html
<!-- Src. -->
<vm-icon src="/icons/my-icon.svg" label="An icon"></vm-icon>

<!-- Icon library. -->
<vm-icon name="pause" library="material" label="Pause"></vm-icon>
```


</TabItem>

<TabItem value="react">

```tsx {2,8,11}
import React from 'react';
import { Icon } from '@vime/react';

function Example() {
  return (
    <div>
      {/* Src. */}
      <Icon src="/icons/my-icon.svg" label="An icon" />

      {/* Icon library. */}
      <Icon name="play" library="material" label="Play" />
    </div>
  );
}
```


</TabItem>

<TabItem value="vue">

```html {4,7,12,16} title="example.vue"
<template>
  <div>
    <!-- Src. -->
    <Icon src="/icons/my-icon.svg" label="An icon" />

    <!-- Icon library. -->
    <Icon name="pause" library="material" label="Pause" />
  </div>
</template>

<script>
  import { Icon } from '@vime/vue';

  export default {
    components: {
      Icon,
    },
  };
</script>
```


</TabItem>

<TabItem value="svelte">

```html {2,5,8} title="example.svelte"
<!-- Src. -->
<Icon src="/icons/my-icon.svg" label="An icon" />

<!-- Icon library. -->
<Icon name="pause" library="material" label="Pause" />

<script lang="ts">
  import { Icon } from '@vime/svelte';
<script>
```


</TabItem>

<TabItem value="stencil">

```tsx {6,9}
class Example {
  render() {
    return (
      <div>
        {/* Src. */}
        <vm-icon src="/icons/my-icon.svg" label="An icon" />

        {/* Icon library. */}
        <vm-icon name="play" library="material" label="Play" />
      </div>
    );
  }
}
```


</TabItem>

<TabItem value="angular">

```html title="example.html"
<!-- Src. -->
<vm-icon src="/icons/my-icon.svg" label="An icon"></vm-icon>

<!-- Icon library. -->
<vm-icon name="play" library="material" label="Play"></vm-icon>
```


</TabItem>
</Tabs>


## Properties

| Property  | Description                                                                                                   | Type                 | Default     |
| --------- | ------------------------------------------------------------------------------------------------------------- | -------------------- | ----------- |
| `label`   | An alternative description to use for accessibility. If omitted, the name or src will be used to generate it. | `string ∣ undefined` | `undefined` |
| `library` | The name of a registered icon library.                                                                        | `string ∣ undefined` | `undefined` |
| `name`    | The name of the icon to draw.                                                                                 | `string ∣ undefined` | `undefined` |
| `src`     | The absolute URL of an SVG file to load.                                                                      | `string ∣ undefined` | `undefined` |


## Events

| Event     | Description                           | Type                                            |
| --------- | ------------------------------------- | ----------------------------------------------- |
| `vmError` | Emitted when the icon failed to load. | `CustomEvent<{ status?: number ∣ undefined; }>` |
| `vmLoad`  | Emitted when the icon has loaded.     | `CustomEvent<void>`                             |


## CSS Custom Properties

| Name                   | Description                          |
| ---------------------- | ------------------------------------ |
| `--vm-icon-fill`       | The icon fill color.                 |
| `--vm-icon-stroke`     | The icon stroke color.               |
| `--vm-icon-transform`  | Transformations applied to the icon. |
| `--vm-icon-transition` | Transitions applied to the icon.     |


## Dependencies

### Used by

 - [vm-caption-control](./controls/caption-control)
 - [vm-fullscreen-control](./controls/fullscreen-control)
 - [vm-menu-item](./settings/menu-item)
 - [vm-mute-control](./controls/mute-control)
 - [vm-pip-control](./controls/pip-control)
 - [vm-playback-control](./controls/playback-control)
 - [vm-settings-control](./controls/settings-control)


