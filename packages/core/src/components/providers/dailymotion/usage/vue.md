```html {3,9,14} title="example.vue"
<template>
  <Player controls>
    <Dailymotion videoId="k3b11PemcuTrmWvYe0q" />
    <!-- ... -->
  </Player>
</template>

<script>
  import { Player, Dailymotion } from '@vime/vue';

  export default {
    components: {
      Player,
      Dailymotion,
    },
  };
</script>
```
