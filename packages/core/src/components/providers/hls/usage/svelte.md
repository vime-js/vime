```html {2-4,9} title="example.svelte"
<Player controls>
  <Hls version="latest" config="{hlsConfig}" poster="/media/poster.png">
    <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
  </Hls>
  <!-- ... -->
</Player>

<script lang="ts">
  import { Player, Hls } from '@vime/svelte';

  /**
   * @see https://hls-js.netlify.app/api-docs/file/src/config.ts.html.
   */
  const hlsConfig = {
    // ...
  };
</script>
```
