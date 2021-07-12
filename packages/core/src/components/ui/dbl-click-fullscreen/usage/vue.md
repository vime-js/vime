```html {6,12,18} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <DblClickFullscreen />
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, DblClickFullscreen } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      DblClickFullscreen,
    },
  };
</script>
```
