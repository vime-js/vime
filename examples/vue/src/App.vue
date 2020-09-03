<template>
  <div id="app">
    <div id="container">
      <VimePlayer
        playsinline 
        ref="player"
        @vPlaybackReady="onPlaybackReady"
      >
        <VimeVideo poster="https://vimejs.com/media/poster.png">
          <source data-src="https://vimejs.com/media/720p.mp4" type="video/mp4">
        </VimeVideo>

        <VimeDefaultUi>
          <!-- Custom UI component. -->
          <TapSidesToSeek />
        </VimeDefaultUi>
      </VimePlayer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { VimePlayer, VimeVideo, VimeDefaultUi } from '@vime/vue';

// Default theme.
import '@vime/core/themes/default.css';

// Optional light theme (extends default).
// import '@vime/core/themes/light.css';

// Custom UI Component.
import TapSidesToSeek from './TapSidesToSeek.vue';

@Component({
  components: {
    VimePlayer,
    VimeVideo,
    VimeDefaultUi,
    TapSidesToSeek,
  },
})
export default class App extends Vue {
  // Obtain a ref if you need to call any methods.
  get player() {
    return this.$refs.player;
  }

  onPlaybackReady() {
    // ...
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#container {
  width: 100%;
  max-width: 960px;
}
</style>
