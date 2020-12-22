```html {2-5,10} title="example.svelte"
<Player controls>
  <Audio>
    <source data-src="/media/audio.mp3" type="audio/mp3" />
    <!-- <source> and <track> elements are placed here. -->
  </Audio>
  <!-- ... -->
</Player>

<script lang="ts">
  import { Player, Audio } from '@vime/svelte';
</script>
```
