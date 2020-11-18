```html {3,9,14} title="example.vue"
<template>
  <Player controls>
    <Vimeo videoId="411652396" />
    <!-- ... -->
  </Player>
</template>

<script>
  import { Player, Vimeo } from '@vime/vue';

  export default {
    components: {
      Player,
      Vimeo,
    },
  };
</script>
```
