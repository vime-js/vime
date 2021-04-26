```html {2-7} title="example.html"
<vm-player controls>
  <vm-dash
    [config]="dashConfig"
    src="/media/manifest.mpd"
    version="latest"
    poster="/media/poster.png"
  ></vm-dash>
  <!-- ... -->
</vm-player>
```

```ts title="example.ts"
class Example {
  /**
   * @see https://github.com/Dash-Industry-Forum/dash.js.
   */
  dashConfig = {
    // ...
  };
}
```
