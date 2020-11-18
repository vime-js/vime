```html {7,14,21} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Settings>
        <MenuItem label="Playback Quality" hint="Auto" />
      </Settings>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Settings, MenuItem } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Settings,
      MenuItem,
    },
  };
</script>
```
