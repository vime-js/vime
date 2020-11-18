<template>
  <div class="tapSidesToSeek">
    <div class="tapTarget backward" @click="onSeekBackward" />
    <div class="spacer" />
    <div class="tapTarget forward" @click="onSeekForward" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Mixin } from '@vime/vue';

@Component({
  /**
   * This is mainly where the magic happens. The mixin (1) binds the requested properties to 
   * the closest ancestor player element, as properties update on the player, they will be 
   * updated here. (2) There are watchers setup so that when one of the given properties 
   * are changed, it will dispatch an update to the player. (3) An additional `player` property 
   * is bound incase we need to interact with it directly (`this.player`).
   */
  mixins: [Mixin([
    'currentTime',
    'duration',
  ])]
})
export default class TapSidesToSeek extends Vue {
  // Use the player DOM ref if you need to call any methods.
  player!: HTMLVmPlayerElement;

  currentTime = 0;

  duration = -1;

  @Watch('currentTime')
  onTimeChange() {
    // console.log(this.currentTime);
  }

  onSeekBackward() {
    if (this.currentTime < 5) return;
    this.currentTime -= 5;
  };

  onSeekForward() {
    if (this.currentTime > (this.duration - 5)) return;
    this.currentTime += 5;
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
    /* 
      Why 21? Simply because it's one index above the `ClickToPlay` component. Click the link
      below and scroll down to the `Z-Index` section to see existing levels.

      @see https://github.com/vime-js/vime/blob/master/packages/core/src/globals/themes/default.css
    */
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