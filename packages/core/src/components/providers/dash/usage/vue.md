```html {3-8,14,19} title="example.vue"
<template>
  <Player controls>
    <Dash
      src="/media/manifest.mpd"
      :config="dashConfig"
      version="latest"
      poster="/media/poster.png"
    />
    <!-- ... -->
  </Player>
</template>

<script>
  import { Player, Dash } from '@vime/vue';

  export default {
    components: {
      Player,
      Dash,
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
