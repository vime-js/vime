---
title: Providers
sidebar_label: Providers
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

Providers are responsible for loading players/media and controlling it. For example, the 
[YouTube](../components/providers/youtube) provider sets up the [YouTube player embed][yt-player-embed] 
and loads a video through it, which we can then control through the player component. Providers are the only 
component the player interacts with directly through the [`MediaProviderAdapter`][media-provider-adapter] 
interface, which enables the player to speak in a common shared language with them. As properties 
change on the player, they are updated by calling the corresponding method on the provider. For 
example, if you do `player.currentTime = 50` then a `provider.setCurrentTime(50)` call is required, 
which the player will automatically do on the next render cycle. On the other end, the provider will 
emit a "special" event called `vProviderChange` for when the player needs to update its state. All 
other components emit updates through the `vStateChange` event, but providers use a special event 
to avoid ending up in an infinite cycle where the player updates the provider, and the provider updates 
the player until the death of our sun ☀️ &nbsp;and end of our solar system &nbsp;🪐

Now that we got past some of the basic details on how it works and an existential crisis, let's set 
one up! Let's assume we want to load and play a basic `mp4` video. If we look through the providers 
in the `Components > Providers` section in the sidebar (on your left), we see there is a 
[`Video`](../components/providers/video) provider which can help us do exactly what we need.

[yt-player-embed]: https://developers.google.com/youtube/player_parameters
[media-provider-adapter]: https://github.com/vime-js/vime/blob/master/packages/core/src/components/providers/MediaProvider.ts#L5

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

```html {3-17} title="player.html"
<!-- By default there are no controls so let's turn them on. -->
<vime-player controls>
  <vime-video cross-origin="true" poster="https://media.vimejs.com/poster.png">
    <!-- These are passed directly to the underlying HTML5 `<video>` element. -->
    <!-- Why `data-src`? Lazy loading, you can always use `src` if you prefer.  -->
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

  <!-- ... -->
</vime-player>
```

</TabItem>

<TabItem value="react">

```tsx {8-22} title="Player.tsx"
import React from 'react';
import { VimePlayer, VimeVideo } from '@vime/react';

function Player() {
  return (
    {/* By default there are no controls so let's turn them on. */}
    <VimePlayer controls>
      <VimeVideo crossOrigin="" poster="https://media.vimejs.com/poster.png">
        {/* These are passed directly to the underlying HTML5 `<video>` element. */}
        {/* Why `data-src`? Lazy loading, you can always use `src` if you prefer.  */}
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

      {/* ... */}
    </VimePlayer>
  );
}
```

</TabItem>

<TabItem value="vue">

```html {4-18} title="Player.vue"
<template>
  <!-- By default there are no controls so let's turn them on. -->
  <VimePlayer controls>
    <VimeVideo crossOrigin="" poster="https://media.vimejs.com/poster.png">
      <!-- These are passed directly to the underlying HTML5 `<video>` element. -->
      <!-- Why `data-src`? Lazy loading, you can always use `src` if you prefer.  -->
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

    <!-- ... -->
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeVideo } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeVideo,
    },
  };
</script>
```

</TabItem>

<TabItem value="svelte">

```html {3-17} title="Player.svelte"
<!-- By default there are no controls so let's turn them on. -->
<VimePlayer controls>
  <VimeVideo crossOrigin="" poster="https://media.vimejs.com/poster.png">
    <!-- These are passed directly to the underlying HTML5 `<video>` element. -->
    <!-- Why `data-src`? Lazy loading, you can always use `src` if you prefer.  -->
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

  <!-- ... -->
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeVideo } from '@vime/svelte';
</script>
```

</TabItem>

<TabItem value="stencil">

```tsx {8-22} title="player.tsx"
class Player {
  // ...

  render() {
    return (
      {/* By default there are no controls so let's turn them on. */}
      <vime-player controls>
        <vime-video crossOrigin="" poster="https://media.vimejs.com/poster.png">
          {/* These are passed directly to the underlying HTML5 `<video>` element. */}
          {/* Why `data-src`? Lazy loading, you can always use `src` if you prefer.  */}
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
      </vime-player>
    );
  }
}
```

</TabItem>

<TabItem value="angular">

```html {3-17} title="player.html"
<!-- By default there are no controls so let's turn them on. -->
<vime-player controls>
  <vime-video cross-origin="true" poster="https://media.vimejs.com/poster.png">
    <!-- These are passed directly to the underlying HTML5 `<video>` element. -->
    <!-- Why `data-src`? Lazy loading, you can always use `src` if you prefer.  -->
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

  <!-- ... -->
</vime-player>
```

</TabItem>
    
</Tabs>

Glorious! Here's the result so far 🥁 ...

import { BasicPlayer } from './components/BasicPlayer';

<BasicPlayer />
<br />

Now, this is as basic as it gets but it lays the foundation for us to start customizing the player to 
our needs. If you need to support a different type of media, you can follow the same steps of checking 
the available providers in the `Components` section, picking whichever supports the required media 
type, and following the usage guide to set it up.

:::tip
One last thing before we move on, everything is typed and documented in Vime, so feel free to hover 
over properties/methods/events in your IDE to get some additional information about it.
:::

<img
  width="100%"
  alt="Vime player IDE property documentation"
  src="/img/prop-doc.png"
/>
<br />
<br />

🚂 &nbsp;Let's move onto [customizing the user interface!](./ui)