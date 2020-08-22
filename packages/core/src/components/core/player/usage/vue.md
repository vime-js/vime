```html {2-16,20,24-25} title="example.vue"
<template>
  <VimePlayer
    controls
    autoplay
    muted
    ref="player"
    :currentTime="currentTime"
    @vCurrentTimeChange="onTimeUpdate"
    @vFullscreenChange="onFullscreenChange"
  >
    <!-- Provider component is placed here. -->

    <VimeUi>
      <!-- UI components are placed here. -->
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import { VimePlayer, VimeUi } from '@vime/vue';

  export default {
    components: {
      VimePlayer,
      VimeUi,
    },

    computed: {
      player() {
        return this.$refs.player;
      },
    },

    data: {
      currentTime: 0,
    },

    methods: {
      // Example function to showcase updating property.
      seekForward() {
        this.currentTime = this.currentTime + 5;
      },

      // Example function to showcase calling player method.
      enterFullscreen() {
        this.player.enterFulllscreen();
      },

      onTimeUpdate(time: number) {
        this.currentTime = time;
      },

      onFullscreenChange(active: boolean) {
        const isFullscreen = active;
        // ...
      },
    },
  };
</script>
```
