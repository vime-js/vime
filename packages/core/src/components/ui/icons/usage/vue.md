```html {6,12,18} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeIcons href="/icons/sprite.svg">
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeIcons } from "@vime/vue";

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeIcons,
    },
  };
</script>
```
