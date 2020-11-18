```html {3,9,14} title="example.vue"
<template>
  <Player controls>
    <Youtube videoId="DyTCOwB0DVw" />
    <!-- ... -->
  </Player>
</template>

<script>
  import { Player, Youtube } from '@vime/vue';

  export default {
    components: {
      Player,
      Youtube,
    },
  };
</script>
```
