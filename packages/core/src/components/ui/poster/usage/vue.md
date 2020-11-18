```html {6,12,18} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Poster />
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Poster } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Poster,
    },
  };
</script>
```
