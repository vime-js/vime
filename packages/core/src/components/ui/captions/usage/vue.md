```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeCaptions />
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeCaptions } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeCaptions,
    },
  };
</script>
```
