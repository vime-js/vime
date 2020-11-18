```html {7-9,16,23} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Settings>
        <Submenu label="Title">
          <!-- ... -->
        </Submenu>
      </Settings>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Settings, Submenu } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Settings,
      Submenu,
    },
  };
</script>
```
