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
  { label: 'Angular', value: 'angular' }
]}>

<TabItem value="html">

```html {19-21} title="player.html"
<vime-player>
  <vime-video cross-origin="true" poster="https://media.vimejs.com/poster.png">
    <source 
      data-src="https://media.vimejs.com/720p.mp4" 
      type="video/mp4" 
    />
    <track 
      default 
      kind="subtitles" 
      src="https://media.vimejs.com/subs/english.vtt" 
      srclang="en" 
      label="English" 
    />
  </vime-video> 
  
  <!-- We turn off the settings that come with the default UI. -->
  <vime-default-ui no-settings>
    <!-- We setup the default settings and pass in any options.  -->
    <vime-default-settings pin="bottomRight">
      <!-- We can extend the settings with new options here. -->
    </vime-default-settings>
  </vime-default-ui>
</vime-player>
```

</TabItem>

<TabItem value="react">

```tsx {24-26} title="Player.tsx"
import React from 'react';
import { VimePlayer, VimeVideo, VimeDefaultUi, VimeDefaultSettings } from '@vime/react';

function Player() {
  return (
    <VimePlayer>
      <VimeVideo crossOrigin="" poster="https://media.vimejs.com/poster.png">
        <source 
          data-src="https://media.vimejs.com/720p.mp4" 
          type="video/mp4" 
        />
        <track 
          default 
          kind="subtitles" 
          src="https://media.vimejs.com/subs/english.vtt" 
          srcLang="en" 
          label="English" 
        />
      </VimeVideo> 

      {/* We turn off the settings that come with the default UI. */}
      <VimeDefaultUi noSettings>
        {/* We setup the default settings and pass in any options.  */}
        <VimeDefaultSettings pin="bottomRight">
          {/* We can extend the settings with new options here. */}
        </VimeDefaultSettings>
      </VimeDefaultUi>
    </VimePlayer>
  );
}
```

</TabItem>

<TabItem value="vue">

```html {20-22} title="Player.vue"
<template>
  <VimePlayer>
    <VimeVideo crossOrigin="" poster="https://media.vimejs.com/poster.png">
      <source 
        data-src="https://media.vimejs.com/720p.mp4" 
        type="video/mp4" 
      />
      <track 
        default 
        kind="subtitles" 
        src="https://media.vimejs.com/subs/english.vtt" 
        srclang="en" 
        label="English" 
      />
    </VimeVideo> 

    <!-- We turn off the settings that come with the default UI. -->
    <VimeDefaultUi noSettings>
      <!-- We setup the default settings and pass in any options. -->
      <VimeDefaultSettings pin="bottomRight">
        <!-- We can extend the settings with new options here. -->
      </VimeDefaultSettings>
    </VimeDefaultUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeVideo, VimeDefaultUi, VimeDefaultSettings } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeVideo,
      VimeDefaultUi,
      VimeDefaultSettings,
    },
  };
</script>
```

</TabItem>

<TabItem value="svelte">

```html {19-21} title="Player.svelte"
<VimePlayer>
  <VimeVideo crossOrigin="" poster="https://media.vimejs.com/poster.png">
    <source 
      data-src="https://media.vimejs.com/720p.mp4" 
      type="video/mp4" 
    />
    <track 
      default 
      kind="subtitles" 
      src="https://media.vimejs.com/subs/english.vtt" 
      srclang="en" 
      label="English" 
    />
  </VimeVideo> 

  <!-- We turn off the settings that come with the default UI. -->
  <VimeDefaultUi noSettings>
    <!-- We setup the default settings and pass in any options. -->
    <VimeDefaultSettings pin="bottomRight">
      <!-- We can extend the settings with new options here. -->
    </VimeDefaultSettings>
  </VimeDefaultUi>
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeVideo, VimeDefaultUi, VimeDefaultSettings } from '@vime/svelte';
</script>
```

</TabItem>

<TabItem value="angular">

```html {19-21} title="player.html"
<vime-player>
  <vime-video cross-origin="true" poster="https://media.vimejs.com/poster.png">
    <source 
      data-src="https://media.vimejs.com/720p.mp4" 
      type="video/mp4" 
    />
    <track 
      default 
      kind="subtitles" 
      src="https://media.vimejs.com/subs/english.vtt" 
      srclang="en" 
      label="English" 
    />
  </vime-video> 

  <!-- We turn off the settings that come with the default UI. -->
  <vime-default-ui no-settings>
    <!-- We setup the default settings and pass in any options.  -->
    <vime-default-settings pin="bottomRight">
      <!-- We can extend the settings with new options here. -->
    </vime-default-settings>
  </vime-default-ui>
</vime-player>
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
[SettingsControl](../components/controls/settings-control) component that comes with Vime automatically 
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
  { label: 'Angular', value: 'angular' }
]}>

<TabItem value="html">

```html {17-33} title="player.html"
<vime-player>
  <vime-video cross-origin="true" poster="https://media.vimejs.com/poster.png">
    <source 
      data-src="https://media.vimejs.com/720p.mp4" 
      type="video/mp4" 
    />
    <track 
      default 
      kind="subtitles" 
      src="https://media.vimejs.com/subs/english.vtt" 
      srclang="en" 
      label="English" 
    />
  </vime-video> 
  
  <vime-default-ui no-settings>
    <vime-settings>
      <vime-menu-item label="Menu Item 1" badge="BADGE"></vime-menu-item>
      
      <vime-menu-item label="Menu Item 2" hint="Hint"></vime-menu-item>
      
      <vime-submenu label="Submenu 1" hint="1">
        <vime-menu-radio-group value="1">
          <vime-menu-radio label="Option 1" value="1"></vime-menu-radio>
          <vime-menu-radio label="Option 2" value="2"></vime-menu-radio>
          <vime-menu-radio label="Option 3" value="3"></vime-menu-radio>
        </vime-menu-radio-group>
      </vime-submenu>
      
      <vime-submenu label="Submenu 2">
        Random content in here.
      </vime-submenu>
    </vime-settings>
  </vime-default-ui>
</vime-player>

<script>
  const submenu = document.querySelector('vime-submenu[aria-label="Submenu 1"]');
  const radioGroup = submenu.querySelector('vime-menu-radio-group');
  
  radioGroup.addEventListener('vCheck', (event) => {
    const radio = event.target;
    submenu.hint = radio.value;
  });
</script>
```

</TabItem>

<TabItem value="react">

```tsx {46-62} title="Player.tsx"
import React, { useState } from 'react';
import { 
  VimePlayer,
  VimeVideo, 
  VimeDefaultUi,
  VimeSettings,
  VimeMenuItem,
  VimeSubmenu,
  VimeMenuRadio,
  VimeMenuRadioGroup,
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
    const radio = event.target as HTMLVimeMenuRadioElement;
    setValue(radio.value);
  };

  return (
    <VimePlayer>
      <VimeVideo crossOrigin="" poster="https://media.vimejs.com/poster.png">
        <source 
          data-src="https://media.vimejs.com/720p.mp4" 
          type="video/mp4" 
        />
        <track 
          default 
          kind="subtitles" 
          src="https://media.vimejs.com/subs/english.vtt" 
          srcLang="en" 
          label="English" 
        />
      </VimeVideo> 

      <VimeDefaultUi noSettings>
        <VimeSettings>
          <VimeMenuItem label="Menu Item 1" badge="BADGE" onClick={onMenuItem1Click} />
          
          <VimeMenuItem label="Menu Item 2" hint="Hint" onClick={onMenuItem2Click} />
          
          <VimeSubmenu label="Submenu 1" hint={value}>
            <VimeMenuRadioGroup value={value} onVCheck={onCheck}>
              <VimeMenuRadio label="Option 1" value="1" />
              <VimeMenuRadio label="Option 2" value="2" />
              <VimeMenuRadio label="Option 3" value="3" />
            </VimeMenuRadioGroup>
          </VimeSubmenu>
          
          <VimeSubmenu label="Submenu 2">
            Random content in here.
          </VimeSubmenu>
        </VimeSettings>
      </VimeDefaultUi>
    </VimePlayer>
  );
};
```

</TabItem>

<TabItem value="vue">

```html {18-34} title="Player.vue"
<template>
  <VimePlayer>
    <VimeVideo crossOrigin="" poster="https://media.vimejs.com/poster.png">
      <source 
        data-src="https://media.vimejs.com/720p.mp4" 
        type="video/mp4" 
      />
      <track 
        default 
        kind="subtitles" 
        src="https://media.vimejs.com/subs/english.vtt" 
        srclang="en" 
        label="English" 
      />
    </VimeVideo> 

    <VimeDefaultUi noSettings>
      <VimeSettings>
        <VimeMenuItem label="Menu Item 1" badge="BADGE" @click="onMenuItem1Click" />
        
        <VimeMenuItem label="Menu Item 2" hint="Hint" @click="onMenuItem2Click" />
        
        <VimeSubmenu label="Submenu 1" :hint="value">
          <VimeMenuRadioGroup :value="value" @vCheck="onCheck">
            <VimeMenuRadio label="Option 1" value="1" />
            <VimeMenuRadio label="Option 2" value="2" />
            <VimeMenuRadio label="Option 3" value="3" />
          </VimeMenuRadioGroup>
        </VimeSubmenu>
        
        <VimeSubmenu label="Submenu 2">
          Random content in here.
        </VimeSubmenu>
      </VimeSettings>
    </VimeDefaultUi>
  </VimePlayer>
</template>

<script>
  import { 
    VimePlayer,
    VimeVideo, 
    VimeDefaultUi,
    VimeSettings,
    VimeMenuItem,
    VimeSubmenu,
    VimeMenuRadio,
    VimeMenuRadioGroup,
  } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeVideo, 
      VimeDefaultUi,
      VimeSettings,
      VimeMenuItem,
      VimeSubmenu,
      VimeMenuRadio,
      VimeMenuRadioGroup,
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

```html {17-33} title="Player.svelte"
<VimePlayer>
  <VimeVideo crossOrigin="" poster="https://media.vimejs.com/poster.png">
    <source 
      data-src="https://media.vimejs.com/720p.mp4" 
      type="video/mp4" 
    />
    <track 
      default 
      kind="subtitles" 
      src="https://media.vimejs.com/subs/english.vtt" 
      srclang="en" 
      label="English" 
    />
  </VimeVideo> 

  <VimeDefaultUi noSettings>
    <VimeSettings>
      <VimeMenuItem label="Menu Item 1" badge="BADGE" on:click={onMenuItem1Click} />
      
      <VimeMenuItem label="Menu Item 2" hint="Hint" on:click={onMenuItem2Click} />
      
      <VimeSubmenu label="Submenu 1" hint={value}>
        <VimeMenuRadioGroup {value} on:vCheck={onCheck}>
          <VimeMenuRadio label="Option 1" value="1" />
          <VimeMenuRadio label="Option 2" value="2" />
          <VimeMenuRadio label="Option 3" value="3" />
        </VimeMenuRadioGroup>
      </VimeSubmenu>
      
      <VimeSubmenu label="Submenu 2">
        Random content in here.
      </VimeSubmenu>
    </VimeSettings>
  </VimeDefaultUi>
</VimePlayer>

<script lang="ts">
  import { 
    VimePlayer,
    VimeVideo, 
    VimeDefaultUi,
    VimeSettings,
    VimeMenuItem,
    VimeSubmenu,
    VimeMenuRadio,
    VimeMenuRadioGroup,
  } from '@vime/svelte';

  let value = '1';

  const onMenuItem1Click = () => {
    console.log('Clicked menu item 1');
  };
  
  const onMenuItem2Click = () => {
    console.log('Clicked menu item 2');
  };

  const onCheck = (event: Event) => {
    const radio = event.target as HTMLVimeMenuRadioElement;
    value = radio.value;
  };
</script>
```

</TabItem>

<TabItem value="angular">

```html {17-41} title="player.html"
<vime-player>
  <vime-video cross-origin="true" poster="https://media.vimejs.com/poster.png">
    <source 
      data-src="https://media.vimejs.com/720p.mp4" 
      type="video/mp4" 
    />
    <track 
      default 
      kind="subtitles" 
      src="https://media.vimejs.com/subs/english.vtt" 
      srclang="en" 
      label="English" 
    />
  </vime-video> 

  <vime-default-ui no-settings>
    <vime-settings>
      <vime-menu-item 
        label="Menu Item 1" 
        badge="BADGE" 
        (click)="onMenuItem1Click"
      ></vime-menu-item>
      
      <vime-menu-item 
        label="Menu Item 2" 
        hint="Hint" 
        (click)="onMenuItem2Click"
      ></vime-menu-item>
      
      <vime-submenu label="Submenu 1" [hint]="value">
        <vime-menu-radio-group [value]="value" (vCheck)="onCheck">
          <vime-menu-radio label="Option 1" value="1"></vime-menu-radio>
          <vime-menu-radio label="Option 2" value="2"></vime-menu-radio>
          <vime-menu-radio label="Option 3" value="3"></vime-menu-radio>
        </vime-menu-radio-group>
      </vime-submenu>
      
      <vime-submenu label="Submenu 2">
        Random content in here.
      </vime-submenu>
    </vime-settings>
  </vime-default-ui>
</vime-player>
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
    const radio = event.target as HTMLVimeMenuRadioElement;
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

import { CustomSettingsPlayer } from './components/CustomSettingsPlayer'

<CustomSettingsPlayer />
<br />

Hopefully by this point you have a good understanding of how you can build your own settings.
In summary, there are many ways we can choose to start building it, and Vime provides a collection 
of components as building blocks to help us. As usual, the examples provided are simple and it's up 
to you how far you take it. In addition, remember if none of the predefined components meet your 
requirements, you can always create your own as we saw in the [UI](./ui) guide. Happy building 🥳

🚂 &nbsp;Let's move onto [styling!](./styling)