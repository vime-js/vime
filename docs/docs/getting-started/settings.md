---
title: Settings
sidebar_label: Settings
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

Settings is a popup menu that contains options to configure the player and media playback.
Just like the controls, Vime comes with both a [control](../components/ui/controls/settings-control)
to open/close the settings menu, and the [menu](../components/ui/settings/default-settings) itself
out of the box for common settings such as playback rate, quality and captions. Like we did
in the [Controls](./controls) guide, we'll first look at how to extend the default settings, and
then how we can go about creating our own. Let's start with extending the default settings...

:::info
See the [DefaultSettings](../components/ui/settings/default-settings) component documentation for
more information on what properties you can pass in.
:::

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

```html {7-9} title="player.html"
<vm-player>
  <!-- ... -->

  <!-- We turn off the settings that come with the default UI. -->
  <vm-default-ui no-settings>
    <!-- We setup the default settings and pass in any options.  -->
    <vm-default-settings pin="bottomRight">
      <!-- We can extend the settings with new options here. -->
    </vm-default-settings>
  </vm-default-ui>
</vm-player>
```

</TabItem>

<TabItem value="react">

```tsx {12-14} title="Player.tsx"
import React from 'react';
import { Player, DefaultUi, DefaultSettings } from '@vime/react';

function Player() {
  return (
    <Player>
      {/* ... */}

      {/* We turn off the settings that come with the default UI. */}
      <DefaultUi noSettings>
        {/* We setup the default settings and pass in any options.  */}
        <DefaultSettings pin="bottomRight">
          {/* We can extend the settings with new options here. */}
        </DefaultSettings>
      </DefaultUi>
    </Player>
  );
}
```

</TabItem>

<TabItem value="vue">

```html {8-10} title="Player.vue"
<template>
  <Player>
    <!-- ... -->

    <!-- We turn off the settings that come with the default UI. -->
    <DefaultUi noSettings>
      <!-- We setup the default settings and pass in any options. -->
      <DefaultSettings pin="bottomRight">
        <!-- We can extend the settings with new options here. -->
      </DefaultSettings>
    </DefaultUi>
  </Player>
</template>

<script>
  import { Player, DefaultUi, DefaultSettings } from '@vime/vue';

  export default {
    components: {
      Player,
      DefaultUi,
      DefaultSettings,
    },
  };
</script>
```

</TabItem>

<TabItem value="svelte">

```html {7-9} title="Player.svelte"
<Player>
  <!-- ... -->

  <!-- We turn off the settings that come with the default UI. -->
  <DefaultUi noSettings>
    <!-- We setup the default settings and pass in any options. -->
    <DefaultSettings pin="bottomRight">
      <!-- We can extend the settings with new options here. -->
    </DefaultSettings>
  </DefaultUi>
</Player>

<script lang="ts">
  import { Player, DefaultUi, DefaultSettings } from '@vime/svelte';
</script>
```

</TabItem>

<TabItem value="stencil">

```tsx {12-14} title="player.tsx"
class Player {
  // ...

  render() {
    return (
      <vm-player>
        {/* ... */}

        {/* We turn off the settings that come with the default UI. */}
        <vm-default-ui noSettings>
          {/* We setup the default settings and pass in any options.  */}
          <vm-default-settings pin="bottomRight">
            {/* We can extend the settings with new options here. */}
          </vm-default-settings>
        </vm-default-ui>
      </vm-player>
    );
  }
}
```

</TabItem>

<TabItem value="angular">

```html {7-9} title="player.html"
<vm-player>
  <!-- ... -->

  <!-- We turn off the settings that come with the default UI. -->
  <vm-default-ui no-settings>
    <!-- We setup the default settings and pass in any options.  -->
    <vm-default-settings pin="bottomRight">
      <!-- We can extend the settings with new options here. -->
    </vm-default-settings>
  </vm-default-ui>
</vm-player>
```

</TabItem>
    
</Tabs>

How do we now go about either extending the default settings or building our own? If we look
at the `Components > UI > Settings` section in the sidebar (on your left), we'll see there are
a collection of components for this exact job. The basic settings menu hierarchy is as follows:

- [Menu](../components/ui/settings/menu): wraps together all menu items and submenus. It's also
  responsible for handling keyboard navigation.
  - [MenuItem](../components/ui/settings/menu-item): multi-purpose interactable element in the menu.
  - [Submenu](../components/ui/settings/submenu): used to organize the menu by grouping related
    sections/options together. It usually contains a radio group but you can pass in anything
    via the default slot.
    - [MenuRadioGroup](../components/ui/settings/menu-radio-group): groups together radio buttons
      to describe a set of related options.
      - [MenuRadio](../components/ui/settings/menu-radio): represents a single option in a radio group.

Refer to the links for more information on each component. From here it's basically like playing
with lego blocks and putting them together as you like. We have the following starting points when
building out our settings:

1. We extend the [DefaultSettings](../components/ui/settings/default-settings) component which
   handles how the menu is presented on mobile/desktop, and it comes with common settings such as
   changing the playback rate, quality and captions.
2. We start with the [Settings](../components/ui/settings/settings) component which handles
   how the menu is presented on mobile/desktop, and we build out all the options inside the menu ourselves.
3. We start with [Menu](../components/ui/settings/menu) component for a more bare bones approach.
   We're responsible for how the menu is presented, and for connecting it to a controller who'll
   open and close it.

Now you might be wondering at this point how we go about opening/closing the menu? The
[Settings](../components/ui/settings/settings) component has a method called `setController` for setting
the element who'll be responsible for opening/closing it. The
[SettingsControl](../components/ui/controls/settings-control) component that comes with Vime automatically
finds and sets itself as the controller on the Settings component. This means if you're using the
third option above of your own menu, then you'll be responsible for connecting together the controller
(whether it's the SettingsControl or your own), and the component responsible for presenting the menu.

Okay let's play with some of these components in the following example to see how they look and feel...

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

```html {5-19} title="player.html"
<vm-player>
  <!-- ... -->

  <vm-default-ui no-settings>
    <vm-settings>
      <vm-menu-item label="Menu Item 1" badge="BADGE"></vm-menu-item>

      <vm-menu-item label="Menu Item 2" hint="Hint"></vm-menu-item>

      <vm-submenu label="Submenu 1" hint="1">
        <vm-menu-radio-group value="1">
          <vm-menu-radio label="Option 1" value="1"></vm-menu-radio>
          <vm-menu-radio label="Option 2" value="2"></vm-menu-radio>
          <vm-menu-radio label="Option 3" value="3"></vm-menu-radio>
        </vm-menu-radio-group>
      </vm-submenu>

      <vm-submenu label="Submenu 2"> Random content in here. </vm-submenu>
    </vm-settings>
  </vm-default-ui>
</vm-player>

<script>
  const submenu = document.querySelector('vm-submenu[aria-label="Submenu 1"]');
  const radioGroup = submenu.querySelector('vm-menu-radio-group');

  radioGroup.addEventListener('vCheck', event => {
    const radio = event.target;
    submenu.hint = radio.value;
  });
</script>
```

</TabItem>

<TabItem value="react">

```tsx {33-55} title="Player.tsx"
import React, { useState } from 'react';
import {
  Player,
  DefaultUi,
  Settings,
  MenuItem,
  Submenu,
  MenuRadio,
  MenuRadioGroup,
} from '@vime/react';

function Player() {
  const [value, setValue] = useState('1');

  const onMenuItem1Click = () => {
    console.log('Clicked menu item 1');
  };

  const onMenuItem2Click = () => {
    console.log('Clicked menu item 2');
  };

  const onCheck = (event: Event) => {
    const radio = event.target as HTMLVmMenuRadioElement;
    setValue(radio.value);
  };

  return (
    <Player>
      {/* ... */}

      <DefaultUi noSettings>
        <Settings>
          <MenuItem
            label="Menu Item 1"
            badge="BADGE"
            onClick={onMenuItem1Click}
          />

          <MenuItem
            label="Menu Item 2"
            hint="Hint"
            onClick={onMenuItem2Click}
          />

          <Submenu label="Submenu 1" hint={value}>
            <MenuRadioGroup value={value} onVmCheck={onCheck}>
              <MenuRadio label="Option 1" value="1" />
              <MenuRadio label="Option 2" value="2" />
              <MenuRadio label="Option 3" value="3" />
            </MenuRadioGroup>
          </Submenu>

          <Submenu label="Submenu 2">Random content in here.</Submenu>
        </Settings>
      </DefaultUi>
    </Player>
  );
}
```

</TabItem>

<TabItem value="vue">

```html {6-20} title="Player.vue"
<template>
  <Player>
    <!-- ... -->

    <DefaultUi noSettings>
      <Settings>
        <MenuItem label="Menu Item 1" badge="BADGE" @click="onMenuItem1Click" />

        <MenuItem label="Menu Item 2" hint="Hint" @click="onMenuItem2Click" />

        <Submenu label="Submenu 1" :hint="value">
          <MenuRadioGroup :value="value" @vCheck="onCheck">
            <MenuRadio label="Option 1" value="1" />
            <MenuRadio label="Option 2" value="2" />
            <MenuRadio label="Option 3" value="3" />
          </MenuRadioGroup>
        </Submenu>

        <Submenu label="Submenu 2"> Random content in here. </Submenu>
      </Settings>
    </DefaultUi>
  </Player>
</template>

<script>
  import {
    Player,
    DefaultUi,
    Settings,
    MenuItem,
    Submenu,
    MenuRadio,
    MenuRadioGroup,
  } from '@vime/vue';

  export default {
    components: {
      Player,
      DefaultUi,
      Settings,
      MenuItem,
      Submenu,
      MenuRadio,
      MenuRadioGroup,
    },
    data: {
      value: '1',
    },
    methods: {
      onMenuItem1Click() {
        console.log('Clicked menu item 1');
      },
      onMenuItem2Click() {
        console.log('Clicked menu item 2');
      },
      onCheck(event) {
        const radio = event.target;
        this.value = radio.value;
      },
    },
  };
</script>
```

</TabItem>

<TabItem value="svelte">

```html {5-23} title="Player.svelte"
<Player>
  <!-- ... -->

  <DefaultUi noSettings>
    <Settings>
      <MenuItem
        label="Menu Item 1"
        badge="BADGE"
        on:click="{onMenuItem1Click}"
      />

      <MenuItem label="Menu Item 2" hint="Hint" on:click="{onMenuItem2Click}" />

      <Submenu label="Submenu 1" hint="{value}">
        <MenuRadioGroup {value} on:vCheck="{onCheck}">
          <MenuRadio label="Option 1" value="1" />
          <MenuRadio label="Option 2" value="2" />
          <MenuRadio label="Option 3" value="3" />
        </MenuRadioGroup>
      </Submenu>

      <Submenu label="Submenu 2"> Random content in here. </Submenu>
    </Settings>
  </DefaultUi>
</Player>

<script lang="ts">
  import {
    Player,
    DefaultUi,
    Settings,
    MenuItem,
    Submenu,
    MenuRadio,
    MenuRadioGroup,
  } from '@vime/svelte';

  let value = '1';

  const onMenuItem1Click = () => {
    console.log('Clicked menu item 1');
  };

  const onMenuItem2Click = () => {
    console.log('Clicked menu item 2');
  };

  const onCheck = (event: Event) => {
    const radio = event.target as HTMLVmMenuRadioElement;
    value = radio.value;
  };
</script>
```

</TabItem>

<TabItem value="stencil">

```tsx {23-48} title="player.tsx"
class Player {
  @State() value = '1';

  private onMenuItem1Click() {
    console.log('Clicked menu item 1');
  }

  private onMenuItem2Click() {
    console.log('Clicked menu item 2');
  }

  private onCheck(event: Event) {
    const radio = event.target as HTMLVmMenuRadioElement;
    this.value = radio.value;
  }

  render() {
    return (
      <vm-player>
        {/* ... */}

        <vm-default-ui noSettings>
          <vm-settings>
            <vm-menu-item
              label="Menu Item 1"
              badge="BADGE"
              onClick={this.onMenuItem1Click.bind(this)}
            />

            <vm-menu-item
              label="Menu Item 2"
              hint="Hint"
              onClick={this.onMenuItem2Click.bind(this)}
            />

            <vm-submenu label="Submenu 1" hint={this.value}>
              <vm-menu-radio-group
                value={this.value}
                onVmCheck={this.onCheck.bind(this)}
              >
                <vm-menu-radio label="Option 1" value="1"></vm-menu-radio>
                <vm-menu-radio label="Option 2" value="2"></vm-menu-radio>
                <vm-menu-radio label="Option 3" value="3"></vm-menu-radio>
              </vm-menu-radio-group>
            </vm-submenu>

            <vm-submenu label="Submenu 2">Random content in here.</vm-submenu>
          </vm-settings>
        </vm-default-ui>
      </vm-player>
    );
  }
}
```

</TabItem>

<TabItem value="angular">

```html {5-27} title="player.html"
<vm-player>
  <!-- ... -->

  <vm-default-ui no-settings>
    <vm-settings>
      <vm-menu-item
        label="Menu Item 1"
        badge="BADGE"
        (click)="onMenuItem1Click"
      ></vm-menu-item>

      <vm-menu-item
        label="Menu Item 2"
        hint="Hint"
        (click)="onMenuItem2Click"
      ></vm-menu-item>

      <vm-submenu label="Submenu 1" [hint]="value">
        <vm-menu-radio-group [value]="value" (vCheck)="onCheck">
          <vm-menu-radio label="Option 1" value="1"></vm-menu-radio>
          <vm-menu-radio label="Option 2" value="2"></vm-menu-radio>
          <vm-menu-radio label="Option 3" value="3"></vm-menu-radio>
        </vm-menu-radio-group>
      </vm-submenu>

      <vm-submenu label="Submenu 2"> Random content in here. </vm-submenu>
    </vm-settings>
  </vm-default-ui>
</vm-player>
```

```ts title="player.ts"
class Player {
  value = '1';

  onMenuItem1Click() {
    console.log('Clicked menu item 1');
  }

  onMenuItem2Click() {
    console.log('Clicked menu item 2');
  }

  onCheck(event: Event) {
    const radio = event.target as HTMLVmMenuRadioElement;
    this.value = radio.value;
  }
}
```

</TabItem>
    
</Tabs>

Glorious! Here's the result 🥁 ...

:::tip
Click the cogwheel in the lower control bar to open the settings.
:::

import CustomSettingsPlayer from '../../src/components/players/LoadableCustomSettingsPlayer';

<CustomSettingsPlayer />
<br />

Hopefully by this point you have a good understanding of how you can build your own settings.
In summary, there are many ways we can choose to start building it, and Vime provides a collection
of components as building blocks to help us. As usual, the examples provided are simple and it's up
to you how far you take it. In addition, remember if none of the predefined components meet your
requirements, you can always create your own as we saw in the [UI](./ui) guide. Happy building 🥳

🚂 &nbsp;Let's move onto [styling!](./styling)
