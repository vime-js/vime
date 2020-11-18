```html {3-5,11,16} title="example.vue"
<template>
  <Player controls>
    <Hls :config="hlsConfig" version="latest" poster="/media/poster.png">
      <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
    </Hls>
    <!-- ... -->
  </Player>
</template>

<script>
  import { Player, Hls } from '@vime/vue';

  export default {
    components: {
      Player,
      Hls,
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
