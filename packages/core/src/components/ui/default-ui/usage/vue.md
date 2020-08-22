```html {4,9,14} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeDefaultUi />
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeDefaultUi } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeDefaultUi,
    },
  };
</script>
```
