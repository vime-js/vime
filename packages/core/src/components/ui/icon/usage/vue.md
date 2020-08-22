```html {4-6,9,14,18} title="example.vue"
<template>
  <div>
    <!-- Markup -->
    <VimeIcon>
      <rect width="300" height="100" />
    </VimeIcon>

    <!-- URL -->
    <VimeIcon href="#vime-play" />
  </div>
</template>

<script>
  import { VimeIcon } from '@vime/vue';

  export default {
    components: {
      VimeIcon,
    },
  };
</script>
```
