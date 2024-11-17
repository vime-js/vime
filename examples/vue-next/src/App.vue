<template>
  <div id="app">
    <div id="container">
      <Player playsinline ref="player" @vPlaybackReady="onPlaybackReady">
        <Video poster="https://files.vidstack.io/agent-327/poster.png">
          <source
            data-src="https://files.vidstack.io/agent-327/720p.mp4"
            type="video/mp4"
          />
        </Video>

        <DefaultUi>
          <!-- Custom UI component. -->
          <TapSidesToSeek />
        </DefaultUi>
      </Player>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Player, Video, DefaultUi } from '@vime/vue-next';

// Default theme.
import '@vime/core/themes/default.css';

// Optional light theme (extends default).
// import '@vime/core/themes/light.css';

// Custom UI Component.
import TapSidesToSeek from './TapSidesToSeek.vue';

export default defineComponent({
  name: 'App',
  components: {
    Player,
    Video,
    DefaultUi,
    TapSidesToSeek,
  },
  setup() {
    // Obtain a ref if you need to call any methods.
    const player = ref<HTMLVmPlayerElement | null>(null);
    return { player };
  },
  methods: {
    onPlaybackReady() {
      // ...
    },
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
