```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeSkeleton />
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeSkeleton } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeSkeleton,
    },
  };
</script>
```
