```html {4-6,11,16} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
    },
  };
</script>
```
