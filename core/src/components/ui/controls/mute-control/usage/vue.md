```html {7,14,21} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Controls>
        <MuteControl />
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Controls, MuteControl } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      MuteControl,
    },
  };
</script>
```
