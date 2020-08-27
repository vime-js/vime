```html {7,19} title="example.svelte"
<VimePlayer>
  <!-- ... -->
  <VimeUi>
    <!-- ... -->
    <VimeControls>
      <VimeControl>
        <VimeTooltip>Title</VimeTooltip>
      </VimeControl>
    </VimeControls>
  </VimeUi>
</VimePlayer>

<script lang="ts">
  import {
    VimePlayer,
    VimeUi,
    VimeControls,
    VimeControl,
    VimeTooltip,
  } from '@vime/svelte';
</script>
```
