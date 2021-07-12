```html {3-6,12,17} title="example.vue"
<template>
  <Player controls>
    <audio>
      <source data-src="/media/audio.mp3" type="audio/mp3" />
      <!-- <source> and <track> elements are placed here. -->
    </audio>
    <!-- ... -->
  </Player>
</template>

<script>
  import { Player, Audio } from '@vime/vue';

  export default {
    components: {
      Player,
      Audio,
    },
  };
</script>
```
