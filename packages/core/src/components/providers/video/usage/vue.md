```html {3-18,24,29} title="example.vue"
<template>
  <Player controls>
    <Video>
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
    </Video>
    <!-- ... -->
  </Player>
</template>

<script>
  import { Player, Video } from '@vime/vue';

  export default {
    components: {
      Player,
      Video,
    },
  };
</script>
```
