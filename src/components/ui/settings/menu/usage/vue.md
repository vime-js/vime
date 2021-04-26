```html {6-14,20,26} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <menu
        identifer="menu-id"
        controller="menu-controller-id"
        :active="isMenuActive"
        @vmOpen="onOpen"
        @vmClose="onClose"
      >
        <!-- ... -->
      </menu>
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, Menu } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Menu,
    },
    data: {
      isMenuActive: false,
    },
    methods: {
      onOpen() {
        this.isMenuActive = true;
      },

      onClose() {
        this.isMenuActive = false;
      },
    },
  };
</script>
```
