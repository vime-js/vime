```html {2-7,12} title="example.svelte"
<Player controls>
  <Dash
    src="/media/manifest.mpd"
    version="latest"
    config="{dashConfig}"
    poster="/media/poster.png"
  />
  <!-- ... -->
</Player>

<script lang="ts">
  import { Player, Dash } from '@vime/svelte';

  /**
   * @see https://github.com/Dash-Industry-Forum/dash.js.
   */
  const dashConfig = {
    // ...
  };
</script>
```
