```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimePoster />
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimePoster } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimePoster,
    },
  };
</script>
```
