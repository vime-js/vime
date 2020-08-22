```html {3-6,12,17} title="example.vue"
<template>
  <VimePlayer controls>
    <VimeAudio>
      <source data-src="/media/audio.mp3" type="audio/mp3" />
      <!-- <source> and <track> elements are placed here. -->
    </VimeAudio>
    <!-- ... -->
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeAudio } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeAudio,
    },
  };
</script>
```
