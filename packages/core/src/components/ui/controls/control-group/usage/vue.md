```html {6-8,10-13,24,35} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <VimeControls>
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
</template>

<script>
  import {
    VimePlayer,
    VimeUi,
    VimeControls,
    VimeControlGroup,
    VimeScrubberControl,
    VimePlaybackControl,
    VimeVolumeControl,
  } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeControls,
      VimeControlGroup,
      VimeScrubberControl,
      VimePlaybackControl,
      VimeVolumeControl,
    },
  };
</script>
```
