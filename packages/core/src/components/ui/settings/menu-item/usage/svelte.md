```html {6,16} title="example.svelte"
<VimePlayer>
  <!-- ... -->
  <VimeUi>
    <!-- ... -->
    <VimeSettings>
      <VimeMenuItem label="Playback Quality" hint="Auto" />
    </VimeSettings>
  </VimeUi>
</VimePlayer>

<script lang="ts">
  import { VimePlayer, VimeUi, VimeSettings, VimeMenuItem } from '@vime/svelte';
</script>
```
