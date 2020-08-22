```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeScrim />
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeScrim } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeScrim,
    },
  };
</script>
```
