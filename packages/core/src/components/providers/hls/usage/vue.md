```html {3-5,11,16} title="example.vue"
<template>
  <VimePlayer controls>
    <VimeHls :config="hlsConfig" version="latest" poster="/media/poster.png">
      <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
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
