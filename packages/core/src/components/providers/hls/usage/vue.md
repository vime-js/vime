```html {3-6,12,17} title="example.vue"
<template>
  <VimePlayer controls>
    <VimeHls :config="hlsConfig" version="latest" poster="/media/poster.png">
      <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
      <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" />
    </VimeHls>
    <!-- ... -->
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeHls } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeHls,
    },

    data: {
      /**
       * @see https://hls-js.netlify.app/api-docs/file/src/config.ts.html.
       */
      hlsConfig: {
        // ...
      },
    },
  };
</script>
```
