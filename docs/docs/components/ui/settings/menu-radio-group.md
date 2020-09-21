---
title: vime-menu-radio-group
sidebar_label: MenuRadioGroup
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

A collection of radio buttons describing a set of related options. Only one radio button in a group
can be selected at the same time.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/settings/menu-radio-group/menu-radio-group.png"
  alt="Vime settings menu radio group component"
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
{ label: 'Stencil', value: 'stencil' },
{ label: 'Angular', value: 'angular' }
]}>

<TabItem value="html">

```html {7-11}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-settings>
      <vime-submenu label="Playback Rate">
        <vime-menu-radio-group value="1">
          <vime-menu-radio label="0.5" value="0.5" />
          <vime-menu-radio label="Normal" value="1" />
          <vime-menu-radio label="2" value="2" />
        </vime-menu-radio-group>
      </vime-submenu>
    </vime-settings>
  </vime-ui>
</vime-player>
```

</TabItem>


<TabItem value="react">

```tsx {7,26-30}
import React, { useState } from 'react';
import {
  VimePlayer,
  VimeUi,
  VimeSettings,
  VimeSubmenu,
  VimeMenuRadioGroup,
  VimeMenuRadio,
} from '@vime/react';

function Example() {
  const [value, setValue] = useState('1');

  const onValueChange = (event: Event) => {
    const radio = event.target as HTMLVimeMenuRadioElement;
    setValue(radio.value);
  };

  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeSettings>
          <VimeSubmenu label="Playback Rate">
            <VimeMenuRadioGroup value={value} onVCheck={onValueChange}>
              <VimeMenuRadio label="0.5" value="0.5" />
              <VimeMenuRadio label="Normal" value="1" />
              <VimeMenuRadio label="2" value="2" />
            </VimeMenuRadioGroup>
          </VimeSubmenu>
        </VimeSettings>
      </VimeUi>
    </VimePlayer>
  );
}
```

</TabItem>


<TabItem value="vue">

```html {8-12,25,35} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeSettings>
        <VimeSubmenu label="Playback Rate">
          <VimeMenuRadioGroup :value="value" @vCheck="onValueChange($event)">
            <VimeMenuRadio label="0.5" value="0.5" />
            <VimeMenuRadio label="Normal" value="1" />
            <VimeMenuRadio label="2" value="2" />
          </VimeMenuRadioGroup>
        </VimeSubmenu>
      </VimeSettings>
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import {
    VimePlayer,
    VimeUi,
    VimeSettings,
    VimeSubmenu,
    VimeMenuRadioGroup,
    VimeMenuRadio,
  } from "@vime/vue";

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeSettings,
      VimeSubmenu,
      VimeMenuRadioGroup,
      VimeMenuRadio,
    },
    data: {
      value: 1,
    },
    methods: {
      onValueChange(event) {
        const radio = event.target as HTMLVimeMenuRadioElement;
        this.value = radio.value;
      },
    },
  };
</script>
```

</TabItem>


<TabItem value="svelte">

```tsx {7-11}
<VimePlayer>
  <!-- ... -->
  <VimeUi>
    <!-- ... -->
    <VimeSettings>
      <VimeSubmenu label="Playback Rate">
        <VimeMenuRadioGroup value={value} on:vCheck={onValueChange}>
          <VimeMenuRadio label="0.5" value="0.5" />
          <VimeMenuRadio label="Normal" value="1" />
          <VimeMenuRadio label="2" value="2" />
        </VimeMenuRadioGroup>
      </VimeSubmenu>
    </VimeSettings>
  </VimeUi>
</VimePlayer>
```

```html {7}
<script lang="ts">
  import {
    VimePlayer,
    VimeUi,
    VimeSettings,
    VimeSubmenu,
    VimeMenuRadioGroup,
    VimeMenuRadio,
  } from '@vime/svelte';

  let value = '1';

  const onValueChange = (event: Event) => {
    const radio = event.target as HTMLVimeMenuRadioElement;
    value = radio.value;
  };
</script>
```

</TabItem>


<TabItem value="stencil">

```tsx {17-24}
class Example {
  @State() value = '1';

  private onValueChange(event: Event) {
    const radio = event.target as HTMLVimeMenuRadioElement;
    this.value = radio.value;
  }

  render() {
    return (
      <vime-player>
        {/* ... */}
        <vime-ui>
          {/* ... */}
          <vime-settings>
            <vime-submenu label="Playback Rate">
              <vime-menu-radio-group
                value={this.value}
                onVCheck={this.onValueChange.bind(this)}
              >
                <vime-menu-radio label="0.5" value="0.5" />
                <vime-menu-radio label="Normal" value="1" />
                <vime-menu-radio label="2" value="2" />
              </vime-menu-radio-group>
            </vime-submenu>
          </vime-settings>
        </vime-ui>
      </vime-player>
    );
  }
}
```

</TabItem>


<TabItem value="angular">

```html {7-11} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-settings>
      <vime-submenu label="Playback Rate">
        <vime-menu-radio-group [value]="value" (vCheck)="onValueChange($event)">
          <vime-menu-radio label="0.5" value="0.5" />
          <vime-menu-radio label="Normal" value="1" />
          <vime-menu-radio label="2" value="2" />
        </vime-menu-radio-group>
      </vime-submenu>
    </vime-settings>
  </vime-ui>
</vime-player>
```

```ts title="example.ts"
import { VimeMenuRadio } from '@vime/angular';

class Example {
  value = '1';

  onValueChange(event: Event) {
    const radio = event.target as VimeMenuRadio;
    this.value = radio.value;
  }
}
```

</TabItem>
    
</Tabs>


## Properties

| Property | Attribute | Description                                | Type                 | Default     |
| -------- | --------- | ------------------------------------------ | -------------------- | ----------- |
| `value`  | `value`   | The current value selected for this group. | `string ∣ undefined` | `undefined` |

## Events

| Event    | Description                                                 | Type                |
| -------- | ----------------------------------------------------------- | ------------------- |
| `vCheck` | Emitted when a new radio button is selected for this group. | `CustomEvent<void>` |

## Slots

| Slot | Description                                        |
| ---- | -------------------------------------------------- |
|      | Used to pass in radio buttons (`vime-menu-radio`). |

## Dependencies

### Used by

- [vime-default-settings](default-settings.md)

### Graph

```mermaid
graph TD;
  vime-default-settings --> vime-menu-radio-group
  style vime-menu-radio-group fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
