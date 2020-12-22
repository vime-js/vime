```html {6-8,14,20} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <LoadingScreen>
        <!-- Pass in content here such as a logo (optional). -->
      </LoadingScreen>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, LoadingScreen } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      LoadingScreen,
    },
  };
</script>
```
