```html {8,21} title="example.svelte"
<VimePlayer>
  <!-- ... -->
  <VimeUi>
    <!-- ... -->
    <VimeControls fullWidth>
      <VimePlaybackControl />
      <VimeVolumeControl />
      <VimeControlSpacer />
      <VimeFullscreenControl />
    </VimeControls>
  </VimeUi>
</VimePlayer>

<script lang="ts">
  import {
    VimePlayer,
    VimeUi,
    VimeControls,
    VimePlaybackControl,
    VimeVolumeControl,
    VimeControlSpacer,
    VimeFullscreenControl,
  } from '@vime/svelte';
</script>
```
