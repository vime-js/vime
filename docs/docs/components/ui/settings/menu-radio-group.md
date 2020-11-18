---
title: vm-menu-radio-group
sidebar_label: MenuRadioGroup
---

A collection of radio buttons describing a set of related options. Only one radio button in a group
can be selected at the same time.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/settings/menu-radio-group/menu-radio-group.png"
  alt="Vime settings menu radio group component"
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

```html {7-11}
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-settings>
      <vm-submenu label="Playback Rate">
        <vm-menu-radio-group value="1">
          <vm-menu-radio label="0.5" value="0.5" />
          <vm-menu-radio label="Normal" value="1" />
          <vm-menu-radio label="2" value="2" />
        </vm-menu-radio-group>
      </vm-submenu>
    </vm-settings>
  </vm-ui>
</vm-player>
```


</TabItem>

<TabItem value="react">

```tsx {7,26-30}
import React, { useState } from 'react';
import {
  Player,
  Ui,
  Settings,
  Submenu,
  MenuRadioGroup,
  MenuRadio,
} from '@vime/react';

function Example() {
  const [value, setValue] = useState('1');

  const onValueChange = (event: Event) => {
    const radio = event.target as HTMLVmMenuRadioElement;
    setValue(radio.value);
  };

  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Settings>
          <Submenu label="Playback Rate">
            <MenuRadioGroup value={value} onVmCheck={onValueChange}>
              <MenuRadio label="0.5" value="0.5" />
              <MenuRadio label="Normal" value="1" />
              <MenuRadio label="2" value="2" />
            </MenuRadioGroup>
          </Submenu>
        </Settings>
      </Ui>
    </Player>
  );
}
```


</TabItem>

<TabItem value="vue">

```html {8-12,25,35} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Settings>
        <Submenu label="Playback Rate">
          <MenuRadioGroup :value="value" @vmCheck="onValueChange($event)">
            <MenuRadio label="0.5" value="0.5" />
            <MenuRadio label="Normal" value="1" />
            <MenuRadio label="2" value="2" />
          </MenuRadioGroup>
        </Submenu>
      </Settings>
    </Ui>
  </Player>
</template>

<script>
  import {
    Player,
    Ui,
    Settings,
    Submenu,
    MenuRadioGroup,
    MenuRadio,
  } from "@vime/vue";

  export default {
    components: {
      Player,
      Ui,
      Settings,
      Submenu,
      MenuRadioGroup,
      MenuRadio,
    },
    data: {
      value: 1,
    },
    methods: {
      onValueChange(event) {
        const radio = event.target as HTMLVmMenuRadioElement;
        this.value = radio.value;
      },
    },
  };
</script>
```


</TabItem>

<TabItem value="svelte">

```tsx {7-11}
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <Settings>
      <Submenu label="Playback Rate">
        <MenuRadioGroup value={value} on:vmCheck={onValueChange}>
          <MenuRadio label="0.5" value="0.5" />
          <MenuRadio label="Normal" value="1" />
          <MenuRadio label="2" value="2" />
        </MenuRadioGroup>
      </Submenu>
    </Settings>
  </Ui>
</Player>
```

```html {7}
<script lang="ts">
  import {
    Player,
    Ui,
    Settings,
    Submenu,
    MenuRadioGroup,
    MenuRadio,
  } from '@vime/svelte';

  let value = '1';

  const onValueChange = (event: Event) => {
    const radio = event.target as HTMLVmMenuRadioElement;
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
    const radio = event.target as HTMLVmMenuRadioElement;
    this.value = radio.value;
  }

  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-settings>
            <vm-submenu label="Playback Rate">
              <vm-menu-radio-group 
                value={this.value} 
                onVmCheck={this.onValueChange.bind(this)}
              >
                <vm-menu-radio label="0.5" value="0.5" />
                <vm-menu-radio label="Normal" value="1" />
                <vm-menu-radio label="2" value="2" />
              </vm-menu-radio-group>
            </vm-submenu>
          </vm-settings>
        </vm-ui>
      </vm-player>
    );
  }
}
```

</TabItem>

<TabItem value="angular">

```html {7-11} title="example.html"
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-settings>
      <vm-submenu label="Playback Rate">
        <vm-menu-radio-group [value]="value" (vmCheck)="onValueChange($event)">
          <vm-menu-radio label="0.5" value="0.5" />
          <vm-menu-radio label="Normal" value="1" />
          <vm-menu-radio label="2" value="2" />
        </vm-menu-radio-group>
      </vm-submenu>
    </vm-settings>
  </vm-ui>
</vm-player>
```

```ts title="example.ts"
import { MenuRadio } from '@vime/angular';

class Example {
  value = '1';

  onValueChange(event: Event) {
    const radio = event.target as MenuRadio;
    this.value = radio.value;
  }
}
```


</TabItem>
</Tabs>


## Properties

| Property | Description                                | Type                 | Default     |
| -------- | ------------------------------------------ | -------------------- | ----------- |
| `value`  | The current value selected for this group. | `string ∣ undefined` | `undefined` |


## Events

| Event     | Description                                                 | Type                |
| --------- | ----------------------------------------------------------- | ------------------- |
| `vmCheck` | Emitted when a new radio button is selected for this group. | `CustomEvent<void>` |


## Slots

| Slot | Description                                      |
| ---- | ------------------------------------------------ |
|      | Used to pass in radio buttons (`vm-menu-radio`). |


## Dependencies

### Used by

 - [vm-default-settings](./default-settings)


