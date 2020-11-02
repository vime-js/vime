<template>
  <div id="app">
    <div id="container">
      <VimePlayer
        playsinline
        ref="player"
        @vPlaybackReady="onPlaybackReady"
      >
        <VimeVideo poster="https://media.vimejs.com/poster.png">
          <source data-src="https://media.vimejs.com/720p.mp4" type="video/mp4">
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
import { defineComponent, ref } from 'vue';
import { VimePlayer, VimeVideo, VimeDefaultUi } from '@vime/vue-next';

// Default theme.
import '@vime/core/themes/default.css';

// Optional light theme (extends default).
// import '@vime/core/themes/light.css';

// Custom UI Component.
import TapSidesToSeek from './TapSidesToSeek.vue';

export default defineComponent({
  name: 'App',
  components: {
    VimePlayer,
    VimeVideo,
    VimeDefaultUi,
    TapSidesToSeek,
  },
  setup() {
    // Obtain a ref if you need to call any methods.
    const player = ref<HTMLVimePlayerElement | null>(null);
    return { player };
  },
  methods: {
    onPlaybackReady() {
      // ...
    }
  },
});
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
