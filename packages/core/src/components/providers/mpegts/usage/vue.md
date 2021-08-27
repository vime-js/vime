```html {3-5,11,16} title="example.vue"
<template>
  <Player controls>
    <Mpegts :config="mpegtsConfig" version="latest" poster="/media/poster.png" url="url" type="flv"></Mpegts>
    <!-- ... -->
  </Player>
</template>

<script>
  import { Player, Mpegts } from '@vime/vue';

  export default {
    components: {
      Player,
      Mpegts,
    },

    data: {
      /**
       * @see https://github.com/xqq/mpegts.js/blob/master/docs/api.md.
       */
      mpegtsConfig: {
        // ...
      },
    },
  };
</script>
```
