```html {2-6} title="example.html"
<vime-player controls>
  <vime-hls version="latest" [config]="hlsConfig" poster="/media/poster.png">
    <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
    <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" />
    <!-- ... -->
  </vime-hls>
  <!-- ... -->
</vime-player>
```

```ts title="example.ts"
class Example {
  /**
   * @see https://hls-js.netlify.app/api-docs/file/src/config.ts.html.
   */
  hlsConfig = {
    // ...
  };
}
```
