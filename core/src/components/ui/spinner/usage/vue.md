```html {6,12,18} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Spinner />
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Spinner } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Spinner,
    },
  };
</script>
```
