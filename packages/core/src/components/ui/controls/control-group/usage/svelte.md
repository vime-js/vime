```html {6-8,10-13,26} title="example.svelte"
<VimePlayer>
  <!-- ... -->
  <VimeUi>
    <!-- ... -->
    <VimeControls fullWidth>
      <VimeControlGroup>
        <VimeScrubberControl />
      </VimeControlGroup>

      <VimeControlGroup space="top">
        <VimePlaybackControl />
        <VimeVolumeControl />
      </VimeControlGroup>
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
    VimeScrubberControl,
    VimeControlGroup,
  } from '@vime/svelte';
</script>
```
