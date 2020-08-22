```html {3,9,14} title="example.vue"
<template>
  <VimePlayer controls>
    <VimeYoutube videoId="DyTCOwB0DVw" />
    <!-- ... -->
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeYoutube } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeYoutube,
    },
  };
</script>
```
