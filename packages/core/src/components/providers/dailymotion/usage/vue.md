```html {3,9,14} title="example.vue"
<template>
  <VimePlayer controls>
    <VimeDailymotion videoId="k3b11PemcuTrmWvYe0q" />
    <!-- ... -->
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeDailymotion } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeDailymotion,
    },
  };
</script>
```
