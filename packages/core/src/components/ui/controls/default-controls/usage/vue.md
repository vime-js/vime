```html {6,12,18} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <DefaultControls :activeDuration="3200" />
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, DefaultControls } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      DefaultControls,
    },
  };
</script>
```
