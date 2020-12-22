```html {7,14,21} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Controls>
        <PipControl />
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Controls, PipControl } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      PipControl,
    },
  };
</script>
```
