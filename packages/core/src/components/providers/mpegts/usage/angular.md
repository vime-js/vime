```html {2-4} title="example.html"
<vm-player controls>
  <vm-mpegts version="latest" [config]="mpegtsConfig" poster="/media/poster.png" url="url" type="flv" [isLive]="true"></vm-mpegts>
  <!-- ... -->
</vm-player>
```

```ts title="example.ts"
class Example {
  /**
   * @see https://github.com/xqq/mpegts.js/blob/master/docs/api.md.
   */
  mpegtsConfig = {
    // ...
  };
}
```
