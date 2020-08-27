```html {2-17,22} title="example.svelte"
<VimePlayer controls>
  <VimeVideo videoId="411652396">
    <source data-src="/media/video.mp4" type="video/mp4" />
    <track
      default
      kind="subtitles"
      src="/media/subs/en.vtt"
      srclang="en"
      label="English"
    />
    <track
      kind="captions"
      src="/media/caps/es.vtt"
      srclang="es"
      label="Spanish"
    />
  </VimeVideo>
  <!-- ... -->
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeVideo } from '@vime/svelte';
</script>
```
