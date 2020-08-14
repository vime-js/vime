<template>
  <div id="app">
    <div id="container">
      <VimePlayer playsinline @vPlayingChange="onPlaying">
        <VimeYoutube videoId="DyTCOwB0DVw" />
        <VimeDefaultUi />
      </VimePlayer>
    </div>
  </div>
</template>

<script lang="ts">
import '@vime/vue/dist/vime.css';
import { Component, Vue } from 'vue-property-decorator';
import { VimePlayer, VimeYoutube, VimeDefaultUi } from '@vime/vue';

@Component({
  components: {
    VimePlayer,
    VimeYoutube,
    VimeDefaultUi,
  },
})
export default class App extends Vue {
  onPlaying(isPlaying: boolean) {
    console.log('playing:', isPlaying);
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

#app > #container {
  width: 100%;
  max-width: 960px;
}
</style>
