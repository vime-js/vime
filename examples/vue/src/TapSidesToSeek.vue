<template>
  <div class="tapSidesToSeek">
    <div class="tapTarget backward" @click="onSeekBackward" />
    <div class="spacer" />
    <div class="tapTarget forward" @click="onSeekForward" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PlayerDispatcher, PlayerProp, usePlayerContext, createPlayerDispatcher } from '@vime/vue';

@Component()
export default class TapSidesToSeek extends Vue {
  dispatch!: PlayerDispatcher;

  currentTime = 0;

  duration = -1;

  mounted() {
    /**
     * Here we are creating a dispatcher to send updates to the player.
     */
    this.dispatch = createPlayerDispatcher(this.$el);

    /**
     * Here we are requesting to receive updates from the player, as the property changes it will be 
     * updated here.
     */
    usePlayerContext(
      this.$el,
      [PlayerProp.currentTime, PlayerProp.duration],
      (prop, value) => { this[prop] = value; },
    );
  }

  onSeekBackward() {
    if (this.currentTime < 5) return;
    // We are dispatching an update to the player to change the `currentTime` property.
    this.dispatch(PlayerProp.currentTime, this.currentTime - 5)
  };

  onSeekForward() {
    if (this.currentTime > (this.duration - 5)) return;
    this.dispatch(PlayerProp.currentTime, this.currentTime + 5)
  };
}
</script>

<style>
  .tapSidesToSeek {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 21;
    pointer-events: none;
  }

  .tapSidesToSeek > .spacer {
    flex: 1;
  }

  .tapSidesToSeek > .tapTarget {
    width: 7.5%;
    height: 100%;
    pointer-events: auto;
  }
</style>