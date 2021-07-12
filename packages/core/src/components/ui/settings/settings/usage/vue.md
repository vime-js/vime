```html {6-8,14,20} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Settings>
        <!-- ... -->
      </Settings>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Settings } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Settings,
    },
  };
</script>
```
