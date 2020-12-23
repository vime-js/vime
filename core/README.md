# @vime/core

Vime is a customizable, extensible, accessible and framework agnostic media player. The `@vime/core` 
package contains the web components for the player, plugins, providers and UI elements that makeup 
the building blocks of Vime.

## Example

```html
<vm-player autoplay muted>
  <vm-video poster="/media/poster.png" cross-origin>
    <source data-src="/media/video.mp4" type="video/mp4" />
    <track
      default
      kind="subtitles"
      src="/media/subs/en.vtt"
      srclang="en"
      label="English"
    />
    <track
      kind="subtitles"
      src="/media/subs/es.vtt"
      srclang="es"
      label="Spanish"
    />
  </vm-video>

  <vm-ui>
    <vm-click-to-play />
    <vm-captions />
    <vm-poster />
    <vm-spinner />
    <vm-default-settings />
    <vm-controls pin="bottomLeft" active-duration="2750" full-width>
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

  <vm-plugins>
    <vm-chromecast />
  </vm-plugins>
</vm-player>
```

## Related

- [GitHub](https://github.com/vime-js/vime)
- [Discord](https://discord.gg/feZ6cAE)
- [Documentation](https://vimejs.com)
