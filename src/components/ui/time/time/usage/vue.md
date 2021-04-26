```html {2,6,10} title="example.vue"
<template>
  <time label="Time" :seconds="120" />
</template>

<script>
  import { Time } from '@vime/vue';

  export default {
    components: {
      Time,
    },
  };
</script>
```
