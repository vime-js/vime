```html {7,18,26} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Controls>
        <SettingsControl />
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Controls, SettingsControl } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      SettingsControl,
    },
  };
</script>
```
