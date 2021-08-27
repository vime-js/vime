```html {2-4,9} title="example.svelte"
<Player controls>
  <Mpegts version="latest" config="{mpegtsConfig}" poster="/media/poster.png" url="url" type="flv" isLive="{true}"></Mpegts>
  <!-- ... -->
</Player>

<script lang="ts">
  import { Player, Mpegts } from '@vime/svelte';

  /**
   * @see https://github.com/xqq/mpegts.js/blob/master/docs/api.md.
   */
  const mpegtsConfig = {
    // ...
  };
</script>
```
