```html {3-19,25,30} title="example.vue"
<template>
  <VimePlayer controls>
    <VimeVideo>
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
      <!-- ... -->
    </VimeVideo>
    <!-- ... -->
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeVideo } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeVideo,
    },
  };
</script>
```
