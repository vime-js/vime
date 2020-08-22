```html {3-8,14,19} title="example.vue"
<template>
  <VimePlayer controls>
    <VimeDash
      src="/media/manifest.mpd"
      :config="dashConfig"
      version="latest"
      poster="/media/poster.png"
    />
    <!-- ... -->
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeDash } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeDash,
    },

    data: {
      /**
       * @see https://github.com/Dash-Industry-Forum/dash.js.
       */
      dashConfig: {
        // ...
      },
    },
  };
</script>
```
