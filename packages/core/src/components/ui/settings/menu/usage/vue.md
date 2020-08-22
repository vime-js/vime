```html {6-12,18,24} title="example.vue"
<template>
  <VimePlayer>
    <!-- ... -->
    <VimeUi>
      <!-- ... -->
      <VimeMenu
        identifer="menu-id"
        controller="menu-controller-id"
        :active="isMenuActive"
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
  };
</script>
```
