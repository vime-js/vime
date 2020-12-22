```html {7,18,26} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Controls>
        <LiveIndicator />
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import {
    Player,
    Ui,
    Controls,
    LiveIndicator,
  } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      LiveIndicator,
    },
  };
</script>
```
