```html {2-4} title="example.html"
<vm-player controls>
  <vm-hls version="latest" [config]="hlsConfig" poster="/media/poster.png">
    <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
  </vm-hls>
  <!-- ... -->
</vm-player>
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
