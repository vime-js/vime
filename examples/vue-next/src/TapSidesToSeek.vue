<template>
  <div class="tapSidesToSeek" ref="domRef">
    <div class="tapTarget backward" @click="onSeekBackward" />
    <div class="spacer" />
    <div class="tapTarget forward" @click="onSeekForward" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { usePlayer, usePlayerContext } from '@vime/vue-next';

export default defineComponent({
  name: 'TapSidesToSeek',
  setup() {
    const domRef = ref<HTMLDivElement | null>(null);

    // Use the player DOM ref if you need to call any methods.
    const player = usePlayer(domRef);

    // These properties are bound to the player, they will stay in-sync and when changed inside
    // this component it will automatically update the player.
    const currentTime = usePlayerContext(domRef, 'currentTime', 0);
    const duration = usePlayerContext(domRef, 'duration', -1);

    // `usePlayerContext` returns a `Ref` object so you can watch them for changes.
    watch(currentTime, () => {
      // console.log(currentTime.value);
    });

    return { domRef, player, currentTime, duration };
  },
  methods: {
    onSeekBackward() {
      if (this.currentTime < 5) return;
      // We are dispatching an update to the player to change the `currentTime` property.
      this.currentTime -= 5;
    },

    onSeekForward() {
      if (this.currentTime > this.duration - 5) return;
      this.currentTime += 5;
    },
  },
});
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

      @see https://github.com/vime-js/vime/blob/src/globals/themes/default.css
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
