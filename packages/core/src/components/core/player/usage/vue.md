```html {2-16,20,24-25} title="example.vue"
<template>
  <Player
    controls
    autoplay
    muted
    ref="player"
    :currentTime="currentTime"
    @vmCurrentTimeChange="onTimeUpdate"
    @vmFullscreenChange="onFullscreenChange"
  >
    <!-- Provider component is placed here. -->

    <Ui>
      <!-- UI components are placed here. -->
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
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
