```html {2-5,10} title="example.svelte"
<VimePlayer controls>
  <VimeAudio>
    <source data-src="/media/audio.mp3" type="audio/mp3" />
    <!-- <source> and <track> elements are placed here. -->
  </VimeAudio>
  <!-- ... -->
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeAudio } from '@vime/svelte';
</script>
```
