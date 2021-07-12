```html {7,18,26} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Controls>
        <ScrubberControl />
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Controls, ScrubberControl } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      ScrubberControl,
    },
  };
</script>
```
