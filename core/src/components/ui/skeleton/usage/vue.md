```html {6,12,18} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Skeleton />
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Skeleton } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Skeleton,
    },
  };
</script>
```
