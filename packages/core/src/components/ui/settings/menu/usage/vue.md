```html {6-14,20,26} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeMenu
        identifer="menu-id"
        controller="menu-controller-id"
        :active="isMenuActive"
        @vOpen="onOpen"
        @vClose="onClose"
      >
        <!-- ... -->
      </VimeMenu>
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi, VimeMenu } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeMenu,
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
