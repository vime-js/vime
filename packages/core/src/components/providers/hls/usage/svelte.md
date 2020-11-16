```html {2-5,10} title="example.svelte"
<VimePlayer controls>
  <VimeHls version="latest" config="{hlsConfig}" poster="/media/poster.png">
    <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
  </VimeHls>
  <!-- ... -->
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeHls } from '@vime/svelte';

  /**
   * @see https://hls-js.netlify.app/api-docs/file/src/config.ts.html.
   */
  const hlsConfig = {
    // ...
  };
</script>
```
