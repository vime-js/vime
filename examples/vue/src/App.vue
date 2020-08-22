<template>
  <div id="app">
    <div id="container">
      <VimePlayer
        muted
        playsinline 
        ref="player"
        @vPlaybackReady="onPlaybackReady"
      >
        <VimeVideo poster="http://localhost:3335/poster.png">
          <source data-src="http://localhost:3335/720p.mp4" type="video/mp4">
        </VimeVideo>

        <VimeDefaultUi />
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

@Component({
  components: {
    VimePlayer,
    VimeVideo,
    VimeDefaultUi,
  },
})
export default class App extends Vue {
  get player() {
    return this.$refs.player as HTMLVimePlayerElement;
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
