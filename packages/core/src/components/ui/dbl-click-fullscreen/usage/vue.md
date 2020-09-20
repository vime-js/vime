```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeDblClickFullscreen />
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeDblClickFullscreen } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeDblClickFullscreen,
    },
  };
</script>
```
