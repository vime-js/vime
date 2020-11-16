```html {2-5} title="example.html"
<vime-player controls>
  <vime-hls version="latest" [config]="hlsConfig" poster="/media/poster.png">
    <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
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
