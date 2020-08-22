```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeClickToPlay />
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeClickToPlay } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeClickToPlay,
    },
  };
</script>
```
