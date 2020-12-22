```html {6,12,18} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <ClickToPlay />
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, ClickToPlay } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      ClickToPlay,
    },
  };
</script>
```
