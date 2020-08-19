<template>
  <div id="app">
    <div id="container">
      <VimePlayer
        muted
        playsinline 
        :currentTime="currentTime"
        @vCurrentTimeChange="onTimeUpdate"
      >
        <VimeVideo crossOrigin="true" poster="http://localhost:3335/poster.png">
          <source data-src="http://localhost:3335/720p.mp4" type="video/mp4">
        </VimeVideo>

        <VimeDefaultUi />
      </VimePlayer>

      <div id="buttons">
		    <button @click="onSeekBackward">-5s</button>
    		<button @click="onSeekForward">+5s</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { VimePlayer, VimeVideo, VimeDefaultUi } from '@vime/vue';
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
  currentTime = 0;
  
  onTimeUpdate(time: number) {
    this.currentTime = time;
  }

  onSeekBackward() {
    this.currentTime -= 5;
  }

  onSeekForward() {
    this.currentTime += 5;
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

#buttons {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
}

#buttons > button {
  margin-left: 8px;
}

#buttons > button:first-child {
  margin-left: 0px;
}
</style>
