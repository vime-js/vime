```html {5-7,13,19} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <Controls fullWidth :activeDuration="3200">
        <!-- ... -->
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Controls } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
    },
  };
</script>
```
