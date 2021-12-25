# @vime/core

Vime is a customizable, extensible, accessible and framework agnostic media player. The `@vime/core`
package contains all the core Vime web components that other packages rely on.

## Examples

**The examples below are using web components but there are bindings for React, Vue, Svelte, Stencil
and Angular. If you want to see how they look check out our [Demo](https://vimejs.com/demo).**

```html
<vm-player autoplay muted>
  <vm-video poster="/media/poster.png" cross-origin>
    <!-- Why `data-src`? Lazy loading. You can always use `src` if you don't need it. -->
    <source data-src="/media/video.mp4" type="video/mp4" />
    <track
      default
      kind="subtitles"
      src="/media/subs/en.vtt"
      srclang="en"
      label="English"
    />
  </vm-video>

  <!-- Loads the default Vime UI. -->
  <vm-default-ui />
</vm-player>
```

_Native UI?_

```html
<!-- Here we are requesting to use the native controls. -->
<vm-player autoplay muted controls>
  <vm-audio cross-origin>
    <source data-src="/media/audio.mp3" type="audio/mp3" />
  </vm-audio>
</vm-player>
```

_Custom UI?_

```html
<!-- Lets add a little splash of color throughout the player. -->
<vm-player autoplay muted style="--vm-player-theme: #1873d3">
  <!-- Loading a YouTube video. -->
  <vm-youtube video-id="DyTCOwB0DVw" />

  <vm-ui>
    <vm-click-to-play />
    <vm-captions />
    <vm-poster />
    <vm-spinner />
    <vm-default-settings />
    <vm-controls pin="bottomLeft" active-duration="2750" full-width>
      <!-- 
        These are all predefined controls that you can easily customize. You could also build 
        your own controls completely from scratch.
      -->
      <vm-playback-control tooltip-direction="right" />
      <vm-volume-control />
      <vm-time-progress />
      <vm-control-spacer />
      <vm-caption-control />
      <vm-pip-control keys="p" />
      <vm-settings-control />
      <vm-fullscreen-control keys="f" tooltip-direction="left" />
    </vm-controls>
  </vm-ui>
</vm-player>
```

## Related

- [GitHub](https://github.com/vime-js/vime)
- [Discord](https://discord.com/invite/7RGU7wvsu9)
- [Documentation](https://vimejs.com)
