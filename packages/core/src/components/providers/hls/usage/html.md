```html {2-6}
<vime-player controls>
  <vime-hls version="latest" poster="/media/poster.png">
    <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
    <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" />
    <!-- ... -->
  </vime-hls>
  <!-- ... -->
</vime-player>
```
