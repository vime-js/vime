```html {2-7,12} title="example.svelte"
<VimePlayer controls>
  <VimeDash
    src="/media/manifest.mpd"
    version="latest"
    config="{dashConfig}"
    poster="/media/poster.png"
  />
  <!-- ... -->
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeDash } from '@vime/svelte';

  /**
   * @see https://github.com/Dash-Industry-Forum/dash.js.
   */
  const dashConfig = {
    // ...
  };
</script>
```
